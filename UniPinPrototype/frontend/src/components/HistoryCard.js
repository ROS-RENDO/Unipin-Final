import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
export default function HistoryCard({ item }) {
    return (_jsxs(motion.article, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: "rounded-[24px] border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/40", children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-white", children: item.game }), _jsx("p", { className: "mt-1 text-sm text-slate-400", children: item.amount })] }), _jsx("span", { className: `rounded-full px-3 py-1 text-xs font-semibold ${item.color}`, children: item.status })] }), _jsxs("div", { className: "mt-4 flex items-center justify-between text-sm text-slate-400", children: [_jsx("span", { children: item.id }), _jsx("span", { children: item.date })] })] }));
}
