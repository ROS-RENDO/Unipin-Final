// ── STRUCTURAL PATTERN: FACADE ──
// PublisherFacade hides the complexity of dealing with different game publisher APIs.
// The core system (TopUpOrder, index.js) only calls this Facade — never the publishers directly.

// ────────────────────────────────────────────────────────────────────────────
// GamePublisherAPI — Abstract interface (from class diagram)
// All publisher-specific adapters must implement this interface.
// ────────────────────────────────────────────────────────────────────────────
class GamePublisherAPI {
    getServerList(gameCode)       { throw new Error('getServerList() must be implemented'); }
    verify(playerId, zoneId)      { throw new Error('verify() must be implemented'); }
    checkout(orderId, amount)     { throw new Error('checkout() must be implemented'); }
    deliver(orderId, amount)      { throw new Error('deliver() must be implemented'); }
}

// ── Concrete Publisher: Moonton (MLBB) ──
class MoontonAPI extends GamePublisherAPI {
    getServerList()                { return [{ server_id: '2001', server_name: 'Asia' }, { server_id: '1001', server_name: 'SEA' }]; }
    verify(playerId, zoneId)       { return this._mockVerify(playerId, zoneId, { '12345678_2001': 'MLBB_Ros_Rendo', '87654321_1001': 'MLBB_ProGamer' }); }
    checkout(orderId, amount)      { return { providerTxn_id: `MOONTON-${orderId}` }; }
    deliver(orderId, amount)       { return { success: Math.random() > 0.05, deliveredAt: new Date() }; }
    _mockVerify(playerId, zoneId, db) {
        if (!zoneId) return { isValid: false, error: 'Zone ID is required for Mobile Legends' };
        const username = db[`${playerId}_${zoneId}`];
        return username ? { isValid: true, username } : { isValid: false, error: 'Player ID and Zone ID combination not found' };
    }
}

// ── Concrete Publisher: Tencent (PUBG) ──
class TencentAPI extends GamePublisherAPI {
    getServerList()                { return [{ server_id: 'global', server_name: 'Global' }]; }
    verify(playerId, zoneId)       { return playerId === '5522113344' ? { isValid: true, username: 'PUBG_Soldier99' } : { isValid: false }; }
    checkout(orderId, amount)      { return { providerTxn_id: `TENCENT-${orderId}` }; }
    deliver(orderId, amount)       { return { success: Math.random() > 0.05, deliveredAt: new Date() }; }
}

// ── Concrete Publisher: HoYoverse (Genshin, Honkai) ──
class HoYoverseAPI extends GamePublisherAPI {
    getServerList()                { return [{ server_id: 'os_asia', server_name: 'Asia' }, { server_id: 'prod_official_asia', server_name: 'Asia Official' }]; }
    verify(playerId, zoneId) {
        if (!zoneId) return { isValid: false, error: 'Server selection is required' };
        const db = { '700123456_os_asia': 'Genshin_Traveler', '800654321_prod_official_asia': 'Honkai_Trailblazer' };
        const username = db[`${playerId}_${zoneId}`];
        return username ? { isValid: true, username } : { isValid: false, error: 'Player not found on this server' };
    }
    checkout(orderId, amount)      { return { providerTxn_id: `HOYO-${orderId}` }; }
    deliver(orderId, amount)       { return { success: Math.random() > 0.05, deliveredAt: new Date() }; }
}

// ── Concrete Publisher: Generic (Roblox, Supercell, Riot, Garena) ──
class GenericPublisherAPI extends GamePublisherAPI {
    constructor(prefix, db) {
        super();
        this._prefix = prefix;
        this._db = db;
    }
    getServerList()                { return [{ server_id: 'default', server_name: 'Global' }]; }
    verify(playerId, zoneId) {
        const username = this._db[playerId];
        return username ? { isValid: true, username } : { isValid: false };
    }
    checkout(orderId, amount)      { return { providerTxn_id: `${this._prefix}-${orderId}` }; }
    deliver(orderId, amount)       { return { success: Math.random() > 0.05, deliveredAt: new Date() }; }
}

