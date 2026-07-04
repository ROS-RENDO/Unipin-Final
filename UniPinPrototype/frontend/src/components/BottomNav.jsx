import { FiHome, FiGrid, FiClock, FiUser } from 'react-icons/fi'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home', icon: FiHome },
  { to: '/games', label: 'Games', icon: FiGrid },
  { to: '/history', label: 'History', icon: FiClock },
  { to: '/profile', label: 'Profile', icon: FiUser },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl justify-around px-2 py-2 sm:px-6 lg:px-8">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center rounded-3xl px-3 py-2 text-xs font-medium transition ${isActive ? 'bg-cyan-500/15 text-cyan-300' : 'text-slate-400 hover:text-slate-200'}`
            }
          >
            <Icon size={18} />
            <span className="mt-1">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
