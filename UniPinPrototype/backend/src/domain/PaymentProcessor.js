export class PaymentProcessor {
  constructor() {
    this.strategy = null;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  async processPayment(amount) {
    if (!this.strategy) {
      throw new Error('Payment strategy not set');
    }
    return await this.strategy.pay(amount);
  }

  async refund(orderId, amount) {
    console.log(`Refunding ${amount} for order ${orderId}`);
    return true;
  }
}
