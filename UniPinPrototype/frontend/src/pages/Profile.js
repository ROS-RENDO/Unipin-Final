import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { FiAward, FiCreditCard, FiShield, FiUser } from 'react-icons/fi';
const stats = [
    { label: 'Trusted', value: '4.9/5', icon: FiAward },
    { label: 'Saved', value: '$1.2k', icon: FiCreditCard },
    { label: 'Protected', value: '24/7', icon: FiShield },
];
export default function Profile() {
    return (_jsxs("div", { className: "space-y-6 pb-24", children: [_jsx(motion.section, { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, className: "rounded-[32px] border border-cyan-400/20 bg-gradient-to-br from-slate-900 to-violet-950 p-5 shadow-2xl shadow-cyan-950/30", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 text-2xl text-cyan-300", children: _jsx(FiUser, {}) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-cyan-300", children: "Welcome back" }), _jsx("h2", { className: "text-xl font-semibold text-white", children: "NovaGamer" }), _jsx("p", { className: "text-sm text-slate-400", children: "VIP member \u2022 214 top-ups" })] })] }) }), _jsx("section", { className: "grid gap-3 md:grid-cols-3", children: stats.map(({ label, value, icon: Icon }) => (_jsxs("div", { className: "rounded-[24px] border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/40", children: [_jsx("div", { className: "mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300", children: _jsx(Icon, {}) }), _jsx("p", { className: "text-sm text-slate-400", children: label }), _jsx("p", { className: "text-lg font-semibold text-white", children: value })] }, label))) })] }));
}
