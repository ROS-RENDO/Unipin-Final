import { Outlet, NavLink, Link } from 'react-router-dom';
import { FiMenu, FiSearch, FiBell, FiHome } from 'react-icons/fi';
import { IoGameControllerOutline } from 'react-icons/io5';
import { MdHistory, MdOutlineShoppingCart } from 'react-icons/md';
import { BiUser } from 'react-icons/bi';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex justify-center bg-[url('/bg-pattern.svg')]">
      <div className="w-full md:max-w-none max-w-md bg-[#0f172a] flex flex-col relative md:shadow-none shadow-2xl md:border-none border-x border-slate-800/50">
        
        {/* Top App Bar */}
        <header className="flex items-center justify-between p-4 md:px-8 sticky top-0 bg-[#0f172a]/90 backdrop-blur-md z-40 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <button className="text-slate-300 hover:text-white md:hidden">
              <FiMenu size={24} />
            </button>
            <div className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00f2fe] to-[#8b5cf6] tracking-tight">
              NEXUS TOP-UP
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold">
            <NavLink to="/" className={({isActive}) => isActive ? 'text-[#00f2fe]' : 'text-slate-300 hover:text-white transition'}>HOME</NavLink>
            <NavLink to="/games" className={({isActive}) => isActive ? 'text-[#00f2fe]' : 'text-slate-300 hover:text-white transition'}>GAMES</NavLink>
            <NavLink to="/history" className={({isActive}) => isActive ? 'text-[#00f2fe]' : 'text-slate-300 hover:text-white transition'}>HISTORY</NavLink>
          </nav>

          <div className="flex gap-4 text-slate-300 items-center">
            <div className="hidden md:flex items-center bg-slate-900 rounded-full px-4 py-1.5 border border-slate-700">
              <FiSearch size={16} className="text-slate-500 mr-2" />
              <input type="text" placeholder="Search games..." className="bg-transparent text-sm focus:outline-none w-48 text-white" />
            </div>
            <button className="hover:text-[#00f2fe] md:hidden"><FiSearch size={22} /></button>
            <Link to="/history" className="bg-gradient-to-r from-[#00f2fe] to-[#8b5cf6] text-white p-2 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.4)] hover:scale-105 transition flex items-center justify-center">
              <MdOutlineShoppingCart size={18} />
            </Link>
            <button className="hover:text-[#00f2fe] relative hidden md:block">
              <FiBell size={22} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="hidden md:flex items-center gap-2 ml-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00f2fe] to-[#8b5cf6] flex items-center justify-center text-white font-bold">U</div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-8 no-scrollbar w-full md:max-w-6xl md:mx-auto">
          <Outlet />
        </main>

        {/* Bottom Navigation (Mobile Only) */}
        <nav className="md:hidden fixed bottom-0 w-full max-w-md bg-[#0f172a]/95 backdrop-blur-md border-t border-slate-800 z-50 rounded-t-3xl pb-safe">
          <div className="flex justify-around items-center p-3">
            <NavLink to="/" className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-[#00f2fe]' : 'text-slate-400'}`}>
              <FiHome size={22} />
              <span className="text-[10px] font-medium">Home</span>
            </NavLink>
            <NavLink to="/games" className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-[#00f2fe]' : 'text-slate-400'}`}>
              <IoGameControllerOutline size={24} />
              <span className="text-[10px] font-medium">Games</span>
            </NavLink>
            <NavLink to="/history" className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-[#00f2fe]' : 'text-slate-400'}`}>
              <MdHistory size={24} />
              <span className="text-[10px] font-medium">History</span>
            </NavLink>
            <NavLink to="/profile" className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-[#00f2fe]' : 'text-slate-400'}`}>
              <BiUser size={24} />
              <span className="text-[10px] font-medium">Profile</span>
            </NavLink>
          </div>
        </nav>
      </div>
    </div>
  );
};
