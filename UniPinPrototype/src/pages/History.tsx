import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const TRANSACTIONS = [
  { id: 1, game: 'Genshin Impact', date: '24 Oct 2023', time: '14:30 PM', amount: 49.99, status: 'Completed', img: '/images/genshin.jpg' },
  { id: 2, game: 'PUBG Mobile', date: '22 Oct 2023', time: '09:15 AM', amount: 19.99, status: 'Completed', img: '/images/pubg.jpg' },
  { id: 3, game: 'Mobile Legends', date: '18 Oct 2023', time: '19:45 PM', amount: 99.99, status: 'Completed', img: '/images/mlbb.jpg' },
  { id: 4, game: 'Valorant', date: '15 Oct 2023', time: '21:10 PM', amount: 9.99, status: 'Failed', img: '/images/valorant.jpg' },
  { id: 5, game: 'Free Fire', date: '10 Oct 2023', time: '11:20 AM', amount: 4.99, status: 'Completed', img: '/images/freefire.jpg' },
];

export const History = () => {
  const [tab, setTab] = useState('All');

  const filtered = tab === 'All' ? TRANSACTIONS : TRANSACTIONS.filter(t => t.status === tab);

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500">
      
      <div>
        <h2 className="text-xl font-bold text-white mb-1">History</h2>
        <p className="text-slate-400 text-xs">Track and manage your digital currency acquisitions.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-[#1e293b] p-1 rounded-full border border-slate-700 w-full overflow-x-auto no-scrollbar">
        {['All Transactions', 'Completed', 'Pending'].map((t) => (
          <button 
            key={t}
            onClick={() => setTab(t.split(' ')[0])}
            className={`flex-1 text-xs font-bold py-2 px-4 rounded-full whitespace-nowrap transition ${tab === t.split(' ')[0] ? 'bg-gradient-to-r from-[#00f2fe]/20 to-[#8b5cf6]/20 text-[#00f2fe] border border-[#8b5cf6]/30' : 'text-slate-400 hover:text-white'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((trx) => (
          <div key={trx.id} className="bg-[#1e293b]/50 border border-slate-800 rounded-xl p-4 flex items-center gap-4 hover:bg-[#1e293b] transition cursor-pointer">
            <img src={trx.img} alt={trx.game} className="w-14 h-14 md:w-16 md:h-16 rounded-lg object-cover" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm md:text-base font-bold text-white truncate">{trx.game}</h3>
              <p className="text-[10px] md:text-xs text-slate-400 mt-1">{trx.date} • {trx.time}</p>
            </div>
            <div className="text-right flex flex-col items-end gap-1.5">
              <span className="font-bold text-white text-sm md:text-base">${trx.amount}</span>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] md:text-xs flex items-center gap-1 ${trx.status === 'Completed' ? 'text-emerald-400' : 'text-yellow-400'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${trx.status === 'Completed' ? 'bg-emerald-400' : 'bg-yellow-400'}`}></div>
                  {trx.status}
                </span>
                <button className="bg-gradient-to-r from-[#8b5cf6] to-[#00f2fe] text-white text-[9px] md:text-[10px] font-bold px-3 py-1 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.3)] hover:scale-105 transition">
                  REPEAT
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full py-3 border border-slate-700 text-slate-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition">
        LOAD OLDER TRANSACTIONS <FiChevronDown />
      </button>

    </div>
  );
};
