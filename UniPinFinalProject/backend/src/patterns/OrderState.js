// ── BEHAVIORAL PATTERN: STATE ──
// Manages the strict lifecycle of an order: Pending -> Paid -> Completed/Failed

const pool = require('../db');

class OrderState {
    async pay(order) { throw new Error("Method 'pay()' must be implemented."); }
    async deliver(order, success) { throw new Error("Method 'deliver()' must be implemented."); }
    getStatusString() { throw new Error("Method 'getStatusString()' must be implemented."); }
}

class PendingState extends OrderState {
    async pay(order) {
        console.log(`[State: Pending] Processing payment for Order ${order.id}...`);
        await order.setState(new PaidState());
        return true;
    }
    async deliver(order, success) {
        console.log(`[State: Pending] Cannot deliver. Order is not paid yet.`);
        return false;
    }
    getStatusString() { return "Pending"; }
}

class PaidState extends OrderState {
    async pay(order) {
        console.log(`[State: Paid] Order is already paid.`);
        return false;
    }
    async deliver(order, success) {
        console.log(`[State: Paid] Attempting delivery...`);
        if (success) {
            await order.setState(new CompletedState());
        } else {
            await order.setState(new FailedState());
        }
        return true;
    }
    getStatusString() { return "Paid"; }
}

class CompletedState extends OrderState {
    async pay(order) { console.log(`[State: Completed] Order is already completed.`); return false; }
    async deliver(order, success) { console.log(`[State: Completed] Order is already delivered.`); return false; }
    getStatusString() { return "Completed"; }
}

class FailedState extends OrderState {
    async pay(order) { console.log(`[State: Failed] Cannot pay a failed order.`); return false; }
    async deliver(order, success) { console.log(`[State: Failed] Cannot deliver a failed order.`); return false; }
    getStatusString() { return "Failed"; }
}

class Transaction {
    constructor(transactionId, paymentMethod, amount, status) {
        this.transactionId = transactionId;
        this.paymentMethod = paymentMethod;
        this.amount = amount;
        this.timestamp = new Date();
        this.status = status;
    }
}

class TopUpOrder {
    constructor(id, gameCode, playerId, zoneId, packageId, amount, finalPrice) {
        this.id = id;
        this.gameCode = gameCode;
        this.playerId = playerId;
        this.zoneId = zoneId;
        this.packageId = packageId;
        this.amount = amount;
        this.finalPrice = finalPrice;
        this.state = new PendingState(); // Initial State
        this.transactions = [];
    }

    async save() {
        try {
            await pool.query(
                `INSERT INTO orders (order_id, game_code, player_id, zone_id, package_id, amount, final_price, status) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [this.id, this.gameCode, this.playerId, this.zoneId, this.packageId, this.amount, this.finalPrice, this.getStatus()]
            );
        } catch(err) {
            console.error(`[DB] Failed to save order ${this.id}:`, err.message);
        }
    }

    async addTransaction(paymentMethod, amount, status) {
        const txnId = `TXN_${Date.now()}_${Math.floor(Math.random()*1000)}`;
        this.transactions.push(new Transaction(txnId, paymentMethod, amount, status));
        try {
            await pool.query(
                `INSERT INTO transactions (order_id, payment_method, amount, status)
                 VALUES ($1, $2, $3, $4)`,
                [this.id, paymentMethod, amount, status]
            );
        } catch(err) {
            console.error(`[DB] Failed to insert transaction for order ${this.id}:`, err.message);
        }
    }

    async setState(state) {
        this.state = state;
        try {
            await pool.query(
                `UPDATE orders SET status = $1 WHERE order_id = $2`,
                [this.getStatus(), this.id]
            );
        } catch(err) {
            console.error(`[DB] Failed to update state for order ${this.id}:`, err.message);
        }
    }

    getStatus() {
        return this.state.getStatusString();
    }

    async pay() {
        return await this.state.pay(this);
    }

    async deliver(success) {
        return await this.state.deliver(this, success);
    }
}

module.exports = { TopUpOrder, PendingState };
