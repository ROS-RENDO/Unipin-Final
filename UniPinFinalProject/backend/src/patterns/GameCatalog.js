// ── CREATIONAL PATTERN: SINGLETON ──
// GameCatalog is a single global source-of-truth for all games and packages.
// The Admin side manages promotions here — only ONE instance can exist.

class PromoCode {
    constructor(code, discountPercentage) {
        this.code = code;
        this.discountPercentage = discountPercentage;
    }

    isValid() {
        return this.discountPercentage > 0 && this.code.length > 0;
    }
}

class Package {
    constructor(packageId, amount, price) {
        this.packageId = packageId;
        this.amount = amount;
        this.price = price;
    }
}

class Game {
    constructor(gameCode, name, publisher) {
        this.gameCode = gameCode;
        this.name = name;
        this.publisher = publisher;
        this.packages = [];
    }

    addPackage(pkg) {
        this.packages.push(pkg);
    }
}

class GameCatalog {
    // Private static instance — the SINGLETON pattern core
    constructor() {
        if (GameCatalog._instance) {
            throw new Error('GameCatalog is a Singleton — use GameCatalog.getInstance()');
        }
        this._games = this._loadGames();

        // Admin-managed promo codes (promotion engine)
        this._promoCodes = {
            'UNIPIN10': new PromoCode('UNIPIN10', 10),
            'HALFOFF':  new PromoCode('HALFOFF', 50),
            'RENDO25':  new PromoCode('RENDO25', 25),
        };

        console.log('[Singleton] GameCatalog instance created — games loaded:', this._games.length);
    }

    // ── Singleton access method ──
    static getInstance() {
        if (!GameCatalog._instance) {
            GameCatalog._instance = new GameCatalog();
        }
        return GameCatalog._instance;
    }

    _loadGames() {
        const games = [
            { code: 'PUBG',     name: 'PUBG Mobile',       publisher: 'Tencent' },
            { code: 'ROBLOX',   name: 'Roblox',            publisher: 'Roblox Corporation' },
            { code: 'MLBB',     name: 'Mobile Legends',    publisher: 'Moonton' },
            { code: 'COC',      name: 'Clash of Clans',    publisher: 'Supercell' },
            { code: 'VALORANT', name: 'Valorant',          publisher: 'Riot Games' },
            { code: 'GENSHIN',  name: 'Genshin Impact',    publisher: 'HoYoverse' },
            { code: 'HONKAI',   name: 'Honkai: Star Rail',  publisher: 'HoYoverse' },
            { code: 'FREEFIRE', name: 'Free Fire',         publisher: 'Garena' },
        ];

        const packages = {
            'PUBG':     [['PKG_60',60,0.99],['PKG_300',300,4.99],['PKG_600',600,9.99]],
            'ROBLOX':   [['RBUX_400',400,4.99],['RBUX_800',800,9.99],['RBUX_1700',1700,19.99]],
            'MLBB':     [['DIA_50',50,0.99],['DIA_250',250,4.99],['DIA_500',500,9.99]],
            'COC':      [['GEM_500',500,4.99],['GEM_1200',1200,9.99],['GEM_2500',2500,19.99]],
            'VALORANT': [['VP_475',475,4.99],['VP_1000',1000,9.99],['VP_2050',2050,19.99]],
            'GENSHIN':  [['CRYSTAL_60',60,0.99],['CRYSTAL_300',300,4.99],['CRYSTAL_980',980,14.99]],
            'HONKAI':   [['SHARD_60',60,0.99],['SHARD_300',300,4.99],['SHARD_980',980,14.99]],
            'FREEFIRE': [['DIA_100',100,0.99],['DIA_310',310,2.99],['DIA_520',520,4.99],['DIA_1060',1060,9.99]],
        };

        return games.map(g => {
            const game = new Game(g.code, g.name, g.publisher);
            (packages[g.code] || []).forEach(([id, amt, price]) => {
                game.addPackage(new Package(id, amt, price));
            });
            return game;
        });
    }

    getAllGames() {
        return this._games;
    }

    getGameById(gameCode) {
        return this._games.find(g => g.gameCode === gameCode.toUpperCase()) || null;
    }

    // Admin: validate and apply a promo code to an order
    validatePromoCode(code) {
        const promo = this._promoCodes[code.toUpperCase()];
        if (promo && promo.isValid()) {
            return { success: true, discountPercentage: promo.discountPercentage, message: `${promo.discountPercentage}% promo applied!` };
        }
        return { success: false, error: `Invalid promo code. Try: ${Object.keys(this._promoCodes).join(', ')}` };
    }

    // Admin: add a new promo code at runtime
    addPromoCode(code, discountPercentage) {
        this._promoCodes[code.toUpperCase()] = new PromoCode(code.toUpperCase(), discountPercentage);
        console.log(`[Singleton] Admin added promo: ${code} (${discountPercentage}% off)`);
    }
}

// Initialize the static instance holder
GameCatalog._instance = null;

module.exports = { GameCatalog, Game, Package, PromoCode };
