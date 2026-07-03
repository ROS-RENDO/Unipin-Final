// 5. FACTORY METHOD PATTERN
// Problem: Standard purchases and Promotional purchases calculate final prices differently.
// Solution: Centralize instantiation logic into a Factory.

import { CreatedState } from "./OrderState";
import type { OrderState } from "./OrderState";
import type { NotificationEngine } from "./NotificationObserver";

export abstract class TopUpOrder {
    orderId: string;
    baseAmount: number;
    gameCode: string;
    playerId: string;
    state: OrderState;
    notificationEngine: NotificationEngine;

    constructor(baseAmount: number, gameCode: string, playerId: string, engine: NotificationEngine) {
        this.orderId = Math.random().toString(36).substring(2, 9).toUpperCase();
        this.baseAmount = baseAmount;
        this.gameCode = gameCode;
        this.playerId = playerId;
        this.state = new CreatedState();
        this.notificationEngine = engine;
        console.log(`[Order] Created Order ${this.orderId}`);
    }

    setState(newState: OrderState) {
        this.state = newState;
        this.notificationEngine.notify(this.orderId, this.state.getStatusString());
    }

    pay() { this.state.pay(this); }
    deliver(success: boolean) { this.state.deliver(this, success); }

    abstract getFinalPrice(): number;
}

export class StandardOrder extends TopUpOrder {
    constructor(baseAmount: number, gameCode: string, playerId: string, engine: NotificationEngine) {
        super(baseAmount, gameCode, playerId, engine);
        console.log(`[Factory] Instantiated StandardOrder for Customer.`);
    }

    getFinalPrice(): number {
        return this.baseAmount;
    }
}

export class PromoOrder extends TopUpOrder {
    promoCode: string;
    discountPercentage: number;

    constructor(baseAmount: number, gameCode: string, playerId: string, promoCode: string, engine: NotificationEngine) {
        super(baseAmount, gameCode, playerId, engine);
        this.promoCode = promoCode;
        // Mock a 20% discount logic
        this.discountPercentage = promoCode === "WELCOME20" ? 0.20 : 0;
        console.log(`[Factory] Instantiated PromoOrder for Customer (Code: ${promoCode}, Discount: ${this.discountPercentage * 100}%).`);
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
        engine: NotificationEngine,
        promoCode?: string
    ): TopUpOrder {
        if (type === "Standard") {
            return new StandardOrder(baseAmount, gameCode, playerId, engine);
        } else if (type === "Promo") {
            return new PromoOrder(baseAmount, gameCode, playerId, promoCode || "", engine);
        }
        throw new Error("Invalid Order Type");
    }
}
