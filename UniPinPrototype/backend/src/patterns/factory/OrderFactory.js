import { StandardOrder, PromoOrder } from '../../domain/orders.js';
import { OrderType } from '../../enums.js';

export class OrderFactory {
  static createOrder(type, orderDetails) {
    const { orderId, playerId, zoneId, gameCode, baseAmount, promoCode, discountPercentage } = orderDetails;

    switch (type) {
      case OrderType.STANDARD:
        return new StandardOrder(orderId, playerId, zoneId, gameCode, baseAmount);
      case OrderType.PROMO:
        if (!promoCode || discountPercentage === undefined) {
          throw new Error('PromoOrder requires promoCode and discountPercentage');
        }
        return new PromoOrder(orderId, playerId, zoneId, gameCode, baseAmount, promoCode, discountPercentage);
      default:
        throw new Error('Invalid OrderType');
    }
  }
}
