require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const crypto  = require('crypto');

// ── SSE: Live Log Streaming to Frontend Terminal ──
// Stores all connected SSE clients so logs can be broadcast
const sseClients = new Set();

// Tag colors for each pattern (shown in terminal)
const TAG_COLORS = {
  'Singleton':    '🟡',
  'Builder':      '🟢',
  'State':        '🔴',
  'Facade':       '🟠',
  'Strategy':     '🔵',
  'Factory':      '🟣',
  'AbstractFactory': '🟣',
};

// Override console.log so every log also streams to connected browsers
const _origLog = console.log.bind(console);
console.log = (...args) => {
  _origLog(...args); // still print to real terminal
  const message = args.join(' ');
  // Broadcast to all SSE clients
  if (sseClients.size > 0) {
    const payload = JSON.stringify({ message, ts: Date.now() });
    sseClients.forEach(client => {
      try { client.write(`data: ${payload}\n\n`); } catch (_) { sseClients.delete(client); }
    });
  }
};

// ── Import ALL Design Patterns ──
const { GameCatalog }       = require('./patterns/GameCatalog');       // CREATIONAL: Singleton
const { OrderBuilder }      = require('./patterns/OrderBuilder');       // CREATIONAL: Builder
const { ABAPayFactory, ACLEDAPayFactory, PaymentProcessor } = require('./patterns/PaymentStrategy'); // CREATIONAL: Abstract Factory + BEHAVIORAL: Strategy
const { TopUpOrder }        = require('./patterns/OrderState');         // BEHAVIORAL: State
const { PublisherFacade }   = require('./patterns/PublisherFacade');    // STRUCTURAL: Facade

// ── Initialize Singletons & Instances ──
const catalog  = GameCatalog.getInstance();   // Singleton — one global catalog
const facade   = new PublisherFacade();        // Facade — gateway to all publishers

// ── ABA Config from .env ──
const ABA_CONFIG = {
    merchantId: process.env.ABA_MERCHANT_ID,
    publicKey:  process.env.ABA_PUBLIC_KEY,
    apiUrl:     process.env.ABA_API_URL,
};

const app = express();
app.use(cors());
app.use(express.json());

// In-memory order store (demo)
const orders = {};

// ────────────────────────────────────────────────────────────────────────────
// ROOT
// ────────────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({
        service: 'UniPin Backend API',
        patterns: ['Singleton', 'Builder', 'AbstractFactory', 'Strategy', 'State', 'Facade'],
        frontend: 'http://localhost:5173',
    });
});

// ────────────────────────────────────────────────────────────────────────────
// SINGLETON — GameCatalog Routes
// ────────────────────────────────────────────────────────────────────────────

// GET /api/games — returns all games from the singleton catalog
app.get('/api/games', (req, res) => {
    const games = catalog.getAllGames();
    res.json({ success: true, games: games.map(g => ({
        gameCode: g.gameCode, name: g.name, publisher: g.publisher,
        packages: g.packages.map(p => ({ packageId: p.packageId, amount: p.amount, price: p.price }))
    }))});
});

// GET /api/games/:code — single game from singleton
app.get('/api/games/:code', (req, res) => {
    const game = catalog.getGameById(req.params.code);
    if (!game) return res.status(404).json({ success: false, error: 'Game not found' });
    res.json({ success: true, game });
});

// ────────────────────────────────────────────────────────────────────────────
// SINGLETON + FACADE — Player Verification
// ────────────────────────────────────────────────────────────────────────────

// POST /api/verify — uses Facade to validate player against publisher API
app.post('/api/verify', async (req, res) => {
    const { gameCode, playerId, zoneId } = req.body;

    if (!playerId || String(playerId).trim().length < 4) {
        return res.status(400).json({ success: false, error: 'Player ID must be at least 4 characters' });
    }

    // Verify game exists in catalog (Singleton)
    const game = catalog.getGameById(gameCode);
    if (!game) return res.status(404).json({ success: false, error: 'Game not found in catalog' });

    try {
        // Delegate to Facade — hides publisher API complexity
        const result = await facade.validatePlayer(gameCode, String(playerId).trim(), zoneId);
        if (result.isValid) {
            res.json({ success: true, isValid: true, username: result.username });
        } else {
            // Demo fallback: accept any 4+ char ID
            res.json({ success: true, isValid: true, username: `Player_${String(playerId).trim().slice(-4)}` });
        }
    } catch (err) {
        res.json({ success: true, isValid: true, username: `Player_${String(playerId).trim().slice(-4)}` });
    }
});

// GET /api/test-ids/:gameCode — test player IDs for demo purposes
app.get('/api/test-ids/:gameCode', (req, res) => {
    const testIds = facade.getTestIds(req.params.gameCode.toUpperCase());
    res.json({ success: true, gameCode: req.params.gameCode.toUpperCase(), testIds });
});

// GET /api/servers/:gameCode — get server list via Facade
app.get('/api/servers/:gameCode', (req, res) => {
    const servers = facade.getServerList(req.params.gameCode.toUpperCase());
    res.json({ success: true, servers });
});

// ────────────────────────────────────────────────────────────────────────────
// SINGLETON — Promo Code Validation (Admin managed in GameCatalog)
// ────────────────────────────────────────────────────────────────────────────

// POST /api/promo/validate — validates promo via Singleton catalog
app.post('/api/promo/validate', (req, res) => {
    const { code } = req.body;
    if (!code) return res.status(400).json({ success: false, error: 'Promo code required' });
    const result = catalog.validatePromoCode(code);
    if (result.success) {
        res.json(result);
    } else {
        res.status(400).json(result);
    }
});

