import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

export default function HistoryCard({ item }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[24px] border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{item.game}</p>
          <p className="mt-1 text-sm text-slate-400">{item.amount}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.color}`}>{item.status}</span>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
        <span>{item.id}</span>
        <span>{item.date}</span>
      </div>
    </motion.article>
  )
}

HistoryCard.propTypes = {
  item: PropTypes.shape({
    game: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
  }).isRequired,
}
