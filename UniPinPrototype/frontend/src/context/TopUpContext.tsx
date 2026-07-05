import { createContext, useContext, useState, ReactNode } from 'react';
import { PublisherFacade } from '../patterns/PublisherFacade';
import { OrderFactory, TopUpOrder } from '../patterns/OrderFactory';
import { PaymentProcessor, CreditCardStrategy, EWalletStrategy, BankTransferStrategy } from '../patterns/PaymentStrategy';
import { NotificationEngine, EmailReceiptNotifier, WebhookNotifier } from '../patterns/NotificationObserver';
import type { OrderObserver } from '../patterns/NotificationObserver';

// Context Notifier to bridge the Observer pattern with React State
class ContextNotifier implements OrderObserver {
  private setStatus: (status: string) => void;
  constructor(setStatus: (status: string) => void) {
    this.setStatus = setStatus;
  }
  update(_orderId: string, eventDetails: string): void {
    this.setStatus(eventDetails);
  }
}

interface TopUpContextType {
  playerId: string;
  setPlayerId: (id: string) => void;
  zoneId: string;
  setZoneId: (id: string) => void;
  validatedName: string;
  orderStatus: string;
  currentOrder: TopUpOrder | null;
  orderHistory: TopUpOrder[];
  isProcessing: boolean;
  validateId: () => Promise<boolean>;
  checkout: (paymentMethod: string, amount: number, promoCode?: string) => void;
  processPayment: (paymentMethod: string) => Promise<boolean>;
}

const TopUpContext = createContext<TopUpContextType | undefined>(undefined);

export const TopUpProvider = ({ children }: { children: ReactNode }) => {
  const [playerId, setPlayerId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [validatedName, setValidatedName] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [currentOrder, setCurrentOrder] = useState<TopUpOrder | null>(null);
  const [orderHistory, setOrderHistory] = useState<TopUpOrder[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const validateId = async () => {
    if (!playerId) return false;
    const facade = new PublisherFacade();
    const name = await facade.validatePlayer("MLBB", playerId, zoneId);
    if (name) {
      setValidatedName(name);
      return true;
    }
    setValidatedName("Invalid Player ID");
    return false;
  };

  const checkout = (paymentMethod: string, amount: number, promoCode?: string) => {
    const engine = new NotificationEngine();
    engine.attach(new EmailReceiptNotifier());
    engine.attach(new WebhookNotifier());
    engine.attach(new ContextNotifier(setOrderStatus));
    
    const orderType = promoCode ? "Promo" : "Standard";
    const order = OrderFactory.createOrder(orderType, amount, "MLBB", playerId, engine, promoCode);
    setCurrentOrder(order);
  };

  const processPayment = async (paymentMethod: string) => {
    if (!currentOrder) return false;
    setIsProcessing(true);
    
    let processor = new PaymentProcessor(new CreditCardStrategy());
    if (paymentMethod === 'razer') {
      processor.setStrategy(new EWalletStrategy());
    } else if (paymentMethod === 'paypal') {
      processor.setStrategy(new BankTransferStrategy());
    }
    
    const price = currentOrder.getFinalPrice();
    currentOrder.pay();
    
    const paymentSuccess = await processor.processPayment(price);
    
    if (paymentSuccess) {
      const facade = new PublisherFacade();
      const deliverySuccess = await facade.deliverCurrency(currentOrder.gameCode, currentOrder.playerId, currentOrder.baseAmount);
      currentOrder.deliver(deliverySuccess);
      setOrderHistory(prev => [currentOrder, ...prev]);
    } else {
      currentOrder.deliver(false);
      setOrderHistory(prev => [currentOrder, ...prev]);
    }
    
    setIsProcessing(false);
    return paymentSuccess;
  };

  return (
    <TopUpContext.Provider value={{
      playerId, setPlayerId, zoneId, setZoneId, validatedName, orderStatus,
      currentOrder, orderHistory, isProcessing, validateId, checkout, processPayment
    }}>
      {children}
    </TopUpContext.Provider>
  );
};

export const useTopUp = () => {
  const context = useContext(TopUpContext);
  if (!context) throw new Error('useTopUp must be used within TopUpProvider');
  return context;
};
