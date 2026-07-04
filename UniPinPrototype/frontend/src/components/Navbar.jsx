import { FiBell, FiSearch, FiUser } from 'react-icons/fi'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 text-lg font-black">U</div>
          <div>
            <p className="text-sm font-semibold text-slate-200">UniPin</p>
            <p className="text-xs text-slate-400">Gaming Top-Up</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <button className="rounded-2xl border border-white/10 bg-white/10 p-2.5 text-slate-200">
            <FiSearch size={18} />
          </button>
          <button className="rounded-2xl border border-white/10 bg-white/10 p-2.5 text-slate-200">
            <FiBell size={18} />
          </button>
          <Link to="/profile" className="rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-2.5 text-cyan-300">
            <FiUser size={18} />
          </Link>
        </div>
      </div>
    </header>
  )
}
