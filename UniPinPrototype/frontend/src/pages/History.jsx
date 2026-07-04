import { useState } from 'react'
import { motion } from 'framer-motion'
import { historyItems } from '../data/games'
import HistoryCard from '../components/HistoryCard'
import Button from '../components/Button'

const tabs = ['All', 'Completed', 'Pending']

export default function History() {
  const [activeTab, setActiveTab] = useState('All')
  const [visibleCount, setVisibleCount] = useState(2)

  const filteredItems = historyItems.filter((item) => {
    if (activeTab === 'All') return true
    return item.status === activeTab
  })

  return (
    <div className="space-y-6 pb-24">
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] border border-white/10 bg-slate-900/70 p-4 shadow-2xl shadow-slate-950/40">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-cyan-300">Transaction history</p>
            <h2 className="text-xl font-semibold text-white">Recent purchases</h2>
          </div>
        </div>
        <div className="flex gap-2 rounded-[20px] border border-white/10 bg-slate-950/70 p-1">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => { setActiveTab(tab); setVisibleCount(2) }} className={`flex-1 rounded-[16px] px-3 py-2 text-sm font-semibold transition ${activeTab === tab ? 'bg-cyan-500/15 text-cyan-300' : 'text-slate-400'}`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="mt-4 space-y-3">
          {filteredItems.slice(0, visibleCount).map((item) => (
            <HistoryCard key={item.id} item={item} />
          ))}
        </div>
        {visibleCount < filteredItems.length ? (
          <Button variant="secondary" onClick={() => setVisibleCount((value) => value + 2)} className="mt-4 w-full">
            Load More
          </Button>
        ) : null}
      </motion.section>
    </div>
  )
}
