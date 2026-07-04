import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { diamondPackages, games, paymentMethods } from '../data/games';
import { validateUser } from '../services/api';
import Button from '../components/Button';
import DiamondCard from '../components/DiamondCard';
import PaymentCard from '../components/PaymentCard';
export default function Topup() {
    const navigate = useNavigate();
    const { selectedGame, setSelectedGame, selectedPackage, setSelectedPackage, paymentMethod, setPaymentMethod, userId, setUserId, serverId, setServerId, isValidated, setIsValidated, setLoading, error, setError, } = useAppContext();
    const activeGame = games.find((game) => game.name === selectedGame) ?? games[0];
    const handleValidate = async () => {
        setLoading(true);
        setError('');
        try {
            await validateUser({ userId, serverId, username: selectedGame });
            setIsValidated(true);
        }
        catch (err) {
            setError(err.message);
            setIsValidated(false);
        }
        finally {
            setLoading(false);
        }
    };
    const handleContinue = () => {
        if (!isValidated || !userId.trim() || !serverId.trim()) {
            setError('Please validate your account and complete the form first');
            return;
        }
        navigate('/payment');
    };
    return (_jsxs("div", { className: "space-y-6 pb-24", children: [_jsxs(motion.section, { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, className: "overflow-hidden rounded-[32px] border border-cyan-400/20 bg-slate-900/80 shadow-2xl shadow-cyan-950/30", children: [_jsx("img", { src: activeGame.image, alt: activeGame.name, className: "h-44 w-full object-cover" }), _jsx("div", { className: "p-5", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-cyan-300", children: "Selected game" }), _jsx("h2", { className: "text-2xl font-semibold text-white", children: activeGame.name })] }), _jsx("div", { className: `rounded-full bg-gradient-to-r px-3 py-1 text-sm font-semibold text-white ${activeGame.accent}`, children: activeGame.tagline })] }) })] }), _jsxs("section", { className: "rounded-[28px] border border-white/10 bg-slate-900/70 p-4 shadow-2xl shadow-slate-950/40", children: [_jsx("div", { className: "mb-4 flex items-center justify-between", children: _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-cyan-300", children: "Need a fast boost?" }), _jsx("h3", { className: "text-lg font-semibold text-white", children: "Enter your User ID and pick a game" })] }) }), _jsxs("div", { className: "grid gap-4 lg:grid-cols-[1.2fr_0.8fr]", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "user-id", className: "mb-2 block text-sm font-semibold text-slate-300", children: "Player ID" }), _jsx("input", { id: "user-id", value: userId, onChange: (event) => setUserId(event.target.value), className: "w-full rounded-[18px] border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none", placeholder: "Player ID" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "server-id", className: "mb-2 block text-sm font-semibold text-slate-300", children: "Server ID" }), _jsx("input", { id: "server-id", value: serverId, onChange: (event) => setServerId(event.target.value), className: "w-full rounded-[18px] border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none", placeholder: "Server" })] }), _jsx(Button, { onClick: handleValidate, className: "w-full", children: loading ? 'Validating...' : 'Validate' }), isValidated && _jsx("p", { className: "text-sm text-emerald-300", children: "User verified successfully." }), error ? _jsx("p", { className: "text-sm text-rose-300", children: error }) : null] }), _jsxs("div", { className: "rounded-[24px] border border-cyan-400/20 bg-gradient-to-br from-slate-950 to-slate-900 p-4", children: [_jsx("p", { className: "text-sm font-semibold text-cyan-300", children: "Diamond packages" }), _jsx("div", { className: "mt-4 grid gap-3", children: diamondPackages.map((item) => (_jsx(DiamondCard, { packageItem: item, selected: selectedPackage === item.amount, onSelect: setSelectedPackage }, item.amount))) })] })] })] }), _jsxs("section", { className: "rounded-[28px] border border-white/10 bg-slate-900/70 p-4 shadow-2xl shadow-slate-950/40", children: [_jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-semibold text-white", children: "Payment methods" }), _jsx("span", { className: "text-sm text-slate-400", children: "Fast & secure" })] }), _jsx("div", { className: "grid gap-3", children: paymentMethods.map((method) => (_jsx(PaymentCard, { method: method, selected: paymentMethod === method.id, onSelect: setPaymentMethod }, method.id))) }), _jsx(Button, { onClick: handleContinue, className: "mt-4 w-full", children: "Continue to Payment" })] })] }));
}
