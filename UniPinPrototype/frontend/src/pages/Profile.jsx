import { motion } from 'framer-motion'
import { FiAward, FiCreditCard, FiShield, FiUser } from 'react-icons/fi'

const stats = [
  { label: 'Trusted', value: '4.9/5', icon: FiAward },
  { label: 'Saved', value: '$1.2k', icon: FiCreditCard },
  { label: 'Protected', value: '24/7', icon: FiShield },
]

export default function Profile() {
  return (
    <div className="space-y-6 pb-24">
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[32px] border border-cyan-400/20 bg-gradient-to-br from-slate-900 to-violet-950 p-5 shadow-2xl shadow-cyan-950/30">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 text-2xl text-cyan-300">
            <FiUser />
          </div>
          <div>
            <p className="text-sm font-semibold text-cyan-300">Welcome back</p>
            <h2 className="text-xl font-semibold text-white">NovaGamer</h2>
            <p className="text-sm text-slate-400">VIP member • 214 top-ups</p>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-3 md:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-[24px] border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/40">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
              <Icon />
            </div>
            <p className="text-sm text-slate-400">{label}</p>
            <p className="text-lg font-semibold text-white">{value}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
