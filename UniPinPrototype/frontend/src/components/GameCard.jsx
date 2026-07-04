import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'

export default function GameCard({ game, selected, onSelect }) {
  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={() => onSelect(game.name)}
      className={`overflow-hidden rounded-[24px] border text-left shadow-lg transition ${selected ? 'border-cyan-400/50 bg-slate-900/90' : 'border-white/10 bg-slate-900/70 hover:border-cyan-400/30'}`}
    >
      <img src={game.image} alt={game.name} className="h-32 w-full object-cover" />
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white">{game.name}</h3>
            <p className="mt-1 text-sm text-slate-400">{game.tagline}</p>
          </div>
          <div className={`rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold text-white ${game.accent}`}>
            ${game.price}
          </div>
        </div>
        <Link to="/topup" className="mt-4 flex items-center gap-2 text-sm font-semibold text-cyan-300" onClick={(event) => event.stopPropagation()}>
          Top up now
          <FiChevronRight />
        </Link>
      </div>
    </motion.button>
  )
}

GameCard.propTypes = {
  game: PropTypes.shape({
    name: PropTypes.string.isRequired,
    tagline: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    accent: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
  selected: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
}
