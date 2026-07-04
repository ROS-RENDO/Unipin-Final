import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { motion } from 'framer-motion';
export default function DiamondCard({ packageItem, selected, onSelect }) {
    return (_jsxs(motion.button, { whileHover: { y: -3, scale: 1.01 }, onClick: () => onSelect(packageItem.amount), className: `rounded-[20px] border p-4 text-left transition ${selected ? 'border-cyan-400/40 bg-cyan-500/10 shadow-lg shadow-cyan-900/20' : 'border-white/10 bg-slate-900/70 hover:border-cyan-400/30'}`, children: [_jsxs("div", { className: "text-sm font-semibold text-cyan-300", children: [packageItem.amount, " Diamonds"] }), _jsxs("div", { className: "mt-2 text-2xl font-bold text-white", children: ["$", packageItem.price.toFixed(2)] }), _jsx("p", { className: "mt-2 text-sm text-slate-400", children: "Instant delivery" })] }));
}
