export class PaymentStrategy {
  async pay(amount) {
    throw new Error('Method not implemented');
  }

  getName() {
    throw new Error('Method not implemented');
  }
}

export class CreditCardStrategy extends PaymentStrategy {
  async pay(amount) {
    console.log(`Processing credit card payment for amount: ${amount}`);
    // Simulate payment logic
    return true; 
  }

  getName() {
    return 'CreditCard';
  }
}

export class BankTransferStrategy extends PaymentStrategy {
  async pay(amount) {
    console.log(`Processing bank transfer for amount: ${amount}`);
    // Simulate payment logic
    return true;
  }

  getName() {
    return 'BankTransfer';
  }
}
