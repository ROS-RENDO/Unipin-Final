export const games = [
  {
    id: 'mlbb',
    name: 'Mobile Legends',
    publisher: 'Moonton',
    tagline: 'Battle for the Land of Dawn',
    image: 'https://play-lh.googleusercontent.com/D8r13ijO9c-0_1N-CP4d63mR1w6YhDuR2mBQUl27ELJAx0sKdaKtM5vCUnSLODKBVzUx7rZ9cW4Ir9jYiufsSQ',
    accent: 'from-cyan-500 to-blue-600',
    category: 'MOBA',
    packages: [
      { id: 'ml1', amount: 86, originalPrice: 3.5, price: 3.0 },
      { id: 'ml2', amount: 172, originalPrice: 6.5, price: 5.8 },
      { id: 'ml3', amount: 257, originalPrice: 9.5, price: 9.5 },
      { id: 'ml4', amount: 514, originalPrice: 17.5, price: 15.0, popular: true },
    ]
  },
  {
    id: 'pubg',
    name: 'PUBG Mobile',
    publisher: 'Level Infinite',
    tagline: 'Survive. Adapt. Overcome.',
    image: 'https://play-lh.googleusercontent.com/Se7jR6A5R0Mk9ClaIguf46yi2K3k32JsqKb3gAtrktIh3JwnFfxrQRmG9GLvdMpbxbMrReUOxzDkStxGxNo-5Q',
    accent: 'from-fuchsia-500 to-purple-600',
    category: 'Shooter',
    packages: [
      { id: 'pg1', amount: 60, originalPrice: 1.0, price: 0.9 },
      { id: 'pg2', amount: 300, originalPrice: 5.0, price: 4.5 },
      { id: 'pg3', amount: 600, originalPrice: 10.0, price: 8.0, popular: true },
      { id: 'pg4', amount: 1500, originalPrice: 25.0, price: 25.0 },
    ]
  },
  {
    id: 'genshin',
    name: 'Genshin Impact',
    publisher: 'HoYoverse',
    tagline: 'A fantasy adventure awaits.',
    image: 'https://play-lh.googleusercontent.com/YQqyKaXX-63krqsfIzUEJWUWLINxcb5tbS6QVySdxbS7eZV7YB2dUjUvX27xA0TIGtfxQ5v-tQjwlT5tTB-O',
    accent: 'from-violet-500 to-indigo-600',
    category: 'RPG',
    packages: [
      { id: 'gi1', amount: 60, originalPrice: 1.0, price: 1.0 },
      { id: 'gi2', amount: 300, originalPrice: 5.0, price: 5.0 },
      { id: 'gi3', amount: 980, originalPrice: 15.0, price: 12.0, popular: true },
      { id: 'gi4', amount: 1980, originalPrice: 30.0, price: 25.0 },
    ]
  },
  {
    id: 'valorant',
    name: 'Valorant',
    publisher: 'Riot Games',
    tagline: 'Tactical firepower, flawless aim.',
    image: '/images/valorant.svg',
    accent: 'from-cyan-400 to-sky-600',
    category: 'Shooter',
    packages: [
      { id: 'va1', amount: 475, originalPrice: 5.0, price: 5.0 },
      { id: 'va2', amount: 1000, originalPrice: 10.0, price: 10.0, popular: true },
      { id: 'va3', amount: 2050, originalPrice: 20.0, price: 20.0 },
    ]
  },
  {
    id: 'freefire',
    name: 'Free Fire',
    publisher: 'Garena',
    tagline: 'Fast-paced battle royale.',
    image: 'https://play-lh.googleusercontent.com/JT88XmsHoGDio7FxONwh382DhuTxuccfMmWFDtRBFjilySzNqWOCxUhqm8IhBKzQSwVrW2HWp_XvSgKFwi3ETA',
    accent: 'from-amber-500 to-orange-600',
    category: 'Shooter',
    packages: [
      { id: 'ff1', amount: 100, originalPrice: 1.0, price: 0.95 },
      { id: 'ff2', amount: 310, originalPrice: 3.0, price: 3.0 },
      { id: 'ff3', amount: 520, originalPrice: 5.0, price: 4.5, popular: true },
    ]
  },
  {
    id: 'honkai',
    name: 'Honkai: Star Rail',
    publisher: 'HoYoverse',
    tagline: 'May this journey lead us starward.',
    image: 'https://play-lh.googleusercontent.com/aWrGocSA7hEuk1qAPe7L4T57LvLKrwwH26cK2_LOqxRQMQX7j3uHYojC-EKWgYEV2PdrmE0ahqvvhLhXrAGk6Q',
    accent: 'from-purple-500 to-pink-600',
    category: 'RPG',
    packages: [
      { id: 'hsr1', amount: 60, originalPrice: 1.0, price: 0.5 },
      { id: 'hsr2', amount: 300, originalPrice: 5.0, price: 2.5 },
      { id: 'hsr3', amount: 980, originalPrice: 15.0, price: 15.0, popular: true },
    ]
  },
  {
    id: 'clash',
    name: 'Clash of Clans',
    publisher: 'Supercell',
    tagline: 'Lead your clan to victory.',
    image: 'https://play-lh.googleusercontent.com/gX_sXesdzLc9C4tancLSiJKZom_gLi7Uc5cMfaC-zaY0gvFbXV_DTRZFNqlVx6USMWkqglYgr-k0NeaUq5zE',
    accent: 'from-yellow-400 to-amber-600',
    category: 'Strategy',
    packages: [
      { id: 'coc1', amount: 500, originalPrice: 5.0, price: 5.0 },
      { id: 'coc2', amount: 1200, originalPrice: 10.0, price: 10.0, popular: true },
    ]
  },
  {
    id: 'roblox',
    name: 'Roblox',
    publisher: 'Roblox Corp',
    tagline: 'Powering Imagination.',
    image: 'https://play-lh.googleusercontent.com/QqZj22aXblAyYDxLQw-Gg0ycW0QkKhrDnwqgERZU9BMRXZnMlgXfq-94sikG5mEpt_I0lzZxcUzfLblmQgwYzUE',
    accent: 'from-gray-500 to-gray-700',
    category: 'Sandbox',
    packages: [
      { id: 'rbx1', amount: 400, originalPrice: 5.0, price: 5.0 },
      { id: 'rbx2', amount: 800, originalPrice: 10.0, price: 10.0, popular: true },
      { id: 'rbx3', amount: 1700, originalPrice: 20.0, price: 20.0 },
    ]
  }
];

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
