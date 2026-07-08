-- Create Games Table
CREATE TABLE IF NOT EXISTS games (
    game_code VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    publisher VARCHAR(100) NOT NULL
);

-- Create Packages Table
CREATE TABLE IF NOT EXISTS packages (
    package_id VARCHAR(50) PRIMARY KEY,
    game_code VARCHAR(50) NOT NULL REFERENCES games(game_code) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Create Promo Codes Table
CREATE TABLE IF NOT EXISTS promo_codes (
    code VARCHAR(50) PRIMARY KEY,
    discount_percentage INTEGER NOT NULL
);

-- Create Registered Users Table
CREATE TABLE IF NOT EXISTS registered_users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    loyalty_points INTEGER DEFAULT 0
);

-- Create Guest Users Table
CREATE TABLE IF NOT EXISTS guest_users (
    session_token VARCHAR(255) PRIMARY KEY,
    ip_address VARCHAR(45) NOT NULL
);

-- Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(100) PRIMARY KEY,
    game_code VARCHAR(50) NOT NULL REFERENCES games(game_code),
    player_id VARCHAR(100) NOT NULL,
    zone_id VARCHAR(100),
    package_id VARCHAR(50),
    amount DECIMAL(10, 2) NOT NULL,
    final_price DECIMAL(10, 2),
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    transaction_id SERIAL PRIMARY KEY,
    order_id VARCHAR(100) NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    payment_method VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Mock Data (Only if empty)
INSERT INTO games (game_code, name, publisher)
VALUES 
    ('PUBG', 'PUBG Mobile', 'Tencent'),
    ('ROBLOX', 'Roblox', 'Roblox Corporation'),
    ('MLBB', 'Mobile Legends', 'Moonton'),
    ('COC', 'Clash of Clans', 'Supercell'),
    ('VALORANT', 'Valorant', 'Riot Games'),
    ('GENSHIN', 'Genshin Impact', 'HoYoverse'),
    ('HONKAI', 'Honkai: Star Rail', 'HoYoverse'),
    ('FREEFIRE', 'Free Fire', 'Garena')
ON CONFLICT (game_code) DO NOTHING;

INSERT INTO packages (package_id, game_code, amount, price)
VALUES
    ('PKG_60', 'PUBG', 60, 0.99), ('PKG_300', 'PUBG', 300, 4.99), ('PKG_600', 'PUBG', 600, 9.99),
    ('RBUX_400', 'ROBLOX', 400, 4.99), ('RBUX_800', 'ROBLOX', 800, 9.99), ('RBUX_1700', 'ROBLOX', 1700, 19.99),
    ('DIA_50', 'MLBB', 50, 0.99), ('DIA_250', 'MLBB', 250, 4.99), ('DIA_500', 'MLBB', 500, 9.99),
    ('GEM_500', 'COC', 500, 4.99), ('GEM_1200', 'COC', 1200, 9.99), ('GEM_2500', 'COC', 2500, 19.99),
    ('VP_475', 'VALORANT', 475, 4.99), ('VP_1000', 'VALORANT', 1000, 9.99), ('VP_2050', 'VALORANT', 2050, 19.99),
    ('CRYSTAL_60', 'GENSHIN', 60, 0.99), ('CRYSTAL_300', 'GENSHIN', 300, 4.99), ('CRYSTAL_980', 'GENSHIN', 980, 14.99),
    ('SHARD_60', 'HONKAI', 60, 0.99), ('SHARD_300', 'HONKAI', 300, 4.99), ('SHARD_980', 'HONKAI', 980, 14.99),
    ('DIA_100', 'FREEFIRE', 100, 0.99), ('DIA_310', 'FREEFIRE', 310, 2.99), ('DIA_520', 'FREEFIRE', 520, 4.99), ('DIA_1060', 'FREEFIRE', 1060, 9.99)
ON CONFLICT (package_id) DO NOTHING;

INSERT INTO promo_codes (code, discount_percentage)
VALUES 
    ('UNIPIN10', 10),
    ('HALFOFF', 50),
    ('RENDO25', 25)
ON CONFLICT (code) DO NOTHING;

INSERT INTO registered_users (email, loyalty_points)
VALUES 
    ('visal@example.com', 100),
    ('rendo@example.com', 500)
ON CONFLICT (email) DO NOTHING;
