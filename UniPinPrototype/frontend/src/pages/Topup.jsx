import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { diamondPackages, games, paymentMethods } from '../data/games'
import { validateUser } from '../services/api'
import Button from '../components/Button'
import DiamondCard from '../components/DiamondCard'
import PaymentCard from '../components/PaymentCard'

export default function Topup() {
  const navigate = useNavigate()
  const {
    selectedGame,
    setSelectedGame,
    selectedPackage,
    setSelectedPackage,
    paymentMethod,
    setPaymentMethod,
    userId,
    setUserId,
    serverId,
    setServerId,
    isValidated,
    setIsValidated,
    setLoading,
    error,
    setError,
  } = useAppContext()

  const activeGame = games.find((game) => game.name === selectedGame) ?? games[0]

  const handleValidate = async () => {
    setLoading(true)
    setError('')
    try {
      await validateUser({ userId, serverId, username: selectedGame })
      setIsValidated(true)
    } catch (err) {
      setError(err.message)
      setIsValidated(false)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    if (!isValidated || !userId.trim() || !serverId.trim()) {
      setError('Please validate your account and complete the form first')
      return
    }
    navigate('/payment')
  }

  return (
    <div className="space-y-6 pb-24">
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-[32px] border border-cyan-400/20 bg-slate-900/80 shadow-2xl shadow-cyan-950/30">
        <img src={activeGame.image} alt={activeGame.name} className="h-44 w-full object-cover" />
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-cyan-300">Selected game</p>
              <h2 className="text-2xl font-semibold text-white">{activeGame.name}</h2>
            </div>
            <div className={`rounded-full bg-gradient-to-r px-3 py-1 text-sm font-semibold text-white ${activeGame.accent}`}>
              {activeGame.tagline}
            </div>
          </div>
        </div>
      </motion.section>

      <section className="rounded-[28px] border border-white/10 bg-slate-900/70 p-4 shadow-2xl shadow-slate-950/40">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-cyan-300">Need a fast boost?</p>
            <h3 className="text-lg font-semibold text-white">Enter your User ID and pick a game</h3>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div>
              <label htmlFor="user-id" className="mb-2 block text-sm font-semibold text-slate-300">Player ID</label>
              <input id="user-id" value={userId} onChange={(event) => setUserId(event.target.value)} className="w-full rounded-[18px] border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none" placeholder="Player ID" />
            </div>
            <div>
              <label htmlFor="server-id" className="mb-2 block text-sm font-semibold text-slate-300">Server ID</label>
              <input id="server-id" value={serverId} onChange={(event) => setServerId(event.target.value)} className="w-full rounded-[18px] border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none" placeholder="Server" />
            </div>
            <Button onClick={handleValidate} className="w-full">
              {loading ? 'Validating...' : 'Validate'}
            </Button>
            {isValidated && <p className="text-sm text-emerald-300">User verified successfully.</p>}
            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          </div>

          <div className="rounded-[24px] border border-cyan-400/20 bg-gradient-to-br from-slate-950 to-slate-900 p-4">
            <p className="text-sm font-semibold text-cyan-300">Diamond packages</p>
            <div className="mt-4 grid gap-3">
              {diamondPackages.map((item) => (
                <DiamondCard key={item.amount} packageItem={item} selected={selectedPackage === item.amount} onSelect={setSelectedPackage} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-white/10 bg-slate-900/70 p-4 shadow-2xl shadow-slate-950/40">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Payment methods</h3>
          <span className="text-sm text-slate-400">Fast & secure</span>
        </div>
        <div className="grid gap-3">
          {paymentMethods.map((method) => (
            <PaymentCard key={method.id} method={method} selected={paymentMethod === method.id} onSelect={setPaymentMethod} />
          ))}
        </div>
        <Button onClick={handleContinue} className="mt-4 w-full">
          Continue to Payment
        </Button>
      </section>
    </div>
  )
}
