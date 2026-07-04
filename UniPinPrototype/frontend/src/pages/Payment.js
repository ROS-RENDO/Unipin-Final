import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { diamondPackages, paymentMethods } from '../data/games';
import { createOrder } from '../services/api';
import Button from '../components/Button';
export default function Payment() {
    const navigate = useNavigate();
    const { selectedGame, selectedPackage, paymentMethod, setOrderPlaced, setLoading, setError, error } = useAppContext();
    const [successMessage, setSuccessMessage] = useState('');
    const selectedPackageInfo = useMemo(() => diamondPackages.find((item) => item.amount === selectedPackage) ?? diamondPackages[0], [selectedPackage]);
    const total = Number(selectedPackageInfo.price + 1.5).toFixed(2);
    const handlePay = async () => {
        setLoading(true);
        setError('');
        setSuccessMessage('');
        try {
            const payload = {
                userId: selectedGame,
                serverId: selectedPackage,
                username: selectedGame,
                timestamp: new Date().toISOString(),
                flowId: `FLOW-${Math.floor(Math.random() * 9000) + 1000}`,
                server: selectedGame,
                supplierCheckoutRequest: {
                    amount: selectedPackageInfo.price,
                    paymentMethod,
                },
            };
            const response = await createOrder(payload);
            if (response.data.success) {
                setOrderPlaced(true);
                setSuccessMessage(`Payment approved. Order ${response.data.orderId} is being processed.`);
                setTimeout(() => navigate('/history'), 1200);
            }
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "space-y-6 pb-24", children: [_jsxs(motion.section, { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, className: "rounded-[28px] border border-white/10 bg-slate-900/70 p-5 shadow-2xl shadow-slate-950/40", children: [_jsx("div", { className: "mb-4 flex items-center justify-between", children: _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-cyan-300", children: "Order summary" }), _jsx("h2", { className: "text-xl font-semibold text-white", children: "Secure checkout" })] }) }), _jsxs("div", { className: "space-y-3 rounded-[24px] border border-white/10 bg-slate-950/70 p-4", children: [_jsxs("div", { className: "flex items-center justify-between text-sm text-slate-400", children: [_jsx("span", { children: "Selected package" }), _jsxs("span", { className: "font-semibold text-slate-200", children: [selectedPackage, " Diamonds"] })] }), _jsxs("div", { className: "flex items-center justify-between text-sm text-slate-400", children: [_jsx("span", { children: "Game" }), _jsx("span", { className: "font-semibold text-slate-200", children: selectedGame })] }), _jsxs("div", { className: "flex items-center justify-between text-sm text-slate-400", children: [_jsx("span", { children: "Processing fee" }), _jsx("span", { className: "font-semibold text-slate-200", children: "$1.50" })] }), _jsxs("div", { className: "flex items-center justify-between border-t border-white/10 pt-3 text-base font-semibold text-white", children: [_jsx("span", { children: "Total" }), _jsxs("span", { children: ["$", total] })] })] })] }), _jsxs("section", { className: "rounded-[28px] border border-white/10 bg-slate-900/70 p-4 shadow-2xl shadow-slate-950/40", children: [_jsx("h3", { className: "mb-4 text-lg font-semibold text-white", children: "Payment method" }), _jsx("div", { className: "space-y-3", children: paymentMethods.map((method) => (_jsx("div", { className: `rounded-[20px] border px-4 py-4 ${paymentMethod === method.id ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/10 bg-slate-950/60'}`, children: _jsxs("div", { className: "flex items-center justify-between text-left", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-lg", children: method.icon }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-white", children: method.name }), _jsx("p", { className: "text-sm text-slate-400", children: "Instant confirmation" })] })] }), _jsx("div", { className: `h-4 w-4 rounded-full border-2 ${paymentMethod === method.id ? 'border-cyan-300 bg-cyan-300' : 'border-slate-500'}` })] }) }, method.id))) }), error ? _jsx("p", { className: "mt-4 text-sm text-rose-300", children: error }) : null, successMessage ? _jsx("p", { className: "mt-4 text-sm text-emerald-300", children: successMessage }) : null, _jsx(Button, { onClick: handlePay, className: "mt-5 w-full", children: "Confirm & Pay" })] })] }));
}
