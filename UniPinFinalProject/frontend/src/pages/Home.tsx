import { Link } from 'react-router-dom';
import GameCatalog from '../patterns/GameCatalog';
import { Gamepad2, Sparkles, Flame, ChevronRight } from 'lucide-react';

export default function Home() {
    const games = GameCatalog.getAllGames();

    return (
        <div className="space-y-12">
            
            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-purple-500/20 opacity-50 blur-3xl"></div>
                <div className="relative p-12 md:p-20 text-center md:text-left flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-6 z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-orange-400 font-medium backdrop-blur-md">
                            <Sparkles className="w-4 h-4" />
                            <span>Premium Top-Up Experience</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
                            Level Up Your <br/>
                            <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500 bg-clip-text text-transparent">Gaming</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-xl">
                            Instant, secure, and reliable game credits. Experience the fastest way to top up your favorite games with exclusive discounts.
                        </p>
                    </div>
                </div>
            </div>

            {/* Trending Games */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <Flame className="w-8 h-8 text-orange-500" />
                        Trending Games
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {games.map((game) => (
                        <Link 
                            key={game.code} 
                            to={`/topup/${game.code}`}
                            className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-white/5 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/20"
                        >
                            <div className="aspect-[16/9] w-full bg-slate-800 relative overflow-hidden">
                                {game.image ? (
                                    <img 
                                        src={game.image} 
                                        alt={game.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Gamepad2 className="w-12 h-12 text-slate-600" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent"></div>
                            </div>
                            
                            <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform">
                                <p className="text-sm text-orange-400 font-medium mb-1">{game.publisher}</p>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-white group-hover:text-orange-100 transition-colors">{game.name}</h3>
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md">
                                        <ChevronRight className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            
        </div>
    );
}
