// ── CREATIONAL PATTERN: SINGLETON ──
// GameCatalog is a single global source-of-truth for all games and packages.
// The Admin side manages promotions here — only ONE instance can exist.

const db = require('../db');

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
        this._games = [];
        this._promoCodes = {};

        // Load data from Postgres asynchronously
        this._loadGames();
    }

    // ── Singleton access method ──
    static getInstance() {
        if (!GameCatalog._instance) {
            GameCatalog._instance = new GameCatalog();
        }
        return GameCatalog._instance;
    }

    async _loadGames() {
        try {
            const gamesRes = await db.query('SELECT * FROM games');
            const packagesRes = await db.query('SELECT * FROM packages');
            const promosRes = await db.query('SELECT * FROM promo_codes');

            const gamesData = gamesRes.rows;
            const packagesData = packagesRes.rows;
            const promosData = promosRes.rows;

            this._games = gamesData.map(g => {
                const game = new Game(g.code, g.name, g.publisher);
                packagesData.filter(p => p.game_code === g.code).forEach(p => {
                    game.addPackage(new Package(p.id, p.amount, parseFloat(p.price)));
                });
                return game;
            });

            promosData.forEach(p => {
                this._promoCodes[p.code.toUpperCase()] = new PromoCode(p.code.toUpperCase(), p.discount_percentage);
            });

            console.log(`[Singleton] GameCatalog loaded from DB — ${this._games.length} games, ${promosData.length} promos.`);
        } catch (error) {
            console.error('[Singleton] Failed to load from DB:', error);
        }
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
