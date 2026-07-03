import { useState, useEffect } from 'react';
import { PublisherFacade } from './patterns/PublisherFacade';
import { PaymentProcessor, CreditCardStrategy, EWalletStrategy, BankTransferStrategy } from './patterns/PaymentStrategy';
import { OrderFactory, TopUpOrder, PromoOrder } from './patterns/OrderFactory';
import { NotificationEngine, EmailReceiptNotifier, WebhookNotifier } from './patterns/NotificationObserver';
import type { OrderObserver } from './patterns/NotificationObserver';

// Simple UI Observer to update React State
class UINotifier implements OrderObserver {
  private setStatus: (status: string) => void;
  constructor(setStatus: (status: string) => void) {
    this.setStatus = setStatus;
  }
  update(_orderId: string, eventDetails: string): void {
    this.setStatus(eventDetails);
  }
}

function App() {
  const [logs, setLogs] = useState<string[]>([]);
  
  // UI State
  const [playerId, setPlayerId] = useState('123456');
  const [validatedName, setValidatedName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cc' | 'ewallet' | 'bank'>('cc');
  const [promoCode, setPromoCode] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  
  const [currentOrder, setCurrentOrder] = useState<TopUpOrder | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Overwrite console.log to show on screen safely
  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;
    
    console.log = (...args) => {
      if (typeof args[0] === 'string' && args[0].startsWith('[')) {
        setLogs(prev => [...prev, args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' ')]);
      }
      originalLog(...args);
    };
    console.error = (...args) => {
      if (typeof args[0] === 'string' && args[0].startsWith('[')) {
        setLogs(prev => [...prev, `ERROR: ${args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' ')}`]);
      }
      originalError(...args);
    };
    
    return () => {
      console.log = originalLog;
      console.error = originalError;
    };
  }, []);

  const clearLogs = () => setLogs([]);

  // STEP 1: Validate ID (Facade)
  const handleValidateId = async () => {
    clearLogs();
    const facade = new PublisherFacade();
    const name = await facade.validatePlayer("MLBB", playerId);
    if (name) {
      setValidatedName(name);
    } else {
      setValidatedName("Invalid Player ID");
    }
  };

  // STEP 2: Checkout (Factory + Observer)
  const handleCheckout = () => {
    clearLogs();
    
    const engine = new NotificationEngine();
    engine.attach(new EmailReceiptNotifier());
    engine.attach(new WebhookNotifier());
    engine.attach(new UINotifier(setOrderStatus));
    
    let order: TopUpOrder;
    
    if (promoCode.trim() !== "") {
      order = OrderFactory.createOrder("Promo", 10.00, "MLBB", playerId, engine, promoCode);
    } else {
      order = OrderFactory.createOrder("Standard", 10.00, "MLBB", playerId, engine);
    }
    
    setCurrentOrder(order);
  };

  // STEP 3: Process Payment (Strategy + State + Facade)
  const handlePaymentAndDelivery = async () => {
    if (!currentOrder) return;
    setIsProcessing(true);
    
    // Choose Strategy
    let processor = new PaymentProcessor(new CreditCardStrategy());
    if (paymentMethod === 'ewallet') {
      processor.setStrategy(new EWalletStrategy());
    } else if (paymentMethod === 'bank') {
      processor.setStrategy(new BankTransferStrategy());
    }
    
    // Calculate final price (Factory Polymorphism)
    const price = currentOrder.getFinalPrice();
    console.log(`[Checkout] Final Price to charge: $${price.toFixed(2)}`);

    // Change state to Pending
    currentOrder.pay();
    
    // Process Payment
    const paymentSuccess = await processor.processPayment(price);
    
    if (paymentSuccess) {
      const facade = new PublisherFacade();
      const deliverySuccess = await facade.deliverCurrency(currentOrder.gameCode, currentOrder.playerId, currentOrder.baseAmount);
      
      currentOrder.deliver(deliverySuccess);
    } else {
      // Mock payment failure
      currentOrder.deliver(false); 
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto flex gap-8">
      
      {/* LEFT COLUMN - UI CONTROL */}
      <div className="flex-1 space-y-6">
        <h1 className="text-3xl font-bold text-slate-800">UniPin Top-Up (B2C)</h1>
        
        {/* Step 1: Validate */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold mb-4">1. Validate Player ID</h2>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              className="border p-2 rounded flex-1"
              placeholder="Player ID"
            />
            <button 
              onClick={handleValidateId}
              className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition"
            >
              Verify
            </button>
          </div>
          {validatedName && (
            <div className="mt-3 p-3 bg-blue-50 text-blue-700 rounded border border-blue-100">
              Validated Name: <strong>{validatedName}</strong>
            </div>
          )}
        </div>

        {/* Step 2: Checkout Options */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold mb-4">2. Checkout Options</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <select 
              className="w-full border p-2 rounded bg-slate-50"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
            >
              <option value="cc">Credit Card</option>
              <option value="ewallet">E-Wallet (ABA Pay)</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Promo Code (Optional)</label>
            <input 
              type="text" 
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="w-full border p-2 rounded bg-slate-50"
              placeholder="Try 'WELCOME20' for 20% off"
            />
          </div>

          <button 
            onClick={handleCheckout}
            disabled={!validatedName || validatedName.includes("Invalid")}
            className="w-full bg-emerald-600 text-white px-4 py-3 rounded font-bold hover:bg-emerald-700 transition disabled:opacity-50"
          >
            Create Order ($10.00 Base)
          </button>
        </div>

        {/* Step 3: Payment & Fulfillment */}
        {currentOrder && (
          <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg border border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-500 text-xs font-bold px-3 py-1 rounded-bl-lg">
              {currentOrder.orderId}
            </div>
            <h2 className="text-lg font-semibold mb-2">3. Active Order</h2>
            <p className="text-slate-300 text-sm mb-4">
              Type: {currentOrder instanceof PromoOrder ? 'Promotional' : 'Standard'}<br/>
              Final Price: ${currentOrder.getFinalPrice().toFixed(2)}
            </p>
            
            <div className="bg-slate-900 rounded p-4 mb-4 font-mono text-sm border border-slate-700">
              Live Status: <span className="text-emerald-400 font-bold">{orderStatus || 'Created'}</span>
            </div>

            <button 
              onClick={handlePaymentAndDelivery}
              disabled={isProcessing || orderStatus.includes("Completed") || orderStatus.includes("Failed")}
              className="w-full bg-blue-500 text-white px-4 py-3 rounded font-bold hover:bg-blue-600 transition disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : `Pay & Deliver`}
            </button>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN - CONSOLE OUTPUT */}
      <div className="flex-1 bg-slate-950 rounded-xl shadow-xl border border-slate-800 flex flex-col overflow-hidden h-[85vh] sticky top-8">
        <div className="bg-slate-900 p-3 border-b border-slate-800 flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-slate-400 text-sm ml-2 font-mono font-bold">Design Pattern Execution Log</span>
          </div>
          <button onClick={clearLogs} className="text-xs text-slate-500 hover:text-white">Clear</button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto font-mono text-sm">
          {logs.length === 0 ? (
            <p className="text-slate-600 italic">No patterns executed yet. Try validating an ID!</p>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="mb-2">
                <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span>{" "}
                <span className={
                  log.includes('[Facade]') ? 'text-blue-400' :
                  log.includes('[Strategy]') ? 'text-purple-400' :
                  log.includes('[Factory]') ? 'text-emerald-400' :
                  log.includes('[State]') ? 'text-yellow-400' :
                  log.includes('[Observer]') ? 'text-pink-400' :
                  'text-slate-300'
                }>{log}</span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}

export default App;
