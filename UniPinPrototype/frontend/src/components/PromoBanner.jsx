import { motion } from 'framer-motion'

export default function PromoBanner() {
  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] border border-cyan-400/20 bg-gradient-to-br from-slate-900 via-slate-900 to-violet-950 p-5 shadow-2xl shadow-cyan-950/30">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">
            FLASH SALE
          </div>
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">Mobile Legends</h2>
          <p className="mt-2 text-sm text-slate-400 sm:text-base">Get 20% more Diamonds instantly</p>
        </div>
        <div className="rounded-[24px] bg-white/5 px-5 py-4 text-sm text-slate-200 shadow-lg shadow-cyan-950/20">
          <p className="font-semibold text-cyan-300">Featured Promos</p>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">Active now</p>
        </div>
      </div>
    </motion.section>
  )
}
