import { CreatedState } from '../patterns/state/orderStates.js';

export class TopUpOrder {
  constructor(orderId, playerId, zoneId, gameCode, baseAmount) {
    if (new.target === TopUpOrder) {
      throw new TypeError('Cannot construct TopUpOrder instances directly');
    }
    this.orderId = orderId;
    this.playerId = playerId;
    this.zoneId = zoneId;
    this.gameCode = gameCode;
    this.baseAmount = baseAmount;
    
    // Initialize with Created state
    this.status = new CreatedState();
  }

  setState(newState) {
    this.status = newState;
  }

  async pay() {
    await this.status.pay(this);
  }

  async deliver(success) {
    await this.status.deliver(this, success);
  }

  async cancelAndRefund() {
    // Basic implementation for diagram support
    console.log(`Order ${this.orderId} cancelled and refunded.`);
  }

  getFinalPrice() {
    throw new Error('Method not implemented');
  }

  getStatusString() {
    return this.status.getStatusString();
  }
}

export class StandardOrder extends TopUpOrder {
  constructor(orderId, playerId, zoneId, gameCode, baseAmount) {
    super(orderId, playerId, zoneId, gameCode, baseAmount);
  }

  getFinalPrice() {
    return this.baseAmount;
  }
}

export class PromoOrder extends TopUpOrder {
  constructor(orderId, playerId, zoneId, gameCode, baseAmount, promoCode, discountPercentage) {
    super(orderId, playerId, zoneId, gameCode, baseAmount);
    this.promoCode = promoCode;
    this.discountPercentage = discountPercentage;
  }

  getFinalPrice() {
    const discount = this.baseAmount * (this.discountPercentage / 100);
    return this.baseAmount - discount;
  }
}
