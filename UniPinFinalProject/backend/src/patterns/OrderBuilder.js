// ── CREATIONAL PATTERN: BUILDER ──
// OrderBuilder constructs a TopUpOrder step-by-step.
// Avoids a complex constructor with many optional parameters.

class BuiltOrder {
    constructor() {
        this.orderId     = `ORD_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        this.gameCode    = null;
        this.playerId    = null;
        this.zoneId      = '';
        this.packageId   = null;
        this.amount      = 0;
        this.basePrice   = 0;
        this.discountPct = 0;
    }

    getFinalPrice() {
        return parseFloat((this.basePrice * (1 - this.discountPct / 100)).toFixed(2));
    }

    getSummary() {
        return {
            orderId:            this.orderId,
            gameCode:           this.gameCode,
            playerId:           this.playerId,
            zoneId:             this.zoneId,
            packageId:          this.packageId,
            amount:             this.amount,
            basePrice:          this.basePrice,
            discountPercentage: this.discountPct,
            finalPrice:         this.getFinalPrice(),
        };
    }
}

class OrderBuilder {
    constructor() {
        if (OrderBuilder._instance) {
            throw new Error('OrderBuilder is a Singleton — use OrderBuilder.getInstance()');
        }
        this._order = new BuiltOrder();
    }

    static getInstance() {
        if (!OrderBuilder._instance) {
            OrderBuilder._instance = new OrderBuilder();
        }
        return OrderBuilder._instance;
    }

    // Step 1: set which game
    setGameCode(gameCode) {
        this._order.gameCode = gameCode;
        return this; // fluent interface — allows chaining
    }

    // Step 2: set who the player is
    setPlayer(playerId, zoneId = '') {
        this._order.playerId = playerId;
        this._order.zoneId   = zoneId;
        return this;
    }

    // Step 3: set what they're buying
    setPackage(packageId, amount, price) {
        this._order.packageId  = packageId;
        this._order.amount     = amount;
        this._order.basePrice  = price;
        return this;
    }

    // Step 4 (optional): apply a promo code discount
    applyPromoCode(discountPercentage) {
        this._order.discountPct = discountPercentage || 0;
        return this;
    }

    // Finalize — returns the constructed order object and resets the builder
    build() {
        if (!this._order.gameCode) throw new Error('[Builder] gameCode is required');
        if (!this._order.playerId) throw new Error('[Builder] playerId is required');
        if (!this._order.packageId) throw new Error('[Builder] package must be set');
        console.log(`[Builder] Order built: ${this._order.orderId} for ${this._order.gameCode}`);
        
        const finishedOrder = this._order;
        this._order = new BuiltOrder(); // Reset for next build
        return finishedOrder;
    }
}

OrderBuilder._instance = null;

module.exports = { OrderBuilder, BuiltOrder };
