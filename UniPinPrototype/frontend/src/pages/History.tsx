import { useState } from 'react';
import { FiChevronDown, FiCopy, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import { games } from '../data/games';
import { motion } from 'framer-motion';

const TRANSACTIONS = [
  { id: 'TXN-847291', gameId: 'genshin', item: 'Blessing of the Welkin Moon', date: '24 Oct 2023', time: '14:30 PM', priceUsd: 4.99, priceKhr: 19960, method: 'ABA Pay', status: 'Completed' },
  { id: 'TXN-847292', gameId: 'pubg', item: '600 UC', date: '22 Oct 2023', time: '09:15 AM', priceUsd: 9.99, priceKhr: 39960, method: 'Credit Card', status: 'Completed' },
  { id: 'TXN-847293', gameId: 'mlbb', item: 'Weekly Diamond Pass', date: '18 Oct 2023', time: '19:45 PM', priceUsd: 1.99, priceKhr: 7960, method: 'ABA Pay', status: 'Pending' },
  { id: 'TXN-847294', gameId: 'valorant', item: '1000 VP', date: '15 Oct 2023', time: '21:10 PM', priceUsd: 9.99, priceKhr: 39960, method: 'Wing', status: 'Failed' },
  { id: 'TXN-847295', gameId: 'freefire', item: '100 Diamonds', date: '10 Oct 2023', time: '11:20 AM', priceUsd: 0.99, priceKhr: 3960, method: 'ABA Pay', status: 'Completed' },
];

export const History = () => {
  const [tab, setTab] = useState('All');
  const [copiedTx, setCopiedTx] = useState<string | null>(null);

  const filtered = tab === 'All' ? TRANSACTIONS : TRANSACTIONS.filter(t => t.status === tab);

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedTx(id);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <FiCheckCircle className="text-emerald-400" />;
      case 'Pending': return <FiClock className="text-amber-400" />;
      case 'Failed': return <FiXCircle className="text-rose-400" />;
      default: return null;
    }
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500 pb-24 md:pb-6">
      
      <div>
        <h2 className="text-2xl font-black text-white mb-1">Transaction History</h2>
        <p className="text-slate-400 text-sm">Track your purchases and view digital receipts in real-time.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-[#1e293b] p-1.5 rounded-2xl border border-slate-700 w-full overflow-x-auto no-scrollbar shadow-inner">
        {['All Transactions', 'Completed', 'Pending', 'Failed'].map((t) => {
          const tabName = t.split(' ')[0];
          const isActive = tab === tabName;
          return (
            <button 
              key={t}
              onClick={() => setTab(tabName)}
              className={`flex-1 text-xs md:text-sm font-bold py-2.5 px-4 rounded-xl whitespace-nowrap transition-all duration-300 ${
                isActive 
                  ? 'bg-slate-800 text-white shadow-md border border-slate-600' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              {t}
            </button>
          )
        })}
      </div>

      {/* Transaction List */}
      <div className="space-y-4">
        {filtered.map((trx, i) => {
          const game = games.find(g => g.id === trx.gameId) || games[0];
          
          return (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={trx.id} 
              className="bg-[#1e293b]/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row gap-4 hover:border-slate-600 transition-colors group relative overflow-hidden"
            >
              {/* Subtle background glow based on game accent */}
              <div className={`absolute -inset-1 opacity-0 group-hover:opacity-10 bg-gradient-to-r ${game.accent} blur-xl transition-opacity duration-500 pointer-events-none`}></div>

              <div className="flex items-center gap-4 flex-1 z-10">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden shadow-lg border border-slate-700/50 shrink-0">
                  <img src={game.image} alt={game.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-base md:text-lg font-bold text-white truncate">{game.name}</h3>
                  <p className="text-[#00f2fe] text-sm font-semibold truncate mb-1">{trx.item}</p>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1 cursor-pointer hover:text-slate-200 transition" onClick={() => handleCopy(trx.id)}>
                      {trx.id} {copiedTx === trx.id ? <FiCheckCircle className="text-emerald-400" /> : <FiCopy />}
                    </span>
                    <span>•</span>
                    <span>{trx.date}</span>
                  </div>
                </div>
              </div>

              {/* Pricing and Status (Right Side) */}
              <div className="flex flex-row md:flex-col justify-between items-center md:items-end gap-2 z-10 border-t md:border-t-0 border-slate-700/50 pt-3 md:pt-0">
                <div className="text-left md:text-right">
                  <div className="font-black text-white text-lg md:text-xl">
                    ${trx.priceUsd.toFixed(2)}
                  </div>
                  <div className="text-slate-400 text-xs font-semibold">
                    ~ ៛{trx.priceKhr.toLocaleString()}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg ${
                    trx.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                    trx.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                    'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {getStatusIcon(trx.status)}
                    {trx.status}
                  </div>
                  <button className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition">
                    Buy Again
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <button className="w-full py-4 bg-[#1e293b]/40 border border-slate-700/50 text-slate-300 text-sm font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-[#1e293b] hover:border-slate-600 transition">
        Load Older Transactions <FiChevronDown />
      </button>
    </div>
  );
};
