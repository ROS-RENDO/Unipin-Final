import { motion } from 'framer-motion'
import { FiGift, FiPlay } from 'react-icons/fi'

export default function PromoBanner() {
  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] border border-cyan-400/20 bg-gradient-to-br from-slate-900 via-slate-900 to-violet-950 p-5 shadow-2xl shadow-cyan-950/30">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">
            <FiGift />
            Limited weekend offer
          </div>
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">Get 20% off your favorite game diamonds</h2>
          <p className="mt-2 text-sm text-slate-400 sm:text-base">Fast delivery, secure checkout, and premium support for your next big match.</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur-sm">
          <FiPlay />
          Watch promo
        </button>
      </div>
    </motion.section>
  )
}
