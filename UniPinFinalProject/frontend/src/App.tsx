import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import TopUp from './pages/TopUp';
import History from './pages/History';
import TerminalLog from './components/TerminalLog';
import { Gamepad2, History as HistoryIcon } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
        
        {/* Modern Navbar */}
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-white/10">
          <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center gap-3 text-2xl font-black bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent hover:scale-105 transition-transform"
            >
              <Gamepad2 className="w-8 h-8 text-orange-500" />
              UNIPIN PRO
            </Link>
            
            <div className="flex items-center gap-3">
              <Link 
                to="/history" 
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-medium transition-all border border-white/5 hover:border-white/20"
              >
                <HistoryIcon className="w-5 h-5" />
                Transactions
              </Link>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="max-w-6xl mx-auto p-6 pb-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/topup/:gameCode" element={<TopUp />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
        
        {/* Global Terminal Overlay */}
        <TerminalLog />
      </div>
    </Router>
  );
}

export default App;
