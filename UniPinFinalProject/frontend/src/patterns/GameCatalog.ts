// ── CREATIONAL PATTERN: SINGLETON ──
// Ensures only one centralized Game Catalog is loaded into memory

export interface Package {
    id: string;
    amount: number;
    price: number;
    discountPercentage?: number; // Added for Admin-side promotion scoping
}

export interface Game {
    code: string;
    name: string;
    publisher: string;
    image: string;
    packages: Package[];
}

class GameCatalog {
    private static instance: GameCatalog;
    private games: Game[] = [];

    private constructor() {
        // Private constructor prevents direct instantiation
        this.games = [
            {
                code: 'PUBG',
                name: 'PUBG Mobile',
                publisher: 'Tencent',
                image: '/games/pubg.jpg',
                packages: [
                    { id: 'PKG_60', amount: 60, price: 0.99 },
                    { id: 'PKG_300', amount: 300, price: 4.99 },
                    { id: 'PKG_600', amount: 600, price: 9.99 },
                ]
            },
            {
                code: 'ROBLOX',
                name: 'Roblox',
                publisher: 'Roblox Corporation',
                image: '/games/roblox.jpg',
                packages: [
                    { id: 'RBUX_400', amount: 400, price: 4.99 },
                    { id: 'RBUX_800', amount: 800, price: 9.99 },
                    { id: 'RBUX_1700', amount: 1700, price: 19.99 },
                ]
            },
            {
                code: 'MLBB',
                name: 'Mobile Legends',
                publisher: 'Moonton',
                image: '/games/mlbb.jpg',
                packages: [
                    { id: 'DIA_50', amount: 50, price: 0.99 },
                    { id: 'DIA_250', amount: 250, price: 4.99 },
                    { id: 'DIA_500', amount: 500, price: 9.99 },
                ]
            },
            {
                code: 'COC',
                name: 'Clash of Clans',
                publisher: 'Supercell',
                image: '/games/clash.jpg',
                packages: [
                    { id: 'GEM_500', amount: 500, price: 4.99 },
                    { id: 'GEM_1200', amount: 1200, price: 9.99 },
                    { id: 'GEM_2500', amount: 2500, price: 19.99 },
                ]
            },
            {
                code: 'VALORANT',
                name: 'Valorant',
                publisher: 'Riot Games',
                image: '/games/valorant.jpg',
                packages: [
                    { id: 'VP_475', amount: 475, price: 4.99 },
                    { id: 'VP_1000', amount: 1000, price: 9.99 },
                    { id: 'VP_2050', amount: 2050, price: 19.99 },
                ]
            },
            {
                code: 'GENSHIN',
                name: 'Genshin Impact',
                publisher: 'HoYoverse',
                image: '/games/genshin.jpg',
                packages: [
                    { id: 'CRYSTAL_60', amount: 60, price: 0.99 },
                    { id: 'CRYSTAL_300', amount: 300, price: 4.99 },
                    { id: 'CRYSTAL_980', amount: 980, price: 14.99 },
                ]
            },
            {
                code: 'HONKAI',
                name: 'Honkai: Star Rail',
                publisher: 'HoYoverse',
                image: '/games/honkai.jpg',
                packages: [
                    { id: 'SHARD_60', amount: 60, price: 0.99 },
                    { id: 'SHARD_300', amount: 300, price: 4.99 },
                    { id: 'SHARD_980', amount: 980, price: 14.99 },
                ]
            },
            {
                code: 'FREEFIRE',
                name: 'Free Fire',
                publisher: 'Garena',
                image: '/games/freefire.jpg',
                packages: [
                    { id: 'DIA_100', amount: 100, price: 0.99 },
                    { id: 'DIA_310', amount: 310, price: 2.99 },
                    { id: 'DIA_520', amount: 520, price: 4.99 },
                    { id: 'DIA_1060', amount: 1060, price: 9.99 },
                ]
            }
        ];
    }

    public static getInstance(): GameCatalog {
        if (!GameCatalog.instance) {
            GameCatalog.instance = new GameCatalog();
        }
        return GameCatalog.instance;
    }

    public getAllGames(): Game[] {
        return this.games;
    }

    public getGameByCode(code: string): Game | undefined {
        return this.games.find(g => g.code === code);
    }
}

export default GameCatalog.getInstance();
