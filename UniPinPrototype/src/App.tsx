import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { TopUpProvider } from './context/TopUpContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Games } from './pages/Games';
import { TopUp } from './pages/TopUp';
import { Payment } from './pages/Payment';
import { History } from './pages/History';

function App() {
  return (
    <TopUpProvider>
      <Router>
        <Routes>
          {/* Layout covers pages that need the bottom nav */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="games" element={<Games />} />
            <Route path="history" element={<History />} />
            <Route path="profile" element={<Navigate to="/" replace />} />
          </Route>
          
          {/* Fullscreen pages without bottom nav */}
          <Route path="/topup/:gameId" element={<TopUp />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
      </Router>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155'
          }
        }} 
      />
    </TopUpProvider>
  );
}

export default App;
