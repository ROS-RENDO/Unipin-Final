import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { db, saveDb } from './db.js'
import { buildValidateRequest, buildOrderCreateRequest, buildInquiryRequest, buildListRequest, buildDetailRequest } from './models.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

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

app.post('/in-game-topup/order/create', (req, res) => {
  const { flowId, userId, serverId, username, SupplierCheckoutRequest } = req.body
  if (!flowId || !userId || !serverId || !username || !SupplierCheckoutRequest) {
    return res.status(400).json({ success: false, message: 'Missing order creation fields' })
  }

  const requestPayload = buildOrderCreateRequest({ flowId, userId, serverId, username, supplierCheckoutRequest: SupplierCheckoutRequest })

  const result = {
    Success: true,
    SupplierCheckoutResult: {
      transactionId: `TX-${Math.floor(Math.random() * 900000) + 100000}`,
      status: 'approved',
      amount: SupplierCheckoutRequest.amount,
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
    status: 'created',
    createdAt: new Date().toISOString(),
  })
  saveDb()

  return res.json({ success: true, orderId: result.SupplierCheckoutResult.transactionId, SupplierCheckoutResult: result.SupplierCheckoutResult })
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

app.listen(4000, () => {
  console.log('Backend running on http://localhost:4000')
})
