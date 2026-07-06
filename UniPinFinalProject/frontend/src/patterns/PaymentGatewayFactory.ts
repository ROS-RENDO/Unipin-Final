// ── CREATIONAL PATTERN: ABSTRACT FACTORY ──
// Creates families of related payment objects (Strategy + Receipt Generator)

import type { PaymentStrategy } from './PaymentStrategy';
import { ABAPayStrategy, ACLEDAPayStrategy } from './PaymentStrategy';

export interface ReceiptGenerator {
    generate(transactionId: string, amount: number): string;
}

class ABAReceiptGenerator implements ReceiptGenerator {
    generate(transactionId: string, amount: number): string {
        return `[ABA RECEIPT] TXN: ${transactionId} | Amount Paid: $${amount.toFixed(2)} | Thank you for using ABA!`;
    }
}

class ACLEDAReceiptGenerator implements ReceiptGenerator {
    generate(transactionId: string, amount: number): string {
        return `*** ACLEDA OFFICIAL RECEIPT ***\nRef: ${transactionId}\nPaid: $${amount.toFixed(2)}`;
    }
}

export interface PaymentGatewayFactory {
    createPaymentHandler(): PaymentStrategy;
    createReceiptGenerator(): ReceiptGenerator;
}

export class ABAPayFactory implements PaymentGatewayFactory {
    createPaymentHandler(): PaymentStrategy {
        return new ABAPayStrategy();
    }
    createReceiptGenerator(): ReceiptGenerator {
        return new ABAReceiptGenerator();
    }
}

export class ACLEDAPayFactory implements PaymentGatewayFactory {
    createPaymentHandler(): PaymentStrategy {
        return new ACLEDAPayStrategy();
    }
    createReceiptGenerator(): ReceiptGenerator {
        return new ACLEDAReceiptGenerator();
    }
}
