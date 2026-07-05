import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiBell } from 'react-icons/fi';
import { useTopUp } from '../context/TopUpContext';
import { useState } from 'react';

const PACKAGES = [
  { id: '1', diamonds: 50, price: 1.00, bonus: 0 },
  { id: '2', diamonds: 250, price: 5.00, bonus: 25 },
  { id: '3', diamonds: 500, price: 10.00, bonus: 65 },
  { id: '4', diamonds: 1000, price: 20.00, bonus: 150 },
  { id: '5', diamonds: 2500, price: 50.00, bonus: 450 },
  { id: '6', diamonds: 5000, price: 100.00, bonus: 1000 },
  { id: '7', diamonds: 10000, price: 200.00, bonus: 2500 },
  { id: '8', diamonds: 25000, price: 500.00, bonus: 7500 },
];

import { games } from '../data/games';

export const TopUp = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const { playerId, setPlayerId, zoneId, setZoneId, validateId, validatedName } = useTopUp();
  const [selectedPkg, setSelectedPkg] = useState(PACKAGES[1]);
  const [isValidating, setIsValidating] = useState(false);

  const game = games.find(g => g.id === gameId) || games[0];

  const handleValidate = async () => {
    setIsValidating(true);
    await validateId();
    setIsValidating(false);
  };

  const handleContinue = () => {
    if (!validatedName || validatedName.includes("Invalid")) return;
    navigate('/payment', { state: { pkg: selectedPkg } });
  };

  return (
    <div className="bg-[#0f172a] min-h-screen text-slate-100 pb-20 animate-in fade-in duration-300 flex flex-col items-center">
      
      {/* App Bar Over Hero (Mobile) / Desktop Top Bar */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between p-4 z-20 md:bg-[#0f172a]/90 md:backdrop-blur-md md:border-b md:border-slate-800 absolute md:relative top-0">
        <button onClick={() => navigate(-1)} className="text-white md:text-slate-300 bg-black/30 md:bg-transparent md:hover:bg-slate-800 p-2 rounded-full md:rounded-lg backdrop-blur md:backdrop-blur-none transition flex items-center gap-2">
          <FiArrowLeft size={20} /> <span className="hidden md:inline font-bold">Back</span>
        </button>
        <div className="text-sm md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00f2fe] to-[#8b5cf6] tracking-tight">
          NEXUS TOP-UP
        </div>
        <button className="text-white md:text-slate-300 bg-black/30 md:bg-transparent md:hover:bg-slate-800 p-2 rounded-full md:rounded-lg backdrop-blur md:backdrop-blur-none transition">
          <FiBell size={20} />
        </button>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl mx-auto md:px-4 md:py-6 md:grid md:grid-cols-[1fr_400px] gap-8 items-start">
        
        {/* Left Side: Game Details & Hero */}
        <div className="md:sticky md:top-24">
          <div className="relative h-64 md:h-auto md:aspect-video w-full md:rounded-2xl overflow-hidden md:border border-slate-800 shadow-xl bg-[#1e293b]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent z-10"></div>
            <img src={game.image} alt={game.name} className="w-full h-full object-cover z-0 drop-shadow-2xl hover:scale-105 transition duration-500" />
            <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 z-20">
              <span className="bg-[#00f2fe] text-slate-900 text-[10px] md:text-xs font-bold px-2 py-1 rounded uppercase mb-2 inline-block shadow-lg">Popular</span>
              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">{game.name}</h1>
              <p className="text-slate-300 text-xs md:text-base mt-2 flex items-center gap-1"><span className="text-[#00f2fe]">⚡</span> Instant Delivery to Game Account</p>
            </div>
          </div>
          
          <div className="hidden md:block mt-8 bg-[#1e293b]/50 p-6 rounded-2xl border border-slate-800">
            <h3 className="font-bold text-white mb-2 text-lg">About this game</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Top up {game.name} instantly! Enter your ID, select the value of your purchase, complete the payment, and the items will be added immediately to your {game.name} account.
            </p>
          </div>
        </div>

        {/* Right Side: Form Flow */}
        <div className="p-4 md:p-0 space-y-6">
          
          {/* Step 1: User ID */}
          <section className="md:bg-[#1e293b]/30 md:p-6 md:rounded-2xl md:border md:border-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-gradient-to-br from-[#00f2fe] to-[#8b5cf6] text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shadow-lg shadow-purple-500/20">1</span>
              <h2 className="font-bold text-white md:text-lg">Enter User ID</h2>
            </div>
            
            <div className="bg-[#1e293b] md:bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold ml-1 mb-1 block">User ID</label>
                  <input 
                    type="text" 
                    value={playerId}
                    onChange={(e) => setPlayerId(e.target.value)}
                    placeholder="12345678"
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-lg py-2 md:py-3 px-3 text-sm text-white focus:border-[#00f2fe] focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold ml-1 mb-1 block">Zone ID</label>
                  <input 
                    type="text" 
                    value={zoneId}
                    onChange={(e) => setZoneId(e.target.value)}
                    placeholder="(1234)"
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-lg py-2 md:py-3 px-3 text-sm text-white focus:border-[#00f2fe] focus:outline-none transition"
                  />
                </div>
              </div>
              
              <p className="text-[10px] md:text-xs text-slate-400 mb-4 leading-relaxed">
                To find your User ID, click on your avatar in the top-left corner of the game main menu.
              </p>

              <button 
                onClick={handleValidate}
                disabled={isValidating || !playerId}
                className="w-full border border-[#00f2fe]/50 text-[#00f2fe] font-bold py-2 md:py-3 rounded-lg hover:bg-[#00f2fe]/10 transition disabled:opacity-50 text-sm flex items-center justify-center gap-2"
              >
                {isValidating ? "Checking..." : <><span className="text-lg">⌖</span> Check ID</>}
              </button>
              
              {validatedName && (
                <div className={`mt-3 p-3 rounded-lg text-sm font-medium text-center ${validatedName.includes('Invalid') ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                  {validatedName}
                </div>
              )}
            </div>
          </section>

          {/* Step 2: Amount */}
          <section className="md:bg-[#1e293b]/30 md:p-6 md:rounded-2xl md:border md:border-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-gradient-to-br from-[#00f2fe] to-[#8b5cf6] text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shadow-lg shadow-purple-500/20">2</span>
              <h2 className="font-bold text-white md:text-lg">Select Recharge Amount</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {PACKAGES.map((pkg) => (
                <div 
                  key={pkg.id}
                  onClick={() => setSelectedPkg(pkg)}
                  className={`relative p-3 md:p-4 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all ${selectedPkg.id === pkg.id ? 'bg-[#1e293b] border-[#00f2fe] shadow-[0_0_15px_rgba(0,242,254,0.15)] scale-[1.02]' : 'bg-[#1e293b]/50 border-slate-800 hover:border-slate-600 hover:bg-[#1e293b]/80'}`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-2 bg-[#8b5cf6] text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Most Popular</span>
                  )}
                  {selectedPkg.id === pkg.id && (
                    <div className="absolute top-2 right-2 text-[#00f2fe]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                  )}
                  <div className="text-[#00f2fe] mb-1"><svg width="24" md:width="28" height="24" md:height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>
                  <div className="font-bold text-white text-sm md:text-base">{pkg.diamonds} Diamonds</div>
                  <div className="text-[#00f2fe] font-medium text-xs md:text-sm mt-0.5">${pkg.price}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Desktop Continue Button (Hidden on Mobile) */}
          <div className="hidden md:block pt-4">
            <button 
              onClick={handleContinue}
              disabled={!validatedName || validatedName.includes("Invalid")}
              className="w-full bg-gradient-to-r from-[#00f2fe] to-[#8b5cf6] text-white font-bold py-4 rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.4)] disabled:opacity-50 disabled:shadow-none hover:opacity-90 transition flex justify-center items-center gap-2 text-lg"
            >
              Continue to Payment <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>

        </div>
      </div>

      {/* Sticky Bottom Bar (Mobile Only) */}
      <div className="md:hidden fixed bottom-0 w-full max-w-md bg-[#0f172a]/95 backdrop-blur-md border-t border-slate-800 p-4 z-50 rounded-t-2xl">
        <button 
          onClick={handleContinue}
          disabled={!validatedName || validatedName.includes("Invalid")}
          className="w-full bg-gradient-to-r from-[#00f2fe] to-[#8b5cf6] text-white font-bold py-3.5 rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.4)] disabled:opacity-50 disabled:shadow-none transition flex justify-center items-center gap-2"
        >
          Continue to Payment <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>

    </div>
  );
};
