import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Package } from '../patterns/GameCatalog';
import GameCatalog from '../patterns/GameCatalog';
import { OrderBuilder } from '../patterns/OrderBuilder';
import { ABAPayFactory, ACLEDAPayFactory } from '../patterns/PaymentGatewayFactory';
import { PaymentProcessor } from '../patterns/PaymentStrategy';
import { CheckCircle2, AlertCircle, Loader2, ArrowLeft, Gamepad2, CreditCard, Ticket, Info, X } from 'lucide-react';

interface TestId { playerId: string; zoneId: string; username: string; }

const TopUp = () => {
    const { gameCode } = useParams<{ gameCode: string }>();
    const navigate = useNavigate();
    const game = GameCatalog.getGameByCode(gameCode || '');

    // Form state
    const [playerId, setPlayerId] = useState('');
    const [zoneId, setZoneId] = useState('');
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'ABA' | 'ACLEDA'>('ABA');
    const [testIds, setTestIds] = useState<TestId[]>([]);

    // Promo code state
    const [promoCode, setPromoCode] = useState('');
    const [isValidatingPromo, setIsValidatingPromo] = useState(false);
    const [promoResult, setPromoResult] = useState<{ discountPercentage: number; message: string } | null>(null);
    const [promoError, setPromoError] = useState('');

    // Verification state
    const [isVerifying, setIsVerifying] = useState(false);
    const [verifyResult, setVerifyResult] = useState<{ isValid: boolean; username?: string; error?: string } | null>(null);

    // Payment state
    const [isPaying, setIsPaying] = useState(false);
    const [receiptData, setReceiptData] = useState<any | null>(null);

    // Load test IDs for this game
    useEffect(() => {
        if (gameCode) {
            fetch(`http://localhost:3001/api/test-ids/${gameCode}`)
                .then(r => r.json())
                .then(d => { if (d.success) setTestIds(d.testIds); })
                .catch(() => {});
        }
    }, [gameCode]);

    if (!game) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <Gamepad2 className="w-20 h-20 text-slate-700" />
                <h2 className="text-2xl font-bold text-slate-400">Game not found</h2>
                <button onClick={() => navigate('/')} className="text-orange-500 hover:underline">Return Home</button>
            </div>
        );
    }

    // ── Verify Player ──
    const handleVerify = async () => {
        if (!playerId.trim()) return;
        setIsVerifying(true);
        setVerifyResult(null);
        try {
            const res = await fetch('http://localhost:3001/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gameCode, playerId: playerId.trim(), zoneId: zoneId.trim() })
            });
            const data = await res.json();
            // Backend returns { success, username } or { success: false, error }
            // Map to our local isValid shape
            setVerifyResult({
                isValid: data.success === true,
                username: data.username,
                error: data.error
            });
        } catch {
            setVerifyResult({ isValid: false, error: 'Network error — is the backend running on port 3001?' });
        }
        setIsVerifying(false);
    };

    // ── Validate Promo ──
    const handlePromoValidate = async () => {
        if (!promoCode.trim()) return;
        setIsValidatingPromo(true);
        setPromoResult(null);
        setPromoError('');
        try {
            const res = await fetch('http://localhost:3001/api/promo/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: promoCode.trim().toUpperCase() })
            });
            const data = await res.json();
            if (data.success) {
                setPromoResult({ discountPercentage: data.discountPercentage, message: data.message });
            } else {
                setPromoError(data.error);
            }
        } catch {
            setPromoError('Network error');
        }
        setIsValidatingPromo(false);
    };

    const removePromo = () => { setPromoResult(null); setPromoCode(''); setPromoError(''); };

    const getFinalPrice = () => {
        if (!selectedPackage) return 0;
        const disc = promoResult?.discountPercentage || 0;
        return selectedPackage.price * (1 - disc / 100);
    };

    // ── Pay ──
    const handlePayment = async () => {
        if (!selectedPackage || !verifyResult?.isValid) return;
        setIsPaying(true);
        try {
            const order = new OrderBuilder()
                .setGameCode(game.code)
                .setPlayer(playerId.trim(), zoneId.trim())
                .setPackage(selectedPackage.id, selectedPackage.amount, selectedPackage.price, promoResult?.discountPercentage || 0)
                .build();

            const factory = paymentMethod === 'ABA' ? new ABAPayFactory() : new ACLEDAPayFactory();
            const processor = new PaymentProcessor(factory.createPaymentHandler());
            const success = await processor.processPayment(order.getFinalPrice());

            if (success) {
                const res = await fetch('http://localhost:3001/api/order/pay', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        gameCode: order.gameCode, playerId: order.playerId, zoneId: order.zoneId,
                        packageId: order.packageId, amount: order.amount,
                        basePrice: order.basePrice, discountPercentage: order.discountPercentage,
                        finalPrice: order.getFinalPrice(), paymentMethod
                    })
                });
                const data = await res.json();
                if (data.success) {
                    setReceiptData({
                        transactionId: data.transactionId,
                        gameName: game.name,
                        username: verifyResult.username,
                        amount: order.amount,
                        basePrice: order.basePrice,
                        discountPercentage: order.discountPercentage,
                        finalPrice: order.getFinalPrice(),
                        paymentMethod: paymentMethod,
                        state: data.state
                    });
                }
            } else {
                alert('Payment failed at gateway.');
            }
        } catch {
            alert('Error — is the backend running?');
        } finally {
            setIsPaying(false);
        }
    };

    // ── Receipt screen ──
    if (receiptData) {
        return (
            <div className="max-w-md mx-auto mt-10">
                {/* Glowing Success Header */}
                <div className="relative bg-gradient-to-br from-green-500/20 to-emerald-900/40 p-8 rounded-t-3xl border border-green-500/30 text-center backdrop-blur-xl overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/20 blur-3xl rounded-full"></div>
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(52,211,153,0.5)] mb-4 transform scale-110">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Payment Successful!</h2>
                    <p className="text-green-400/80 font-medium mt-2 text-sm uppercase tracking-widest">Order Confirmed</p>
                </div>

                {/* Receipt Details Body */}
                <div className="bg-slate-900/90 backdrop-blur-xl border-x border-b border-white/10 rounded-b-3xl shadow-2xl relative">
                    
                    {/* Ticket notch effects */}
                    <div className="absolute top-0 -left-3 w-6 h-6 bg-slate-950 rounded-full transform -translate-y-1/2 border-r border-white/10"></div>
                    <div className="absolute top-0 -right-3 w-6 h-6 bg-slate-950 rounded-full transform -translate-y-1/2 border-l border-white/10"></div>
                    
                    {/* Dashed line */}
                    <div className="border-t-2 border-dashed border-white/10 w-full absolute top-0 left-0"></div>

                    <div className="p-8 space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-slate-400 text-sm">Transaction ID</span>
                            <span className="text-white font-mono text-sm">{receiptData.transactionId}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-slate-400 text-sm">Game</span>
                            <span className="text-white font-bold">{receiptData.gameName}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-slate-400 text-sm">Player</span>
                            <span className="text-white font-bold">{receiptData.username}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-slate-400 text-sm">Credits Added</span>
                            <span className="text-orange-400 font-black">{receiptData.amount} Credits</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-slate-400 text-sm">Payment Method</span>
                            <span className="text-white font-bold">{receiptData.paymentMethod} Pay</span>
                        </div>
                        
                        <div className="pt-6 pb-2">
                            <div className="flex justify-between items-end">
                                <span className="text-slate-400 uppercase text-xs font-bold tracking-wider">Total Paid</span>
                                <span className="text-4xl font-black text-white">${receiptData.finalPrice.toFixed(2)}</span>
                            </div>
                            {receiptData.discountPercentage > 0 && (
                                <p className="text-right text-green-400 text-xs font-bold mt-1">Saved {receiptData.discountPercentage}% with Promo</p>
                            )}
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="p-6 pt-0">
                        <button onClick={() => navigate('/history')} className="w-full py-4 bg-white hover:bg-slate-200 text-slate-900 font-black rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/10">
                            View Transaction History
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
                <ArrowLeft className="w-4 h-4" /> Back to Catalog
            </button>

            {/* Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-white/10 h-56 md:h-72 flex items-end">
                <div className="absolute inset-0">
                    <img src={game.image} alt={game.name} className="w-full h-full object-cover opacity-40 blur-sm scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
                </div>
                <div className="relative p-8 flex items-center gap-5 z-10 w-full">
                    <img src={game.image} className="w-20 h-20 md:w-28 md:h-28 object-cover rounded-2xl border-2 border-white/20 shadow-2xl" />
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-white">{game.name}</h1>
                        <p className="text-orange-400 font-medium mt-1">{game.publisher}</p>
                    </div>
                </div>
            </div>

            {/* Test ID hint */}
            {testIds.length > 0 && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-sm font-bold text-blue-400 mb-2">Test Player IDs for {game.name}</p>
                        <div className="flex flex-wrap gap-2">
                            {testIds.map(t => (
                                <button key={t.playerId}
                                    onClick={() => { setPlayerId(t.playerId); setZoneId(t.zoneId); setVerifyResult(null); }}
                                    className="px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-mono transition-colors border border-blue-500/20"
                                >
                                    <span className="text-white font-bold">{t.playerId}</span>
                                    {t.zoneId && <span className="text-blue-400"> | {t.zoneId}</span>}
                                    <span className="text-slate-400 ml-1">({t.username})</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ── LEFT: Step 1 + Step 2 ── */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Step 1: Player Identity */}
                    <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 md:p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center font-black">1</div>
                            <h2 className="text-xl font-bold">Player Identity</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Player ID / UID</label>
                                <input type="text"
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-all text-white placeholder-slate-600"
                                    placeholder="Enter Player ID"
                                    value={playerId}
                                    onChange={e => { setPlayerId(e.target.value); setVerifyResult(null); }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Zone ID (if required)</label>
                                <input type="text"
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-all text-white placeholder-slate-600"
                                    placeholder="Zone ID"
                                    value={zoneId}
                                    onChange={e => setZoneId(e.target.value)}
                                />
                            </div>
                        </div>
                        <button onClick={handleVerify} disabled={!playerId.trim() || isVerifying}
                            className="mt-4 px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all disabled:opacity-50 text-sm flex items-center gap-2">
                            {isVerifying && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isVerifying ? 'Verifying...' : 'Verify Player'}
                        </button>

                        {verifyResult && (
                            <div className={`mt-4 p-4 rounded-xl flex items-center gap-3 border ${verifyResult.isValid ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                                {verifyResult.isValid ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                <div>
                                    <p className="font-medium">{verifyResult.isValid ? 'Identity Confirmed' : 'Verification Failed'}</p>
                                    <p className="text-sm opacity-80">{verifyResult.username || verifyResult.error}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Step 2: Select Package */}
                    <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 md:p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center font-black">2</div>
                            <h2 className="text-xl font-bold">Select Package</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {game.packages.map(pkg => {
                                const isSelected = selectedPackage?.id === pkg.id;
                                return (
                                    <button key={pkg.id} onClick={() => setSelectedPackage(pkg)}
                                        className={`relative p-5 rounded-2xl border text-left transition-all duration-200 ${isSelected ? 'bg-orange-500/10 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.2)]' : 'bg-slate-950 border-slate-700 hover:border-orange-500/50'}`}>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Gamepad2 className={`w-4 h-4 ${isSelected ? 'text-orange-500' : 'text-slate-500'}`} />
                                            <span className="font-bold text-white">{pkg.amount} Credits</span>
                                        </div>
                                        <div className="text-orange-400 font-bold text-lg">${pkg.price.toFixed(2)}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ── RIGHT: Payment Details + Promo ── */}
                <div>
                    <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl sticky top-24 space-y-6">
                        <h3 className="text-xl font-bold">Payment Details</h3>

                        {/* Payment Method */}
                        <div>
                            <label className="text-sm font-medium text-slate-400 block mb-3">Payment Method</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => setPaymentMethod('ABA')}
                                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'ABA' ? 'bg-blue-500/10 border-blue-500' : 'bg-slate-950 border-slate-700 hover:border-slate-600'}`}>
                                    <CreditCard className={`w-5 h-5 ${paymentMethod === 'ABA' ? 'text-blue-400' : 'text-slate-500'}`} />
                                    <span className="font-bold text-sm">ABA Pay</span>
                                </button>
                                <button onClick={() => setPaymentMethod('ACLEDA')}
                                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'ACLEDA' ? 'bg-yellow-500/10 border-yellow-500' : 'bg-slate-950 border-slate-700 hover:border-slate-600'}`}>
                                    <CreditCard className={`w-5 h-5 ${paymentMethod === 'ACLEDA' ? 'text-yellow-400' : 'text-slate-500'}`} />
                                    <span className="font-bold text-sm">ACLEDA</span>
                                </button>
                            </div>
                        </div>

                        {/* Promo Code — in sidebar */}
                        <div>
                            <label className="text-sm font-medium text-slate-400 block mb-3">Promo Code</label>
                            {promoResult ? (
                                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                                    <div className="flex items-center gap-2 text-green-400 text-sm">
                                        <Ticket className="w-4 h-4" />
                                        <span className="font-bold">{promoCode.toUpperCase()}</span>
                                        <span className="opacity-80">— {promoResult.discountPercentage}% off</span>
                                    </div>
                                    <button onClick={removePromo} className="text-slate-400 hover:text-white p-0.5 rounded">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <input type="text"
                                        className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-all text-white placeholder-slate-600 text-sm uppercase tracking-wider"
                                        placeholder="e.g. UNIPIN10"
                                        value={promoCode}
                                        onChange={e => { setPromoCode(e.target.value); setPromoError(''); }}
                                        onKeyDown={e => e.key === 'Enter' && handlePromoValidate()}
                                    />
                                    <button onClick={handlePromoValidate} disabled={!promoCode || isValidatingPromo}
                                        className="px-4 py-3 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 font-bold rounded-xl transition-all disabled:opacity-50 border border-orange-500/20">
                                        {isValidatingPromo ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                                    </button>
                                </div>
                            )}
                            {promoError && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{promoError}</p>}
                            {!promoResult && <p className="text-slate-600 text-xs mt-2">Try: UNIPIN10 · HALFOFF · RENDO25</p>}
                        </div>

                        {/* Price Breakdown */}
                        <div className="border-t border-slate-700/50 pt-4 space-y-3">
                            <div className="flex justify-between text-slate-400 text-sm">
                                <span>Subtotal</span>
                                <span>${selectedPackage ? selectedPackage.price.toFixed(2) : '0.00'}</span>
                            </div>
                            {promoResult && selectedPackage && (
                                <div className="flex justify-between text-green-400 text-sm">
                                    <span className="flex items-center gap-1"><Ticket className="w-3 h-3" /> Promo Discount</span>
                                    <span>-${(selectedPackage.price * promoResult.discountPercentage / 100).toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-xl font-black text-white pt-3 border-t border-slate-700/50">
                                <span>Total</span>
                                <span className="text-orange-500">${getFinalPrice().toFixed(2)}</span>
                            </div>
                        </div>

                        <button onClick={handlePayment}
                            disabled={isPaying || !selectedPackage || !verifyResult?.isValid}
                            className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 rounded-xl font-bold text-lg transition-all disabled:opacity-40 disabled:grayscale flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20">
                            {isPaying ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Pay Now'}
                        </button>
                        {!verifyResult?.isValid && (
                            <p className="text-center text-xs text-slate-500">Verify Player ID above to enable payment</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopUp;
