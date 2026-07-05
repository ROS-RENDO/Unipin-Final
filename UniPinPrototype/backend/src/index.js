import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import crypto from 'crypto'
import 'dotenv/config'
import { db, saveDb } from './db.js'
import { buildValidateRequest, buildOrderCreateRequest, buildInquiryRequest, buildListRequest, buildDetailRequest } from './models.js'
import { OrderFactory } from './patterns/factory/OrderFactory.js';
import { OrderType } from './enums.js';
import { PaymentProcessor } from './domain/PaymentProcessor.js';
import { CreditCardStrategy, BankTransferStrategy } from './patterns/strategy/paymentStrategies.js';
import { PublisherFacade } from './patterns/facade/PublisherFacade.js';
import { GamePublisherAPI } from './domain/GamePublisherAPI.js';

const app = express()

// Enhanced CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(morgan('dev'))

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  })
})

const getUserByUserId = (userId) => db.prepare('SELECT * FROM users WHERE userId = ?').get(userId)
const saveUser = (payload) => db.prepare('INSERT OR REPLACE INTO users (userId, serverId, username, validatedAt) VALUES (?, ?, ?, ?)').run(payload.userId, payload.serverId, payload.username, new Date().toISOString())
const saveOrder = (payload) => db.prepare('INSERT INTO orders (flowId, userId, serverId, username, supplierCheckoutRequest, supplierCheckoutResult, supplierDeliveryRequest, supplierDeliveryResult, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(payload.flowId, payload.userId, payload.serverId, payload.username, JSON.stringify(payload.supplierCheckoutRequest), JSON.stringify(payload.supplierCheckoutResult), JSON.stringify(payload.supplierDeliveryRequest), JSON.stringify(payload.supplierDeliveryResult), payload.status, payload.createdAt)

app.post('/in-game-topup/user/validate', (req, res) => {
  const { userId, serverId, username } = req.body
  if (!userId || !serverId || !username) {
    return res.status(400).json({ success: false, message: 'Missing userId, serverId, or username' })
  }

  const payload = buildValidateRequest({ userId, serverId, username })
  saveUser(payload)
  saveDb()

  return res.json({
    success: true,
    SupplierGetServerListRequest: { serverId, username },
    SupplierGetServerListResult: { servers: ['Asia', 'Europe', 'North America'] },
    message: 'Validation successful',
  })
})

app.post('/in-game-topup/list', (req, res) => {
  const { username } = req.body
  if (!username) {
    return res.status(400).json({ success: false, message: 'Missing username' })
  }

  const payload = buildListRequest({ username })

  return res.json({
    success: true,
    request: payload,
    SupplierInquiryResult: {
      availableGames: ['Mobile Legends', 'PUBG Mobile', 'Genshin Impact', 'Valorant', 'Free Fire'],
    },
  })
})

app.post('/in-game-topup/detail', (req, res) => {
  const { flowId, userId } = req.body
  if (!flowId || !userId) {
    return res.status(400).json({ success: false, message: 'Missing flowId or userId' })
  }

  const payload = buildDetailRequest({ flowId, userId })

  return res.json({
    success: true,
    request: payload,
    SupplierInquiryResult: {
      flowId,
      status: 'ready',
      gameDetails: {
        name: 'Mobile Legends',
        server: 'Asia',
        diamonds: 514,
      },
    },
  })
})

app.post('/in-game-topup/order/create', async (req, res) => {
  const { flowId, userId, serverId, username, SupplierCheckoutRequest } = req.body
  if (!flowId || !userId || !serverId || !username || !SupplierCheckoutRequest) {
    return res.status(400).json({ success: false, message: 'Missing order creation fields' })
  }

  const orderDetails = {
    orderId: `TX-${Math.floor(Math.random() * 900000) + 100000}`,
    playerId: userId,
    zoneId: serverId,
    gameCode: SupplierCheckoutRequest.gameCode || 'UNKNOWN',
    baseAmount: SupplierCheckoutRequest.amount,
  };
  
  const order = OrderFactory.createOrder(OrderType.STANDARD, orderDetails);

  const requestPayload = buildOrderCreateRequest({ flowId, userId, serverId, username, supplierCheckoutRequest: SupplierCheckoutRequest })

  const result = {
    Success: true,
    SupplierCheckoutResult: {
      transactionId: order.orderId,
      status: 'approved',
      amount: order.getFinalPrice(),
    },
  }

  saveOrder({
    flowId,
    userId,
    serverId,
    username,
    supplierCheckoutRequest: SupplierCheckoutRequest,
    supplierCheckoutResult: result.SupplierCheckoutResult,
    supplierDeliveryRequest: null,
    supplierDeliveryResult: null,
    status: order.getStatusString().toLowerCase(),
    createdAt: new Date().toISOString(),
  })
  saveDb()

  return res.json({ success: true, orderId: order.orderId, SupplierCheckoutResult: result.SupplierCheckoutResult })
})

app.post('/in-game-topup/order/inquiry', (req, res) => {
  const { flowId, userId } = req.body
  if (!flowId || !userId) {
    return res.status(400).json({ success: false, message: 'Missing flowId or userId' })
  }

  const order = db.prepare('SELECT * FROM orders WHERE flowId = ? AND userId = ?').get(flowId, userId)

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' })
  }

  return res.json({
    success: true,
    SupplierInquiryResult: {
      flowId,
      status: order.status,
      delivery: order.supplierDeliveryResult ? JSON.parse(order.supplierDeliveryResult) : null,
    },
  })
})

