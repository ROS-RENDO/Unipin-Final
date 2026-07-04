import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

export default function PaymentCard({ method, selected, onSelect }) {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.01 }}
      onClick={() => onSelect(method.id)}
      className={`flex items-center justify-between rounded-[20px] border px-4 py-4 text-left transition ${selected ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/10 bg-slate-900/70 hover:border-cyan-400/30'}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-lg">{method.icon}</div>
        <div>
          <p className="font-semibold text-white">{method.name}</p>
          <p className="text-sm text-slate-400">Secure payment</p>
        </div>
      </div>
      <div className={`h-4 w-4 rounded-full border-2 ${selected ? 'border-cyan-300 bg-cyan-300' : 'border-slate-500'}`} />
    </motion.button>
  )
}

PaymentCard.propTypes = {
  method: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
  }).isRequired,
  selected: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
}
