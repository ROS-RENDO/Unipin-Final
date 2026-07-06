import { useEffect, useState } from 'react';
import { History as HistoryIcon, Clock, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Transaction {
    paymentMethod: string;
    amount: number;
    status: string;
    timestamp: string;
}

interface Order {
    id: string;
    gameCode: string;
    playerId: string;
    amount: number;
    state: string; // Pending, Paid, Completed, Failed
    transactions: Transaction[];
}

export default function History() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/history');
                const data = await res.json();
                if (data.success) {
                    setOrders(data.orders.reverse());
                }
            } catch (error) {
                console.error('Failed to fetch history', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const getStatusIcon = (state: string) => {
        switch (state) {
            case 'Completed': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            case 'Failed': return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <Clock className="w-5 h-5 text-yellow-500" />;
        }
    };

    const getStatusStyle = (state: string) => {
        switch (state) {
            case 'Completed': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'Failed': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                <Link to="/" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-300" />
                </Link>
                <div className="w-12 h-12 bg-orange-500/20 text-orange-500 rounded-2xl flex items-center justify-center">
                    <HistoryIcon className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white">Transaction History</h1>
                    <p className="text-slate-400">View your recent top-up orders and statuses.</p>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-20 text-slate-400">Loading history...</div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20 bg-slate-900 border border-white/5 rounded-3xl">
                    <HistoryIcon className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Transactions Yet</h3>
                    <p className="text-slate-400 mb-6">Looks like you haven't made any top-ups.</p>
                    <Link to="/" className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all inline-block">
                        Start Top-Up
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-slate-900 border border-white/5 rounded-2xl p-6 hover:border-orange-500/30 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-bold text-lg text-white">{order.gameCode}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getStatusStyle(order.state)}`}>
                                            {getStatusIcon(order.state)} {order.state}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-400">Order ID: <span className="font-mono text-slate-300">{order.id}</span></p>
                                    <p className="text-sm text-slate-400">Player ID: <span className="font-mono text-slate-300">{order.playerId}</span></p>
                                </div>
                                <div className="text-left md:text-right">
                                    <p className="text-sm text-slate-400 mb-1">Top-Up Amount</p>
                                    <p className="text-2xl font-black text-orange-400">
                                        {order.amount} <span className="text-sm text-slate-500 font-medium uppercase">{order.gameCode} Credits</span>
                                    </p>
                                </div>
                            </div>
                            
                            {/* Transactions Details */}
                            {order.transactions && order.transactions.length > 0 && (
                                <div className="mt-6 pt-4 border-t border-white/5">
                                    <p className="text-xs font-bold text-slate-500 uppercase mb-3">Payment Log</p>
                                    <div className="space-y-2">
                                        {order.transactions.map((tx, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm bg-slate-950/50 p-3 rounded-lg border border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-slate-300 font-medium">{tx.paymentMethod}</span>
                                                    <span className="text-slate-500 text-xs">{new Date(tx.timestamp).toLocaleString()}</span>
                                                </div>
                                                <span className={tx.status === 'Success' ? 'text-green-400' : 'text-slate-400'}>
                                                    {tx.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