const ABA_MERCHANT_ID = process.env.ABA_MERCHANT_ID;
const ABA_PUBLIC_KEY = process.env.ABA_PUBLIC_KEY;
const ABA_API_URL = process.env.ABA_API_URL;

const getReqTime = () => {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
};

const generateAbaHash = (reqTime, tranId, amount, itemsBase64, returnUrlBase64, paymentOption = 'abapay_khqr') => {
  // Required string order for ABA: req_time + merchant_id + tran_id + amount + items + payment_option + return_url
  // Use BASE64 ENCODED values for hash calculation
  const dataString = reqTime + ABA_MERCHANT_ID + tranId + amount + itemsBase64 + paymentOption + returnUrlBase64;
  console.log('Hash input string:', dataString);
  return crypto.createHmac('sha512', ABA_PUBLIC_KEY).update(dataString).digest('base64');
};

app.post('/in-game-topup/aba/checkout', async (req, res) => {
  const { amount, method } = req.body;
  if (!amount) {
    return res.status(400).json({ success: false, message: 'Missing amount' });
  }

  const processor = new PaymentProcessor();
  if (method === 'credit_card') {
    processor.setStrategy(new CreditCardStrategy());
  } else {
    processor.setStrategy(new BankTransferStrategy());
  }
  await processor.processPayment(amount);

  // The ABA sandbox merchant (ec476567) is configured for KHR (Cambodian Riel).
  // Convert USD to KHR (e.g., $1 = 4000 KHR) and ensure it's a whole number string.
  const khrAmount = Math.round(Number(amount) * 4000);
  const formattedAmount = khrAmount.toString();
  const req_time = getReqTime();
  const tran_id = `TX-${Math.floor(Math.random() * 900000000) + 100000000}`;

  const itemsRaw = JSON.stringify([{ name: 'Game Topup', quantity: '1', price: formattedAmount }]);
  const returnUrlRaw = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/history`;

  const items = Buffer.from(itemsRaw).toString('base64');
  const return_url = Buffer.from(returnUrlRaw).toString('base64');

  const hash = generateAbaHash(req_time, tran_id, formattedAmount, items, return_url);

  // Build the form body to POST to ABA PayWay
  const formBody = new URLSearchParams({
    req_time,
    merchant_id: ABA_MERCHANT_ID,
    tran_id,
    amount: formattedAmount,
    items,
    hash,
    return_url,
    payment_option: 'abapay_khqr',
  });

  try {
    // Call ABA PayWay server-side — get QR code back without navigating the user away
    const abaResponse = await fetch(ABA_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody.toString(),
    });

    const abaData = await abaResponse.json();
    console.log('ABA response:', JSON.stringify(abaData?.status));

    if (abaData.status?.code === '00') {
      return res.json({
        success: true,
        qrImage: abaData.qrImage,
        qrString: abaData.qrString,
        deeplink: abaData.abapay_deeplink,
        tranId: tran_id,
      });
    } else {
      return res.status(502).json({
        success: false,
        message: abaData.status?.message || 'ABA PayWay request failed',
      });
    }
  } catch (err) {
    console.error('ABA fetch error:', err);
    return res.status(500).json({ success: false, message: 'Failed to reach ABA PayWay' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
