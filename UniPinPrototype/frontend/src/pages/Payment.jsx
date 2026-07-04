import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppContext } from '../context/AppContext'
import { diamondPackages, paymentMethods } from '../data/games'
import { createOrder } from '../services/api'
import Button from '../components/Button'

export default function Payment() {
  const navigate = useNavigate()
  const { selectedGame, selectedPackage, paymentMethod, setOrderPlaced, setLoading, setError, error } = useAppContext()
  const [successMessage, setSuccessMessage] = useState('')

  const selectedPackageInfo = useMemo(() => diamondPackages.find((item) => item.amount === selectedPackage) ?? diamondPackages[0], [selectedPackage])
  const total = Number(selectedPackageInfo.price + 1.5).toFixed(2)

  const handlePay = async () => {
    setLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      const payload = {
        userId: selectedGame,
        serverId: selectedPackage,
        username: selectedGame,
        timestamp: new Date().toISOString(),
        flowId: `FLOW-${Math.floor(Math.random() * 9000) + 1000}`,
        server: selectedGame,
        supplierCheckoutRequest: {
          amount: selectedPackageInfo.price,
          paymentMethod,
        },
      }
      const response = await createOrder(payload)
      if (response.data.success) {
        setOrderPlaced(true)
        setSuccessMessage(`Payment approved. Order ${response.data.orderId} is being processed.`)
        setTimeout(() => navigate('/history'), 1200)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 pb-24">
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] border border-white/10 bg-slate-900/70 p-5 shadow-2xl shadow-slate-950/40">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-cyan-300">Order summary</p>
            <h2 className="text-xl font-semibold text-white">Secure checkout</h2>
          </div>
        </div>
        <div className="space-y-3 rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Selected package</span>
            <span className="font-semibold text-slate-200">{selectedPackage} Diamonds</span>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Game</span>
            <span className="font-semibold text-slate-200">{selectedGame}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Processing fee</span>
            <span className="font-semibold text-slate-200">$1.50</span>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 pt-3 text-base font-semibold text-white">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>
      </motion.section>

      <section className="rounded-[28px] border border-white/10 bg-slate-900/70 p-4 shadow-2xl shadow-slate-950/40">
        <h3 className="mb-4 text-lg font-semibold text-white">Payment method</h3>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div key={method.id} className={`rounded-[20px] border px-4 py-4 ${paymentMethod === method.id ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/10 bg-slate-950/60'}`}>
              <div className="flex items-center justify-between text-left">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-lg">{method.icon}</div>
                  <div>
                    <p className="font-semibold text-white">{method.name}</p>
                    <p className="text-sm text-slate-400">Instant confirmation</p>
                  </div>
                </div>
                <div className={`h-4 w-4 rounded-full border-2 ${paymentMethod === method.id ? 'border-cyan-300 bg-cyan-300' : 'border-slate-500'}`} />
              </div>
            </div>
          ))}
        </div>

        {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
        {successMessage ? <p className="mt-4 text-sm text-emerald-300">{successMessage}</p> : null}

        <Button onClick={handlePay} className="mt-5 w-full">
          Confirm & Pay
        </Button>
      </section>
    </div>
  )
}
