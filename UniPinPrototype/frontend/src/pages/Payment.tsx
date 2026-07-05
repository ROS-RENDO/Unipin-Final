import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiLock } from 'react-icons/fi';
import { useTopUp } from '../context/TopUpContext';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { playerId, checkout, processPayment, isProcessing } = useTopUp();
  const pkg = location.state?.pkg;

  const [selectedMethod, setSelectedMethod] = useState('cc');
  const [isAbaProcessing, setIsAbaProcessing] = useState(false);
  const [abaQr, setAbaQr] = useState<{ qrImage: string; deeplink: string; tranId: string } | null>(null);
  const processing = isProcessing || isAbaProcessing;

  useEffect(() => {
    if (!pkg) {
      navigate('/');
    } else {
      // Initialize order in backend context
      checkout('cc', pkg.price);
    }
  }, [pkg, navigate, checkout]);

  if (!pkg) return null;

  const handlePay = async () => {
    if (selectedMethod === 'aba') {
      setIsAbaProcessing(true);
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
        const response = await fetch(`${backendUrl}/in-game-topup/aba/checkout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: pkg.price })
        });
        const data = await response.json();
        if (data.success && data.qrImage) {
          // Show QR modal — no page navigation
          setAbaQr({ qrImage: data.qrImage, deeplink: data.deeplink, tranId: data.tranId });
        } else {
          toast.error(data.message || 'Failed to generate ABA QR');
        }
      } catch (error) {
        console.error(error);
        toast.error('Error connecting to payment gateway');
      } finally {
        setIsAbaProcessing(false);
      }
      return;
    }

    const success = await processPayment(selectedMethod);
    if (success) {
      toast.success('Payment Successful!');
      navigate('/history');
    } else {
      toast.error('Payment Failed. Please try again.');
    }
  };

  return (
    <div className="bg-[#0f172a] min-h-screen text-slate-100 flex flex-col pb-24 animate-in fade-in duration-300">

      {/* ABA QR Modal */}
      {abaQr && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e293b] rounded-2xl border border-slate-700 p-6 max-w-sm w-full text-center shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Scan with ABA Mobile</h3>
            <p className="text-2xl font-black text-[#00f2fe] my-2">${pkg.price}</p>
            <p className="text-xs text-slate-400 mb-4">Ref: <span className="font-mono text-[#00f2fe]">{abaQr.tranId}</span></p>
            <div className="bg-white rounded-xl p-3 inline-block mb-4">
              <img src={abaQr.qrImage} alt="ABA PayWay QR" className="w-48 h-48 object-contain" />
            </div>
            <p className="text-xs text-slate-400 mb-4">Open your ABA Mobile app and scan the QR code above to complete payment.</p>
            {abaQr.deeplink && (
              <a
                href={abaQr.deeplink}
                className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl mb-3 transition text-sm"
              >
                Open ABA Mobile App
              </a>
            )}
            <button
              onClick={async () => {
                setAbaQr(null);
                const success = await processPayment('aba');
                if (success) {
                  toast.success('Payment Successful!');
                  navigate('/history');
                } else {
                  toast.error('Payment Failed. Please try again.');
                }
              }}
              className="block w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2.5 rounded-xl transition text-sm"
            >
              I've Paid — Continue
            </button>
            <button
              onClick={() => setAbaQr(null)}
              className="mt-2 text-xs text-slate-500 hover:text-slate-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl mx-auto flex items-center justify-between p-4 md:px-8 sticky top-0 bg-[#0f172a]/90 backdrop-blur-md z-40 border-b border-slate-800">
        <button onClick={() => navigate(-1)} className="text-slate-300 md:hover:text-white p-2 -ml-2 transition flex items-center gap-2">
          <FiArrowLeft size={20} /> <span className="hidden md:inline font-bold">Back</span>
        </button>
        <div className="text-sm md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00f2fe] to-[#8b5cf6] tracking-tight">
          NEXUS SECURE CHECKOUT
        </div>
        <div className="text-slate-500 p-2 flex items-center gap-2">
          <FiLock size={18} /> <span className="hidden md:inline text-xs font-bold uppercase tracking-wider">Encrypted</span>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto p-4 md:p-8 flex-1">
        <div className="md:grid md:grid-cols-[1fr_1.5fr] gap-8 md:items-start">

          {/* Order Details Card */}
          <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-2xl p-5 md:p-8 border border-slate-800 shadow-lg mb-6 md:mb-0 md:sticky md:top-24">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] md:text-xs text-slate-400 font-bold tracking-widest uppercase mb-1">Order Summary</p>
                <h2 className="text-xl md:text-2xl font-bold text-white">Mobile Legends</h2>
              </div>
              <div className="text-right">
                <p className="text-[10px] md:text-xs text-slate-400 font-bold tracking-widest uppercase mb-1">Total</p>
                <h2 className="text-2xl md:text-3xl font-black text-[#00f2fe]">${pkg.price}</h2>
              </div>
            </div>

            <div className="space-y-4 mt-6 pt-6 border-t border-slate-800/50">
              <div className="flex justify-between items-center text-sm md:text-base text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="text-[#00f2fe]"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg></span>
                  Item
                </span>
                <span className="font-medium text-white">{pkg.diamonds} Diamonds</span>
              </div>
              <div className="flex justify-between items-center text-sm md:text-base text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="text-slate-400"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></span>
                  Player ID
                </span>
                <span className="font-mono text-white">{playerId}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <section className="md:bg-[#1e293b]/30 md:p-8 md:rounded-2xl md:border md:border-slate-800">
            <h3 className="text-sm md:text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-[#8b5cf6]">💳</span> Select Payment Method
            </h3>

            <div className="space-y-3 md:space-y-4">

              {/* ABA PayWay */}
              <div
                onClick={() => setSelectedMethod('aba')}
                className={`p-4 md:p-5 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${selectedMethod === 'aba' ? 'bg-[#1e293b] border-[#00f2fe] shadow-[0_0_15px_rgba(0,242,254,0.1)] scale-[1.01]' : 'bg-[#0f172a] border-slate-800 opacity-60 hover:opacity-100 hover:bg-[#1e293b]/50'}`}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded bg-blue-500/20 flex items-center justify-center text-blue-500 font-black text-lg md:text-xl">
                  ABA
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm md:text-base">ABA PayWay</h4>
                  <p className="text-[10px] md:text-xs text-slate-400 mt-0.5">ABA Mobile App or Cards</p>
                </div>
                <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'aba' ? 'border-[#00f2fe]' : 'border-slate-600'}`}>
                  {selectedMethod === 'aba' && <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#00f2fe]"></div>}
                </div>
              </div>

              {/* Razer Gold */}
              <div
                onClick={() => setSelectedMethod('razer')}
                className={`p-4 md:p-5 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${selectedMethod === 'razer' ? 'bg-[#1e293b] border-[#00f2fe] shadow-[0_0_15px_rgba(0,242,254,0.1)] scale-[1.01]' : 'bg-[#0f172a] border-slate-800 opacity-60 hover:opacity-100 hover:bg-[#1e293b]/50'}`}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded bg-green-500/20 flex items-center justify-center text-green-500">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /></svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm md:text-base">Razer Gold</h4>
                  <p className="text-[10px] md:text-xs text-slate-400 mt-0.5">Pay with PIN or Razer Wallet</p>
                </div>
                <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'razer' ? 'border-[#00f2fe]' : 'border-slate-600'}`}>
                  {selectedMethod === 'razer' && <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#00f2fe]"></div>}
                </div>
              </div>

              {/* PayPal */}
              <div
                onClick={() => setSelectedMethod('paypal')}
                className={`p-4 md:p-5 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${selectedMethod === 'paypal' ? 'bg-[#1e293b] border-[#00f2fe] shadow-[0_0_15px_rgba(0,242,254,0.1)] scale-[1.01]' : 'bg-[#0f172a] border-slate-800 opacity-60 hover:opacity-100 hover:bg-[#1e293b]/50'}`}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded bg-blue-500/20 flex items-center justify-center text-blue-500 font-black italic text-lg md:text-xl">
                  P
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm md:text-base">PayPal</h4>
                  <p className="text-[10px] md:text-xs text-slate-400 mt-0.5">Cards or PayPal Balance</p>
                </div>
                <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'paypal' ? 'border-[#00f2fe]' : 'border-slate-600'}`}>
                  {selectedMethod === 'paypal' && <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#00f2fe]"></div>}
                </div>
              </div>

              {/* Credit Card */}
              <div
                onClick={() => setSelectedMethod('cc')}
                className={`p-4 md:p-5 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${selectedMethod === 'cc' ? 'bg-[#1e293b] border-[#00f2fe] shadow-[0_0_15px_rgba(0,242,254,0.1)] scale-[1.01]' : 'bg-[#0f172a] border-slate-800 opacity-60 hover:opacity-100 hover:bg-[#1e293b]/50'}`}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded bg-[#00f2fe]/20 flex items-center justify-center text-[#00f2fe]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm md:text-base">Credit/Debit Card</h4>
                  <p className="text-[10px] md:text-xs text-slate-400 mt-0.5">Visa, Mastercard, AMEX</p>
                </div>
                <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'cc' ? 'border-[#00f2fe]' : 'border-slate-600'}`}>
                  {selectedMethod === 'cc' && <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#00f2fe]"></div>}
                </div>
              </div>

            </div>

            {/* Desktop Pay Button */}
            <div className="hidden md:block mt-8">
              <button
                onClick={handlePay}
                disabled={processing}
                className="w-full bg-gradient-to-r from-[#00f2fe] to-[#8b5cf6] text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_25px_rgba(0,242,254,0.6)] transition flex justify-center items-center gap-3 text-lg disabled:opacity-50 disabled:shadow-none"
              >
                {processing ? 'Processing...' : <><FiLock /> CONFIRM & PAY</>}
              </button>
              <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1">
                <FiLock /> Secure 256-bit encryption
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Sticky Bottom Bar (Mobile Only) */}
      <div className="md:hidden fixed bottom-0 w-full max-w-md bg-[#0f172a]/95 backdrop-blur-md border-t border-slate-800 p-4 z-50 rounded-t-2xl">
        <button
          onClick={handlePay}
          disabled={processing}
          className="w-full bg-gradient-to-r from-[#00f2fe] to-[#8b5cf6] text-white font-bold py-3.5 rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.4)] transition flex justify-center items-center gap-2 disabled:opacity-50 disabled:shadow-none"
        >
          {processing ? 'Processing...' : <><FiLock /> CONFIRM & PAY</>}
        </button>
      </div>

    </div>
  );
};
