import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { FiHeadphones, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { games } from '../data/games';
import Button from '../components/Button';
import GameCard from '../components/GameCard';
import PromoBanner from '../components/PromoBanner';
export default function Home() {
    const navigate = useNavigate();
    const { selectedGame, setSelectedGame } = useAppContext();
    return (_jsxs("div", { className: "space-y-6 pb-24", children: [_jsx(PromoBanner, {}), _jsxs("section", { className: "rounded-[28px] border border-white/10 bg-slate-900/70 p-4 shadow-2xl shadow-slate-950/40", children: [_jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-cyan-300", children: "Popular Games" }), _jsx("h2", { className: "text-xl font-semibold text-white", children: "Popular Games" })] }), _jsx(Button, { variant: "ghost", onClick: () => navigate('/games'), children: "View All" })] }), _jsxs("label", { className: "mb-4 flex items-center gap-3 rounded-[20px] border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-400", children: [_jsx(FiSearch, {}), _jsx("input", { className: "w-full bg-transparent text-slate-100 outline-none", placeholder: "Search for a game" })] }), _jsx("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3", children: games.map((game) => (_jsx(GameCard, { game: game, selected: selectedGame === game.name, onSelect: setSelectedGame }, game.id))) })] }), _jsxs(motion.button, { whileHover: { scale: 1.02 }, className: "fixed bottom-24 right-4 z-30 flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-2xl shadow-cyan-500/20 sm:right-8", children: [_jsx(FiHeadphones, {}), "Support"] })] }));
}