// ────────────────────────────────────────────────────────────────────────────
// ABSTRACT FACTORY — ABA Payment Config
// ────────────────────────────────────────────────────────────────────────────

// GET /api/payment/aba-config — expose merchant config to frontend
app.get('/api/payment/aba-config', (req, res) => {
    res.json({ merchantId: ABA_CONFIG.merchantId, apiUrl: ABA_CONFIG.apiUrl });
});

// ────────────────────────────────────────────────────────────────────────────
// BUILDER + STATE + STRATEGY + ABSTRACT FACTORY + FACADE — Order Payment
// ────────────────────────────────────────────────────────────────────────────

// POST /api/order/pay — the main checkout endpoint using ALL patterns
app.post('/api/order/pay', async (req, res) => {
    const { gameCode, playerId, zoneId, packageId, amount, basePrice, discountPercentage, finalPrice, paymentMethod } = req.body;

    try {
        // ── BUILDER PATTERN: Construct the order step-by-step ──
        const builtOrder = new OrderBuilder()
            .setGameCode(gameCode)
            .setPlayer(playerId, zoneId || '')
            .setPackage(packageId, amount, basePrice || finalPrice)
            .applyPromoCode(discountPercentage || 0)
            .build();

        // ── STATE PATTERN: Create order with state lifecycle ──
        const order = new TopUpOrder(builtOrder.orderId, gameCode, playerId, amount);
        orders[order.id] = order;

        // ── ABSTRACT FACTORY PATTERN: Select the right factory ──
        const factory = paymentMethod === 'ABA' ? new ABAPayFactory() : new ACLEDAPayFactory();

        // ── STRATEGY PATTERN: Create payment handler via factory ──
        const paymentStrategy = factory.createPaymentHandler();
        const receiptGenerator = factory.createReceiptGenerator();

        // ── STRATEGY PATTERN: Process payment ──
        const processor = new PaymentProcessor(paymentStrategy);
        const paymentResult = processor.processPayment(builtOrder.getFinalPrice());

        // ── STATE PATTERN: Transition Pending → Paid ──
        order.addTransaction(paymentMethod, builtOrder.getFinalPrice(), paymentResult.success ? 'Success' : 'Failed');
        order.pay();

        if (!paymentResult.success) {
            order.deliver(false); // Transition to Failed
            return res.status(402).json({ success: false, error: 'Payment declined by gateway', state: order.getStatus() });
        }

        // ── FACADE PATTERN: Deliver currency via publisher ──
        const delivery = await facade.deliverCurrency(gameCode, playerId, order.id, amount);

        // ── STATE PATTERN: Transition Paid → Completed or Failed ──
        order.deliver(delivery.success);

        // ── ABSTRACT FACTORY: Generate receipt ──
        const receipt = receiptGenerator.generate(builtOrder, paymentResult);

        // ── ABA HMAC Hash ──
        let abaHash = null;
        if (paymentMethod === 'ABA' && ABA_CONFIG.publicKey) {
            const reqTime = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 12);
            const hashInput = `${reqTime}${ABA_CONFIG.merchantId}${order.id}${builtOrder.getFinalPrice().toFixed(2)}`;
            abaHash = crypto.createHmac('sha512', ABA_CONFIG.publicKey).update(hashInput).digest('base64');
        }

        res.json({
            success: true,
            transactionId: order.id,
            orderId:       order.id,
            state:         order.getStatus(),
            receipt,
            abaHash,
            delivery:      { providerTxnId: delivery.providerTxnId, deliveredAt: delivery.deliveredAt },
        });

    } catch (err) {
        console.error('[Order Pay Error]', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ────────────────────────────────────────────────────────────────────────────
// STATE — Transaction History
// ────────────────────────────────────────────────────────────────────────────

// GET /api/history — returns all orders with their state
app.get('/api/history', (req, res) => {
    const formattedOrders = Object.values(orders).map(order => ({
        id:           order.id,
        gameCode:     order.gameCode,
        playerId:     order.playerId,
        amount:       order.amount,
        state:        order.getStatus(),
        transactions: order.transactions,
    }));
    res.json({ success: true, orders: formattedOrders });
});

// ────────────────────────────────────────────────────────────────────────────
// SSE — Live Log Stream Endpoint
// ────────────────────────────────────────────────────────────────────────────
app.get('/api/logs/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders();

    // Send welcome message
    res.write(`data: ${JSON.stringify({ message: '🔌 Terminal connected — waiting for backend events...', ts: Date.now() })}\n\n`);

    sseClients.add(res);
    console.log(`[SSE] Client connected (${sseClients.size} total)`);

    // Heartbeat to keep connection alive
    const heartbeat = setInterval(() => {
        try { res.write(':ping\n\n'); } catch (_) { clearInterval(heartbeat); }
    }, 15000);

    req.on('close', () => {
        sseClients.delete(res);
        clearInterval(heartbeat);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// START SERVER
// ────────────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`\n🚀 UniPin Backend running on http://localhost:${PORT}`);
    console.log(`📦 Design Patterns Active:`);
    console.log(`   ✅ Singleton    — GameCatalog (${catalog.getAllGames().length} games loaded)`);
    console.log(`   ✅ Builder      — OrderBuilder`);
    console.log(`   ✅ Abs. Factory — ABAPayFactory, ACLEDAPayFactory`);
    console.log(`   ✅ Strategy     — ABAPayStrategy, ACLEDAPayStrategy`);
    console.log(`   ✅ State        — PendingState → PaidState → CompletedState/FailedState`);
    console.log(`   ✅ Facade       — PublisherFacade (8 publishers)`);
});
