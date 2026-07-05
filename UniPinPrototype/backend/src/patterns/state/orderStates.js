import { OrderStatus } from '../../enums.js';

export class OrderState {
  getStatusString() {
    throw new Error('Method not implemented');
  }

  async pay(order) {
    throw new Error('Invalid state transition: Cannot pay in this state.');
  }

  async deliver(order, success) {
    throw new Error('Invalid state transition: Cannot deliver in this state.');
  }
}

export class CreatedState extends OrderState {
  getStatusString() {
    return OrderStatus.CREATED;
  }

  async pay(order) {
    console.log(`Order ${order.orderId}: Payment processing started.`);
    // In a real scenario, this is where payment processing logic would be called
    order.setState(new ProcessingDeliveryState());
  }

  async deliver(order, success) {
    throw new Error('Cannot deliver an order that has not been paid.');
  }
}

export class ProcessingDeliveryState extends OrderState {
  getStatusString() {
    return OrderStatus.PROCESSING_DELIVERY;
  }

  async pay(order) {
    throw new Error('Order has already been paid.');
  }

  async deliver(order, success) {
    if (success) {
      console.log(`Order ${order.orderId}: Delivery successful.`);
      order.setState(new CompletedState());
    } else {
      console.log(`Order ${order.orderId}: Delivery failed.`);
      order.setState(new FailedState());
    }
  }
}

export class CompletedState extends OrderState {
  getStatusString() {
    return OrderStatus.COMPLETED;
  }

  async pay(order) {
    throw new Error('Order is already completed.');
  }

  async deliver(order, success) {
    throw new Error('Order is already completed.');
  }
}

export class FailedState extends OrderState {
  getStatusString() {
    return OrderStatus.FAILED;
  }

  async pay(order) {
    throw new Error('Cannot pay a failed order.');
  }

  async deliver(order, success) {
    throw new Error('Cannot deliver a failed order.');
  }
}
