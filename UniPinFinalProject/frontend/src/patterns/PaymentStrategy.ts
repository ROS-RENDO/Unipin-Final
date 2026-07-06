// ── BEHAVIORAL PATTERN: STRATEGY ──
// Different algorithms for processing different payment methods

export interface PaymentStrategy {
    pay(amount: number): Promise<boolean>;
    getMethodName(): string;
}

export class ABAPayStrategy implements PaymentStrategy {
    async pay(amount: number): Promise<boolean> {
        console.log(`[ABA Strategy] Processing payment of $${amount.toFixed(2)} via ABA Payway...`);
        return new Promise((resolve) => setTimeout(() => resolve(true), 1500));
    }
    getMethodName(): string { return "ABA Bank"; }
}

export class ACLEDAPayStrategy implements PaymentStrategy {
    async pay(amount: number): Promise<boolean> {
        console.log(`[ACLEDA Strategy] Processing payment of $${amount.toFixed(2)} via ACLEDA E-Commerce...`);
        return new Promise((resolve) => setTimeout(() => resolve(true), 1500));
    }
    getMethodName(): string { return "ACLEDA Bank"; }
}

export class EWalletStrategy implements PaymentStrategy {
    async pay(amount: number): Promise<boolean> {
        console.log(`[E-Wallet Strategy] Deducting $${amount.toFixed(2)} from E-Wallet...`);
        return new Promise((resolve) => setTimeout(() => resolve(true), 1500));
    }
    getMethodName(): string { return "E-Wallet"; }
}

export class PaymentProcessor {
    private strategy: PaymentStrategy;

    constructor(strategy: PaymentStrategy) {
        this.strategy = strategy;
    }

    public setStrategy(strategy: PaymentStrategy) {
        this.strategy = strategy;
    }

    public async processPayment(amount: number): Promise<boolean> {
        return await this.strategy.pay(amount);
    }
}
