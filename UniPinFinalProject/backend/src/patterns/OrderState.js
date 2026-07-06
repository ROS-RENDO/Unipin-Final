// ── BEHAVIORAL PATTERN: STATE ──
// Manages the strict lifecycle of an order: Pending -> Paid -> Completed/Failed

class OrderState {
    pay(order) { throw new Error("Method 'pay()' must be implemented."); }
    deliver(order, success) { throw new Error("Method 'deliver()' must be implemented."); }
    getStatusString() { throw new Error("Method 'getStatusString()' must be implemented."); }
}

class PendingState extends OrderState {
    pay(order) {
        console.log(`[State: Pending] Processing payment for Order ${order.id}...`);
        order.setState(new PaidState());
        return true;
    }
    deliver(order, success) {
        console.log(`[State: Pending] Cannot deliver. Order is not paid yet.`);
        return false;
    }
    getStatusString() { return "Pending"; }
}

class PaidState extends OrderState {
    pay(order) {
        console.log(`[State: Paid] Order is already paid.`);
        return false;
    }
    deliver(order, success) {
        console.log(`[State: Paid] Attempting delivery...`);
        if (success) {
            order.setState(new CompletedState());
        } else {
            order.setState(new FailedState());
        }
        return true;
    }
    getStatusString() { return "Paid"; }
}

class CompletedState extends OrderState {
    pay(order) { console.log(`[State: Completed] Order is already completed.`); return false; }
    deliver(order, success) { console.log(`[State: Completed] Order is already delivered.`); return false; }
    getStatusString() { return "Completed"; }
}

class FailedState extends OrderState {
    pay(order) { console.log(`[State: Failed] Cannot pay a failed order.`); return false; }
    deliver(order, success) { console.log(`[State: Failed] Cannot deliver a failed order.`); return false; }
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
    constructor(id, gameCode, playerId, amount) {
        this.id = id;
        this.gameCode = gameCode;
        this.playerId = playerId;
        this.amount = amount;
        this.state = new PendingState(); // Initial State
        this.transactions = [];
    }

    addTransaction(paymentMethod, amount, status) {
        const txnId = `TXN_${Date.now()}_${Math.floor(Math.random()*1000)}`;
        this.transactions.push(new Transaction(txnId, paymentMethod, amount, status));
    }

    setState(state) {
        this.state = state;
    }

    getStatus() {
        return this.state.getStatusString();
    }

    pay() {
        return this.state.pay(this);
    }

    deliver(success) {
        return this.state.deliver(this, success);
    }
}

module.exports = { TopUpOrder, PendingState };
