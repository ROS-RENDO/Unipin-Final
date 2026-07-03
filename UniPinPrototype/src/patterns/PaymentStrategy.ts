// 1. STRATEGY PATTERN
// Problem: Multiple checkout options (Credit Card, E-Wallet, Bank Transfer).
// Solution: Interchangeable payment strategies at runtime.

export interface PaymentStrategy {
    pay(amount: number): Promise<boolean>;
    getName(): string;
}

export class CreditCardStrategy implements PaymentStrategy {
    async pay(amount: number): Promise<boolean> {
        console.log(`[Strategy] Processing $${amount.toFixed(2)} via Credit Card...`);
        return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
    }
    getName(): string { return "Credit Card"; }
}

export class EWalletStrategy implements PaymentStrategy {
    async pay(amount: number): Promise<boolean> {
        console.log(`[Strategy] Processing $${amount.toFixed(2)} via E-Wallet (ABA Pay)...`);
        return new Promise((resolve) => setTimeout(() => resolve(true), 800));
    }
    getName(): string { return "E-Wallet"; }
}

export class BankTransferStrategy implements PaymentStrategy {
    async pay(amount: number): Promise<boolean> {
        console.log(`[Strategy] Processing $${amount.toFixed(2)} via Bank Transfer...`);
        return new Promise((resolve) => setTimeout(() => resolve(true), 1200));
    }
    getName(): string { return "Bank Transfer"; }
}

export class PaymentProcessor {
    private strategy: PaymentStrategy;

    constructor(strategy: PaymentStrategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy: PaymentStrategy) {
        console.log(`[Strategy] Switched Payment Method to: ${strategy.getName()}`);
        this.strategy = strategy;
    }

    async processPayment(amount: number): Promise<boolean> {
        return await this.strategy.pay(amount);
    }
}
