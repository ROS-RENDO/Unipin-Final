// 5. FACTORY METHOD PATTERN
// Problem: Standard purchases and Promotional purchases calculate final prices differently.
// Solution: Centralize instantiation logic into a Factory.

import { PendingState } from "./OrderState";
import type { OrderState } from "./OrderState";

export abstract class TopUpOrder {
    orderId: string;
    baseAmount: number;
    gameCode: string;
    playerId: string;
    state: OrderState;

    constructor(baseAmount: number, gameCode: string, playerId: string) {
        this.orderId = Math.random().toString(36).substring(2, 9).toUpperCase();
        this.baseAmount = baseAmount;
        this.gameCode = gameCode;
        this.playerId = playerId;
        this.state = new PendingState();
        console.log(`[Order] Created Order ${this.orderId}`);
    }

    setState(newState: OrderState) {
        this.state = newState;
    }

    pay() { this.state.pay(this); }
    deliver(success: boolean) { this.state.deliver(this, success); }

    abstract getFinalPrice(): number;
}

export class StandardOrder extends TopUpOrder {
    constructor(baseAmount: number, gameCode: string, playerId: string) {
        super(baseAmount, gameCode, playerId);
        console.log(`[Factory] Instantiated StandardOrder for Customer.`);
    }

    getFinalPrice(): number {
        return this.baseAmount;
    }
}

export class PromoOrder extends TopUpOrder {
    discountPercentage: number;

    constructor(baseAmount: number, gameCode: string, playerId: string, discountPercentage: number) {
        super(baseAmount, gameCode, playerId);
        this.discountPercentage = discountPercentage;
        console.log(`[Factory] Instantiated PromoOrder for Customer (Discount: ${this.discountPercentage * 100}%).`);
    }

    getFinalPrice(): number {
        return this.baseAmount - (this.baseAmount * this.discountPercentage);
    }
}

export class OrderFactory {
    static createOrder(
        type: "Standard" | "Promo", 
        baseAmount: number, 
        gameCode: string, 
        playerId: string, 
        discountRate?: number
    ): TopUpOrder {
        if (type === "Standard") {
            return new StandardOrder(baseAmount, gameCode, playerId);
        } else if (type === "Promo") {
            return new PromoOrder(baseAmount, gameCode, playerId, discountRate || 0);
        }
        throw new Error("Invalid Order Type");
    }
}
