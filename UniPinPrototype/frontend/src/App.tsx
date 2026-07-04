import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Home from './pages/Home'
import History from './pages/History'
import Payment from './pages/Payment'
import Profile from './pages/Profile'
import Topup from './pages/Topup'
import BottomNav from './components/BottomNav'
import Navbar from './components/Navbar'

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(135deg,_#030712_0%,_#050816_30%,_#111827_100%)] text-slate-100">
          <Navbar />
          <main className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-24 pt-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/games" element={<Topup />} />
              <Route path="/topup" element={<Topup />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/history" element={<History />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <BottomNav />
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