// ────────────────────────────────────────────────────────────────────────────
// THE FACADE — The only class the rest of the system talks to
// ────────────────────────────────────────────────────────────────────────────
class PublisherFacade {
    constructor() {
        // Map each game code to its publisher API (Facade hides this complexity)
        this._apis = {
            'MLBB':     new MoontonAPI(),
            'PUBG':     new TencentAPI(),
            'GENSHIN':  new HoYoverseAPI(),
            'HONKAI':   new HoYoverseAPI(),
            'ROBLOX':   new GenericPublisherAPI('ROBLOX', { 'ROB_998877': 'Roblox_Noob2024' }),
            'COC':      new GenericPublisherAPI('COC',    { 'COC_112233': 'CoC_Barbarian' }),
            'VALORANT': new GenericPublisherAPI('RIOT',   { 'VAL_445566': 'Valorant_Ace' }),
            'FREEFIRE': new GenericPublisherAPI('GARENA', { 'FF_334455': 'FF_Survivor_01', '123456789': 'FF_HeadshotKing' }),
        };
    }

    // ── Facade Method 1: Validate Player (wraps publisher verify + getServerList) ──
    async validatePlayer(gameCode, playerId, zoneId) {
        console.log(`[Facade] Routing validatePlayer(${gameCode}, ${playerId}) → publisher API`);

        return new Promise((resolve) => {
            setTimeout(() => {
                const api = this._apis[gameCode];
                if (!api) {
                    resolve({ isValid: false, error: `Unknown game: ${gameCode}` });
                    return;
                }

                // Try known publisher verify first
                const result = api.verify(playerId, zoneId);
                if (result.isValid) {
                    resolve({ isValid: true, username: result.username });
                    return;
                }

                // Return the precise error from the publisher API
                resolve({ isValid: false, error: result.error || 'Player ID not found in publisher database.' });
            }, 500);
        });
    }

    // ── Facade Method 2: Deliver Currency (wraps publisher checkout + deliver) ──
    async deliverCurrency(gameCode, playerId, orderId, amount) {
        console.log(`[Facade] Routing deliverCurrency(${gameCode}, ${amount}) → publisher API`);

        return new Promise((resolve) => {
            setTimeout(() => {
                const api = this._apis[gameCode];
                if (!api) {
                    resolve({ success: false, error: `Unknown game: ${gameCode}` });
                    return;
                }

                const checkoutResult = api.checkout(orderId, amount);
                const deliveryResult = api.deliver(orderId, amount);

                resolve({
                    success: deliveryResult.success,
                    providerTxnId: checkoutResult.providerTxn_id,
                    transactionId: `TXN_${Date.now()}`,
                    deliveredAt: deliveryResult.deliveredAt,
                });
            }, 800);
        });
    }

    // ── Facade Method 3: Get Server List (for UI dropdowns) ──
    getServerList(gameCode) {
        const api = this._apis[gameCode];
        return api ? api.getServerList() : [];
    }

    // ── Helper: expose test IDs for demo/testing ──
    getTestIds(gameCode) {
        const testMap = {
            'MLBB':     [{ playerId: '12345678', zoneId: '2001', username: 'MLBB_Ros_Rendo' }, { playerId: '87654321', zoneId: '1001', username: 'MLBB_ProGamer' }],
            'PUBG':     [{ playerId: '5522113344', zoneId: '', username: 'PUBG_Soldier99' }],
            'ROBLOX':   [{ playerId: 'ROB_998877', zoneId: '', username: 'Roblox_Noob2024' }],
            'COC':      [{ playerId: 'COC_112233', zoneId: '', username: 'CoC_Barbarian' }],
            'VALORANT': [{ playerId: 'VAL_445566', zoneId: '', username: 'Valorant_Ace' }],
            'GENSHIN':  [{ playerId: '700123456', zoneId: 'os_asia', username: 'Genshin_Traveler' }],
            'HONKAI':   [{ playerId: '800654321', zoneId: 'prod_official_asia', username: 'Honkai_Trailblazer' }],
            'FREEFIRE': [{ playerId: 'FF_334455', zoneId: '', username: 'FF_Survivor_01' }, { playerId: '123456789', zoneId: '', username: 'FF_HeadshotKing' }],
        };
        return testMap[gameCode.toUpperCase()] || [];
    }
}

module.exports = { PublisherFacade, GamePublisherAPI };
