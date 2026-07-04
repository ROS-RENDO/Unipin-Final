import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiFilter } from 'react-icons/fi';

const ALL_GAMES = [
  { id: 'mlbb', name: 'Mobile Legends', publisher: 'Moonton', img: '/images/mlbb.jpg', category: 'MOBA', discount: '10% OFF' },
  { id: 'genshin', name: 'Genshin Impact', publisher: 'HoYoverse', img: '/images/genshin.jpg', category: 'RPG', discount: '15% OFF' },
  { id: 'pubg', name: 'PUBG Mobile', publisher: 'Level Infinite', img: '/images/pubg.jpg', category: 'Shooter', discount: '20% OFF' },
  { id: 'valorant', name: 'Valorant', publisher: 'Riot Games', img: '/images/valorant.jpg', category: 'Shooter', discount: '' },
  { id: 'freefire', name: 'Free Fire', publisher: 'Garena', img: '/images/freefire.jpg', category: 'Shooter', discount: '5% OFF' },
  { id: 'honkai', name: 'Honkai: Star Rail', publisher: 'HoYoverse', img: '/images/honkai.jpg', category: 'RPG', discount: 'First Top-Up' },
  { id: 'clash', name: 'Clash of Clans', publisher: 'Supercell', img: '/images/clash.jpg', category: 'Strategy', discount: '' },
  { id: 'roblox', name: 'Roblox', publisher: 'Roblox Corp', img: '/images/roblox.jpg', category: 'Sandbox', discount: '' },
];

const CATEGORIES = ['All', 'MOBA', 'RPG', 'Shooter', 'Strategy', 'Sandbox'];

export const Games = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredGames = ALL_GAMES.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      
      {/* Header & Search */}
      <div className="md:flex justify-between items-end gap-6 mb-8">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-1">Browse Games</h2>
          <p className="text-slate-400 text-xs md:text-sm">Find your favorite games and get instant digital currency.</p>
        </div>
        
        <div className="flex gap-2 md:w-96">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search games..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1e293b] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#8b5cf6]"
            />
          </div>
          <button className="bg-[#1e293b] border border-slate-700 text-slate-300 p-2.5 rounded-xl hover:bg-slate-800 transition">
            <FiFilter />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${activeCategory === cat ? 'bg-gradient-to-r from-[#00f2fe] to-[#8b5cf6] text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]' : 'bg-[#1e293b] border border-slate-700 text-slate-400 hover:text-white'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 pt-2">
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <Link to={`/topup/${game.id}`} key={game.id} className="group">
              <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden relative aspect-square transition-all duration-300 hover:border-[#8b5cf6] hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent z-10"></div>
                <img src={game.img} alt={game.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                
                {game.discount && (
                  <div className="absolute top-3 left-3 z-20">
                    <span className="bg-[#00f2fe] text-slate-900 text-[9px] font-bold px-2 py-0.5 rounded shadow-lg">
                      {game.discount}
                    </span>
                  </div>
                )}
                
                <div className="absolute bottom-3 left-3 right-3 z-20">
                  <h3 className="text-white font-bold text-sm line-clamp-1">{game.name}</h3>
                  <p className="text-slate-400 text-[10px]">{game.publisher}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500">
            No games found matching "{search}"
          </div>
        )}
      </div>

    </div>
  );
};
