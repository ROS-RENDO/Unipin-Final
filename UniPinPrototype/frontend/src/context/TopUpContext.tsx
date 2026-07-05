import { createContext, useContext, useState, type ReactNode } from 'react';
import { PublisherFacade } from '../patterns/PublisherFacade';
import { OrderBuilder, TopUpOrder } from '../patterns/OrderBuilder';
import { PaymentProcessor, CreditCardStrategy, EWalletStrategy, BankTransferStrategy } from '../patterns/PaymentStrategy';

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
  checkout: (_paymentMethod: string, pkg: any, game: any) => void;
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

  const checkout = (_paymentMethod: string, pkg: any, game: any) => {
    const gameCode = game ? game.id : "Unknown";
    const order = new OrderBuilder()
        .setGameCode(gameCode)
        .setPlayer(playerId, zoneId)
        .setPackage(pkg.id || "pkg", pkg.amount || pkg.diamonds || 0, pkg.price)
        .build();
        
    setCurrentOrder(order);
    setOrderStatus(order.state.getStatusString());
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
    setOrderStatus(currentOrder.state.getStatusString());
    
    const paymentSuccess = await processor.processPayment(price);
    
    if (paymentSuccess) {
      const facade = new PublisherFacade();
      const deliverySuccess = await facade.deliverCurrency(currentOrder.gameCode, currentOrder.playerId, currentOrder.baseAmount);
      currentOrder.deliver(deliverySuccess);
      setOrderStatus(currentOrder.state.getStatusString());
      setOrderHistory(prev => [currentOrder, ...prev]);
    } else {
      currentOrder.deliver(false);
      setOrderStatus(currentOrder.state.getStatusString());
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
