import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function GameCard({ game, selected, onSelect }) {
  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={() => onSelect(game.name)}
      className={`overflow-hidden rounded-[24px] border text-left shadow-lg transition ${selected ? 'border-cyan-400/50 bg-slate-900/90' : 'border-white/10 bg-slate-900/70 hover:border-cyan-400/30'}`}
    >
      <div className="relative h-40 overflow-hidden">
        <img src={game.image} alt={game.name} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-white">{game.name}</h3>
            <p className="mt-1 text-sm text-slate-400">{game.tagline}</p>
          </div>
          <div className={`rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold text-white ${game.accent}`}>
            ${game.price}
          </div>
        </div>
        <Link to="/topup" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300">
          Top up now
        </Link>
      </div>
    </motion.button>
  )
}
