import { jsx as _jsx } from "react/jsx-runtime";
import { motion } from 'framer-motion';
export default function Button({ children, className = '', variant = 'primary', ...props }) {
    const base = 'inline-flex items-center justify-center rounded-2xl px-4 py-3 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/50';
    const variants = {
        primary: 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg shadow-cyan-500/20 hover:scale-[1.02]',
        secondary: 'border border-white/10 bg-white/10 text-slate-200 backdrop-blur-sm hover:bg-white/20',
        ghost: 'bg-transparent text-slate-300 hover:bg-white/10',
    };
    return (_jsx(motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, className: `${base} ${variants[variant]} ${className}`, ...props, children: children }));
}
