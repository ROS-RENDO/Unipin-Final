// ── BEHAVIORAL PATTERN: STRATEGY ──
// PaymentStrategy defines the interface; concrete strategies implement payment logic.
// ── CREATIONAL PATTERN: ABSTRACT FACTORY ──
// PaymentGatewayFactory produces matching (strategy + receipt generator) pairs per gateway.

// ────────────────────────────────────────────────────────────────────────────
// STRATEGY: Abstract interface
// ────────────────────────────────────────────────────────────────────────────
class PaymentStrategy {
    // pay(amount) — must be implemented by concrete strategy
    pay(amount) { throw new Error("PaymentStrategy.pay() must be implemented"); }
    // refund(amount) — must be implemented by concrete strategy
    refund(amount) { throw new Error("PaymentStrategy.refund() must be implemented"); }
}

// ────────────────────────────────────────────────────────────────────────────
// STRATEGY: Concrete ABA Pay implementation
// ────────────────────────────────────────────────────────────────────────────
class ABAPayStrategy extends PaymentStrategy {
    pay(amount) {
        console.log(`[Strategy: ABAPayStrategy] Initiating ABA PayWay payment of $${amount}...`);
        // In production: call ABA PayWay API using process.env.ABA_API_URL
        const success = Math.random() > 0.05; // 95% success rate mock
        console.log(`[Strategy: ABAPayStrategy] Payment ${success ? 'APPROVED' : 'DECLINED'}`);
        return { success, gateway: 'ABA', amount };
    }

    refund(amount) {
        console.log(`[Strategy: ABAPayStrategy] Refunding $${amount} via ABA PayWay...`);
        return { success: true, gateway: 'ABA', refundedAmount: amount };
    }
}

// ────────────────────────────────────────────────────────────────────────────
// STRATEGY: Concrete ACLEDA Pay implementation
// ────────────────────────────────────────────────────────────────────────────
class ACLEDAPayStrategy extends PaymentStrategy {
    pay(amount) {
        console.log(`[Strategy: ACLEDAPayStrategy] Initiating ACLEDA payment of $${amount}...`);
        const success = Math.random() > 0.05; // 95% success rate mock
        console.log(`[Strategy: ACLEDAPayStrategy] Payment ${success ? 'APPROVED' : 'DECLINED'}`);
        return { success, gateway: 'ACLEDA', amount };
    }

    refund(amount) {
        console.log(`[Strategy: ACLEDAPayStrategy] Refunding $${amount} via ACLEDA...`);
        return { success: true, gateway: 'ACLEDA', refundedAmount: amount };
    }
}

// ────────────────────────────────────────────────────────────────────────────
// STRATEGY: PaymentProcessor Context — holds and uses a PaymentStrategy
// ────────────────────────────────────────────────────────────────────────────
class PaymentProcessor {
    constructor(strategy) {
        this._strategy = strategy;
    }

    setStrategy(strategy) {
        console.log(`[PaymentProcessor] Switching strategy to: ${strategy.constructor.name}`);
        this._strategy = strategy;
    }

    processPayment(amount) {
        console.log(`[PaymentProcessor] Processing $${amount} using ${this._strategy.constructor.name}`);
        return this._strategy.pay(amount);
    }

    processRefund(amount) {
        return this._strategy.refund(amount);
    }
}

// ────────────────────────────────────────────────────────────────────────────
// ABSTRACT FACTORY: Receipt Generators
// ────────────────────────────────────────────────────────────────────────────
class ReceiptGenerator {
    generate(order, paymentResult) { throw new Error("ReceiptGenerator.generate() must be implemented"); }
}

class ABAReceiptGenerator extends ReceiptGenerator {
    generate(order, paymentResult) {
        return {
            receiptId:  `ABA-RCPT-${Date.now()}`,
            gateway:    'ABA PayWay',
            orderId:    order.orderId,
            amount:     paymentResult.amount,
            issuedAt:   new Date().toISOString(),
            format:     'ABA_STANDARD_V2',
        };
    }
}

class ACLEDAReceiptGenerator extends ReceiptGenerator {
    generate(order, paymentResult) {
        return {
            receiptId:  `ACLEDA-RCPT-${Date.now()}`,
            gateway:    'ACLEDA Pay',
            orderId:    order.orderId,
            amount:     paymentResult.amount,
            issuedAt:   new Date().toISOString(),
            format:     'ACLEDA_STANDARD_V1',
        };
    }
}

// ────────────────────────────────────────────────────────────────────────────
// ABSTRACT FACTORY: Interface
// ────────────────────────────────────────────────────────────────────────────
class PaymentGatewayFactory {
    createPaymentHandler() { throw new Error("createPaymentHandler() must be implemented"); }
    createReceiptGenerator() { throw new Error("createReceiptGenerator() must be implemented"); }
}

// ── Concrete Factory: ABA ──
class ABAPayFactory extends PaymentGatewayFactory {
    createPaymentHandler() {
        console.log('[AbstractFactory: ABAPayFactory] Creating ABAPayStrategy...');
        return new ABAPayStrategy();
    }
    createReceiptGenerator() {
        console.log('[AbstractFactory: ABAPayFactory] Creating ABAReceiptGenerator...');
        return new ABAReceiptGenerator();
    }
}

// ── Concrete Factory: ACLEDA ──
class ACLEDAPayFactory extends PaymentGatewayFactory {
    createPaymentHandler() {
        console.log('[AbstractFactory: ACLEDAPayFactory] Creating ACLEDAPayStrategy...');
        return new ACLEDAPayStrategy();
    }
    createReceiptGenerator() {
        console.log('[AbstractFactory: ACLEDAPayFactory] Creating ACLEDAReceiptGenerator...');
        return new ACLEDAReceiptGenerator();
    }
}

module.exports = {
    // Strategy
    PaymentStrategy,
    ABAPayStrategy,
    ACLEDAPayStrategy,
    PaymentProcessor,
    // Abstract Factory
    PaymentGatewayFactory,
    ABAPayFactory,
    ACLEDAPayFactory,
    // Receipt
    ReceiptGenerator,
    ABAReceiptGenerator,
    ACLEDAReceiptGenerator,
};
