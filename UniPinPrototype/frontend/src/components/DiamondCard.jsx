import { motion } from 'framer-motion'

export default function DiamondCard({ packageItem, selected, onSelect }) {
  return (
    <motion.button
      whileHover={{ y: -3, scale: 1.01 }}
      onClick={() => onSelect(packageItem.amount)}
      className={`rounded-[20px] border p-4 text-left transition ${selected ? 'border-cyan-400/40 bg-cyan-500/10 shadow-lg shadow-cyan-900/20' : 'border-white/10 bg-slate-900/70 hover:border-cyan-400/30'}`}
    >
      <div className="text-sm font-semibold text-cyan-300">{packageItem.amount} Diamonds</div>
      <div className="mt-2 text-2xl font-bold text-white">${packageItem.price.toFixed(2)}</div>
      <p className="mt-2 text-sm text-slate-400">Instant delivery</p>
    </motion.button>
  )
}
