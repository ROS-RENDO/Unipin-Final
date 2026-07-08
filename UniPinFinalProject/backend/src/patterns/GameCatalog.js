// ── CREATIONAL PATTERN: SINGLETON ──
// GameCatalog is a single global source-of-truth for all games and packages.
// The Admin side manages promotions here — only ONE instance can exist.

const pool = require('../db');

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
    }

    // ── Singleton access method ──
    static getInstance() {
        if (!GameCatalog._instance) {
            GameCatalog._instance = new GameCatalog();
        }
        return GameCatalog._instance;
    }

    // Asynchronous init to fetch from PostgreSQL
    async init() {
        try {
            // Load promo codes
            const promoRes = await pool.query('SELECT code, discount_percentage FROM promo_codes');
            promoRes.rows.forEach(row => {
                this._promoCodes[row.code.toUpperCase()] = new PromoCode(row.code, parseFloat(row.discount_percentage));
            });

            // Load games
            const gamesRes = await pool.query('SELECT game_code, name, publisher FROM games');
            const packagesRes = await pool.query('SELECT package_id, game_code, amount, price FROM packages');

            this._games = gamesRes.rows.map(g => {
                const game = new Game(g.game_code, g.name, g.publisher);
                // Add packages for this game
                packagesRes.rows.filter(p => p.game_code === g.game_code).forEach(p => {
                    game.addPackage(new Package(p.package_id, parseFloat(p.amount), parseFloat(p.price)));
                });
                return game;
            });

            console.log('[Singleton] GameCatalog initialized from DB — games loaded:', this._games.length);
        } catch (err) {
            console.error('[Singleton] Failed to load data from DB:', err.message);
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
        return { success: false, error: `Invalid promo code.` };
    }

    // Admin: add a new promo code at runtime
    async addPromoCode(code, discountPercentage) {
        const upperCode = code.toUpperCase();
        try {
            await pool.query('INSERT INTO promo_codes (code, discount_percentage) VALUES ($1, $2) ON CONFLICT (code) DO UPDATE SET discount_percentage = $2', [upperCode, discountPercentage]);
            this._promoCodes[upperCode] = new PromoCode(upperCode, discountPercentage);
            console.log(`[Singleton] Admin added promo to DB: ${upperCode} (${discountPercentage}% off)`);
        } catch (err) {
            console.error(`[Singleton] Failed to add promo code to DB:`, err.message);
        }
    }
}

// Initialize the static instance holder
GameCatalog._instance = null;

module.exports = { GameCatalog, Game, Package, PromoCode };
