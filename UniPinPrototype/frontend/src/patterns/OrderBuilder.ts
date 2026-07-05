import { PendingState } from "./OrderState";
import type { OrderState } from "./OrderState";

// 2. BUILDER PATTERN
// Problem: Creating a TopUpOrder requires setting many optional or complex fields (playerId, zoneId, gameCode, amount, payment method) which makes constructors unwieldy.
// Solution: Use a Builder to construct the order step-by-step.

export class TopUpOrder {
    orderId: string;
    gameCode: string;
    playerId: string;
    zoneId: string;
    packageId: string;
    amount: number; // e.g. 86 diamonds
    finalPrice: number; // e.g. 3.00 USD
    state: OrderState;

    constructor() {
        this.orderId = Math.random().toString(36).substring(2, 9).toUpperCase();
        this.gameCode = "";
        this.playerId = "";
        this.zoneId = "";
        this.packageId = "";
        this.amount = 0;
        this.finalPrice = 0;
        this.state = new PendingState();
    }

    setState(newState: OrderState) {
        this.state = newState;
    }

    pay() { this.state.pay(this); }
    deliver(success: boolean) { this.state.deliver(this, success); }

    getFinalPrice(): number {
        return this.finalPrice;
    }
}

export class OrderBuilder {
    private order: TopUpOrder;

    constructor() {
        this.order = new TopUpOrder();
    }

    setGameCode(gameCode: string): OrderBuilder {
        this.order.gameCode = gameCode;
        return this;
    }

    setPlayer(playerId: string, zoneId: string): OrderBuilder {
        this.order.playerId = playerId;
        this.order.zoneId = zoneId;
        return this;
    }

    setPackage(packageId: string, amount: number, price: number): OrderBuilder {
        this.order.packageId = packageId;
        this.order.amount = amount;
        this.order.finalPrice = price;
        return this;
    }

    build(): TopUpOrder {
        console.log(`[Builder] Constructed Order ${this.order.orderId} for ${this.order.gameCode}`);
        return this.order;
    }
}
