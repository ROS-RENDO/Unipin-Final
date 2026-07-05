export const OrderType = Object.freeze({
  STANDARD: 'Standard',
  PROMO: 'Promo'
});

export const OrderStatus = Object.freeze({
  CREATED: 'Created',
  PENDING_PAYMENT: 'PendingPayment',
  PROCESSING_DELIVERY: 'ProcessingDelivery',
  COMPLETED: 'Completed',
  FAILED: 'Failed'
});

export const PaymentMethod = Object.freeze({
  CREDIT_CARD: 'CreditCard',
  BANK_TRANSFER: 'BankTransfer'
});
