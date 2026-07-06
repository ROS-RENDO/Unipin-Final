// ── CREATIONAL PATTERN: BUILDER ──
// Helps construct the complex TopUpOrder step by step

export class TopUpOrder {
    public gameCode: string = '';
    public playerId: string = '';
    public zoneId: string = '';
    public packageId: string = '';
    public amount: number = 0;
    public basePrice: number = 0;
    public discountPercentage: number = 0;

    public getFinalPrice(): number {
        return this.basePrice * (1 - (this.discountPercentage / 100));
    }
}

export class OrderBuilder {
    private order: TopUpOrder;

    constructor() {
        this.order = new TopUpOrder();
    }

    public setGameCode(gameCode: string): OrderBuilder {
        this.order.gameCode = gameCode;
        return this;
    }

    public setPlayer(playerId: string, zoneId: string = ''): OrderBuilder {
        this.order.playerId = playerId;
        this.order.zoneId = zoneId;
        return this;
    }

    public setPackage(packageId: string, amount: number, basePrice: number, discountPercentage: number = 0): OrderBuilder {
        this.order.packageId = packageId;
        this.order.amount = amount;
        this.order.basePrice = basePrice;
        this.order.discountPercentage = discountPercentage;
        return this;
    }

    public build(): TopUpOrder {
        if (!this.order.gameCode || !this.order.playerId || !this.order.packageId) {
            throw new Error("Missing required order fields");
        }
        return this.order;
    }
}
