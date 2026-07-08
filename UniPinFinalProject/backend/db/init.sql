CREATE TABLE games (
    code VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    publisher VARCHAR(255) NOT NULL,
    image_url VARCHAR(255)
);

CREATE TABLE packages (
    id VARCHAR(50) PRIMARY KEY,
    game_code VARCHAR(50) REFERENCES games(code) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE promo_codes (
    code VARCHAR(50) PRIMARY KEY,
    discount_percentage INTEGER NOT NULL
);

CREATE TABLE orders (
    id VARCHAR(100) PRIMARY KEY,
    game_code VARCHAR(50) REFERENCES games(code),
    player_id VARCHAR(255) NOT NULL,
    zone_id VARCHAR(50),
    package_id VARCHAR(50) REFERENCES packages(id),
    amount INTEGER NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    discount_percentage INTEGER DEFAULT 0,
    final_price DECIMAL(10, 2) NOT NULL,
    state VARCHAR(50) NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    id VARCHAR(100) PRIMARY KEY,
    order_id VARCHAR(100) REFERENCES orders(id) ON DELETE CASCADE,
    payment_method VARCHAR(50),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data

INSERT INTO games (code, name, publisher, image_url) VALUES
('PUBG', 'PUBG Mobile', 'Tencent', '/games/pubg.jpg'),
('ROBLOX', 'Roblox', 'Roblox Corporation', '/games/roblox.jpg'),
('MLBB', 'Mobile Legends', 'Moonton', '/games/mlbb.jpg'),
('COC', 'Clash of Clans', 'Supercell', '/games/clash.jpg'),
('VALORANT', 'Valorant', 'Riot Games', '/games/valorant.jpg'),
('GENSHIN', 'Genshin Impact', 'HoYoverse', '/games/genshin.jpg'),
('HONKAI', 'Honkai: Star Rail', 'HoYoverse', '/games/honkai.jpg'),
('FREEFIRE', 'Free Fire', 'Garena', '/games/freefire.jpg');

-- Packages
INSERT INTO packages (id, game_code, amount, price) VALUES
('PKG_60', 'PUBG', 60, 0.99),
('PKG_300', 'PUBG', 300, 4.99),
('PKG_600', 'PUBG', 600, 9.99),
('RBUX_400', 'ROBLOX', 400, 4.99),
('RBUX_800', 'ROBLOX', 800, 9.99),
('RBUX_1700', 'ROBLOX', 1700, 19.99),
('DIA_50', 'MLBB', 50, 0.99),
('DIA_250', 'MLBB', 250, 4.99),
('DIA_500', 'MLBB', 500, 9.99),
('GEM_500', 'COC', 500, 4.99),
('GEM_1200', 'COC', 1200, 9.99),
('GEM_2500', 'COC', 2500, 19.99),
('VP_475', 'VALORANT', 475, 4.99),
('VP_1000', 'VALORANT', 1000, 9.99),
('VP_2050', 'VALORANT', 2050, 19.99),
('CRYSTAL_60', 'GENSHIN', 60, 0.99),
('CRYSTAL_300', 'GENSHIN', 300, 4.99),
('CRYSTAL_980', 'GENSHIN', 980, 14.99),
('SHARD_60', 'HONKAI', 60, 0.99),
('SHARD_300', 'HONKAI', 300, 4.99),
('SHARD_980', 'HONKAI', 980, 14.99),
('DIA_100', 'FREEFIRE', 100, 0.99),
('DIA_310', 'FREEFIRE', 310, 2.99),
('DIA_520', 'FREEFIRE', 520, 4.99),
('DIA_1060', 'FREEFIRE', 1060, 9.99);

-- Promos
INSERT INTO promo_codes (code, discount_percentage) VALUES
('UNIPIN10', 10),
('HALFOFF', 50),
('RENDO25', 25);
