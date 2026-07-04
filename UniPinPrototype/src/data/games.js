export const games = [
  {
    id: 1,
    name: 'Mobile Legends',
    tagline: 'Battle for the Land of Dawn',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80',
    accent: 'from-cyan-500 to-blue-600',
    price: 12,
  },
  {
    id: 2,
    name: 'PUBG Mobile',
    tagline: 'Survive. Adapt. Overcome.',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80',
    accent: 'from-fuchsia-500 to-purple-600',
    price: 15,
  },
  {
    id: 3,
    name: 'Genshin Impact',
    tagline: 'A fantasy adventure awaits.',
    image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=900&q=80',
    accent: 'from-violet-500 to-indigo-600',
    price: 18,
  },
  {
    id: 4,
    name: 'Valorant',
    tagline: 'Tactical firepower, flawless aim.',
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=900&q=80',
    accent: 'from-cyan-400 to-sky-600',
    price: 16,
  },
  {
    id: 5,
    name: 'Free Fire',
    tagline: 'Fast-paced battle royale.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80',
    accent: 'from-amber-500 to-orange-600',
    price: 10,
  },
]

export const diamondPackages = [
  { amount: 86, price: 3.5 },
  { amount: 172, price: 6.5 },
  { amount: 257, price: 9.5 },
  { amount: 514, price: 17.5 },
  { amount: 706, price: 24.5 },
  { amount: 878, price: 29.5 },
  { amount: 1412, price: 46.5 },
]

export const paymentMethods = [
  { id: 'card', name: 'Credit Card', icon: '💳' },
  { id: 'aba', name: 'ABA Pay', icon: '🏦' },
  { id: 'acleda', name: 'ACLEDA', icon: '💼' },
  { id: 'wing', name: 'Wing', icon: '🪁' },
  { id: 'truemoney', name: 'TrueMoney', icon: '📱' },
  { id: 'paypal', name: 'PayPal', icon: '🅿️' },
]

export const historyItems = [
  {
    id: 'TXN-1001',
    game: 'Mobile Legends',
    amount: '86 Diamonds',
    status: 'Completed',
    date: 'May 31, 2026',
    color: 'bg-emerald-500/15 text-emerald-300',
  },
  {
    id: 'TXN-1002',
    game: 'PUBG Mobile',
    amount: '514 Diamonds',
    status: 'Pending',
    date: 'Jun 02, 2026',
    color: 'bg-amber-500/15 text-amber-300',
  },
  {
    id: 'TXN-1003',
    game: 'Genshin Impact',
    amount: '257 Diamonds',
    status: 'Completed',
    date: 'Jun 04, 2026',
    color: 'bg-emerald-500/15 text-emerald-300',
  },
]
