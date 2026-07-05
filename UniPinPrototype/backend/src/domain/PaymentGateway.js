export class PaymentGateway {
  async charge(orderId, amount, method) {
    throw new Error('Method not implemented');
  }

  async refund(orderId, amount) {
    throw new Error('Method not implemented');
  }
}
