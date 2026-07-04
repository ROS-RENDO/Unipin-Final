import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Home from './pages/Home';
import History from './pages/History';
import Payment from './pages/Payment';
import Profile from './pages/Profile';
import Topup from './pages/Topup';
import BottomNav from './components/BottomNav';
import Navbar from './components/Navbar';
function App() {
    return (_jsx(AppProvider, { children: _jsx(BrowserRouter, { children: _jsxs("div", { className: "min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(135deg,_#030712_0%,_#050816_30%,_#111827_100%)] text-slate-100", children: [_jsx(Navbar, {}), _jsx("main", { className: "mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-24 pt-4 sm:px-6 lg:px-8", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/games", element: _jsx(Topup, {}) }), _jsx(Route, { path: "/topup", element: _jsx(Topup, {}) }), _jsx(Route, { path: "/payment", element: _jsx(Payment, {}) }), _jsx(Route, { path: "/history", element: _jsx(History, {}) }), _jsx(Route, { path: "/profile", element: _jsx(Profile, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }), _jsx(BottomNav, {})] }) }) }));
}
export default App;
