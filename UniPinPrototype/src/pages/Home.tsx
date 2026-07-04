import { Link, useNavigate } from 'react-router-dom';
import { FiChevronRight, FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { useState } from 'react';
import { useTopUp } from '../context/TopUpContext';

export const Home = () => {
  const navigate = useNavigate();
  const { setPlayerId } = useTopUp();
  const [fastPlayerId, setFastPlayerId] = useState('');
  const [fastGameId, setFastGameId] = useState('mlbb');

  const handleFastBoost = () => {
    if (fastPlayerId) {
      setPlayerId(fastPlayerId);
      navigate(`/topup/${fastGameId}`);
    }
  };

  return (
    <div className="p-4 space-y-8 animate-in fade-in duration-500">
      
      {/* Featured Promos */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#00f2fe] font-bold text-lg">Featured Promos</h2>
          <span className="text-[10px] uppercase font-bold tracking-widest text-pink-500">Active Now</span>
        </div>
        
        <div className="flex overflow-x-auto gap-4 pb-2 no-scrollbar snap-x">
          <div className="min-w-[280px] snap-center rounded-2xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-4 border border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f2fe]/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <span className="bg-[#00f2fe] text-slate-900 text-xs font-bold px-2 py-1 rounded-full inline-block mb-2">FLASH SALE</span>
              <h3 className="text-2xl font-black text-white mb-1">Mobile Legends</h3>
              <p className="text-slate-300 text-sm mb-4">Get 20% more Diamonds instantly</p>
            </div>
            <div className="absolute bottom-[-20px] right-[-20px] opacity-30 blur-[2px]">
              <img src="https://ui-avatars.com/api/?name=ML&background=00f2fe&color=fff&size=150" alt="bg" className="rounded-full object-cover" />
            </div>
          </div>
          
          <div className="min-w-[280px] snap-center rounded-2xl bg-gradient-to-br from-[#4facfe] to-[#8b5cf6] p-4 border border-slate-700 relative overflow-hidden">
            <div className="relative z-10">
              <span className="bg-white/20 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded-full inline-block mb-2">NEW SEASON</span>
              <h3 className="text-2xl font-black text-white mb-1">Genshin Impact</h3>
              <p className="text-white/80 text-sm mb-4">Bonus Crystals on first Top-up</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Games */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white font-bold text-lg md:text-2xl">Popular Games</h2>
          <Link to="/games" className="text-xs md:text-sm text-slate-400 flex items-center hover:text-[#00f2fe] transition">
            View All <FiChevronRight />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Card 1 (Full Width on mobile, spanning 2 cols on desktop) */}
          <Link to="/topup/pubg" className="col-span-2 md:col-span-2 group">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden relative aspect-[21/9]">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10"></div>
              <img src="/images/pubg.jpg" alt="PUBG" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute top-3 left-3 z-20">
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">UP TO 20% OFF</span>
              </div>
              <div className="absolute bottom-3 left-3 z-20 bg-slate-900/80 p-1.5 rounded-lg backdrop-blur">
                <h3 className="text-white font-bold text-lg">PUBG Mobile</h3>
                <p className="text-slate-400 text-xs flex items-center gap-1"><span className="text-[#00f2fe]">⚡</span> Instant Delivery</p>
              </div>
            </div>
          </Link>

          {/* Card 2 */}
          <Link to="/topup/genshin" className="group">
            <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden relative aspect-square flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent z-10"></div>
              <img src="/images/genshin.jpg" alt="Genshin" className="w-full h-full object-cover z-0 group-hover:scale-110 transition duration-500 drop-shadow-xl" />
              <div className="absolute bottom-3 left-3 z-20">
                <h3 className="text-white font-bold text-sm">Genshin Impact</h3>
                <p className="text-[#00f2fe] text-[10px] font-bold">15% OFF</p>
              </div>
            </div>
          </Link>

          {/* Card 3 */}
          <Link to="/topup/mlbb" className="group">
            <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden relative aspect-square flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent z-10"></div>
              <img src="/images/mlbb.jpg" alt="MLBB" className="w-full h-full object-cover z-0 group-hover:scale-110 transition duration-500 drop-shadow-xl" />
              <div className="absolute bottom-3 left-3 z-20">
                <h3 className="text-white font-bold text-sm">Mobile Legends</h3>
                <p className="text-[#00f2fe] text-[10px] font-bold">10% OFF</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Fast Boost Widget */}
      <section>
        <div className="bg-gradient-to-br from-[#2e1065] to-[#0f172a] rounded-2xl p-5 border border-purple-500/30 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
          <h2 className="text-white font-black text-xl mb-1">Need a fast boost?</h2>
          <p className="text-slate-300 text-xs mb-4">Enter your User ID and pick a game to skip the browsing.</p>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Player ID..."
                value={fastPlayerId}
                onChange={(e) => setFastPlayerId(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#8b5cf6] transition"
              />
            </div>
            
            <div className="flex-1">
              <select 
                value={fastGameId}
                onChange={(e) => setFastGameId(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#8b5cf6] transition appearance-none cursor-pointer"
              >
                <option value="mlbb">Mobile Legends</option>
                <option value="genshin">Genshin Impact</option>
                <option value="pubg">PUBG Mobile</option>
                <option value="valorant">Valorant</option>
                <option value="freefire">Free Fire</option>
                <option value="honkai">Honkai: Star Rail</option>
              </select>
            </div>

            <button 
              onClick={handleFastBoost}
              disabled={!fastPlayerId}
              className="bg-[#00f2fe] text-slate-900 font-bold px-8 py-3 rounded-xl hover:bg-[#4facfe] transition shadow-[0_0_10px_rgba(0,242,254,0.5)] disabled:opacity-50 disabled:shadow-none"
            >
              GO
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
