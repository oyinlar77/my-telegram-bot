import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(__dirname, '..', 'data', 'bot.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT,
    first_name TEXT,
    balance INTEGER DEFAULT 5000,
    referral_count INTEGER DEFAULT 0,
    referred_by INTEGER DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS referrals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    referrer_id INTEGER NOT NULL,
    referred_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(referred_id)
  );

  CREATE TABLE IF NOT EXISTS prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service TEXT NOT NULL,
    tier TEXT NOT NULL,
    min_count INTEGER NOT NULL,
    max_count INTEGER NOT NULL,
    price INTEGER NOT NULL,
    UNIQUE(service, tier)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    service TEXT NOT NULL,
    topic TEXT,
    count INTEGER,
    price INTEGER,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY,
    username TEXT
  );
`);

// Insert default prices if not exists
const priceCount = (db.prepare('SELECT COUNT(*) as c FROM prices').get() as any).c;
if (priceCount === 0) {
  const insertPrice = db.prepare('INSERT INTO prices (service, tier, min_count, max_count, price) VALUES (?, ?, ?, ?, ?)');
  
  // Slayd prices
  insertPrice.run('slayd', 'tier1', 1, 10, 5000);
  insertPrice.run('slayd', 'tier2', 11, 15, 7000);
  
  // Referat prices
  insertPrice.run('referat', 'tier1', 1, 10, 5000);
  insertPrice.run('referat', 'tier2', 11, 20, 8000);
  insertPrice.run('referat', 'tier3', 21, 25, 10000);
  
  // Test prices
  insertPrice.run('test', 'tier1', 10, 20, 3000);
  insertPrice.run('test', 'tier2', 21, 30, 5000);
  insertPrice.run('test', 'tier3', 31, 40, 7000);
}

export default db;

// User functions
export const getUser = (id: number) => {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as any;
};

export const createUser = (id: number, username: string, firstName: string, referredBy?: number) => {
  db.prepare('INSERT OR IGNORE INTO users (id, username, first_name, balance, referred_by) VALUES (?, ?, ?, 5000, ?)').run(id, username, firstName, referredBy || null);
  
  if (referredBy) {
    const existing = db.prepare('SELECT * FROM referrals WHERE referred_id = ?').get(id);
    if (!existing) {
      db.prepare('INSERT INTO referrals (referrer_id, referred_id) VALUES (?, ?)').run(referredBy, id);
      db.prepare('UPDATE users SET referral_count = referral_count + 1 WHERE id = ?').run(referredBy);
      
      // Check if referrer reached 10 referrals milestone
      const referrer = db.prepare('SELECT referral_count FROM users WHERE id = ?').get(referredBy) as any;
      if (referrer && referrer.referral_count % 10 === 0) {
        db.prepare('UPDATE users SET balance = balance + 4000 WHERE id = ?').run(referredBy);
      }
    }
  }
  
  return getUser(id);
};

export const updateBalance = (id: number, amount: number) => {
  db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?').run(amount, id);
};

export const getPrice = (service: string, count: number) => {
  const prices = db.prepare('SELECT * FROM prices WHERE service = ? AND min_count <= ? AND max_count >= ?').get(service, count, count) as any;
  return prices?.price || 0;
};

export const getAllPrices = () => {
  return db.prepare('SELECT * FROM prices ORDER BY service, min_count').all() as any[];
};

export const updatePrice = (service: string, tier: string, price: number) => {
  db.prepare('UPDATE prices SET price = ? WHERE service = ? AND tier = ?').run(price, service, tier);
};

export const getUserStats = () => {
  return {
    total: (db.prepare('SELECT COUNT(*) as c FROM users').get() as any).c,
    today: (db.prepare("SELECT COUNT(*) as c FROM users WHERE date(created_at) = date('now')").get() as any).c,
  };
};

export const isAdmin = (id: number) => {
  return !!(db.prepare('SELECT * FROM admins WHERE id = ?').get(id));
};

export const addAdmin = (id: number, username: string) => {
  db.prepare('INSERT OR REPLACE INTO admins (id, username) VALUES (?, ?)').run(id, username);
};

export const getReferrals = (userId: number) => {
  return db.prepare('SELECT COUNT(*) as c FROM referrals WHERE referrer_id = ?').get(userId) as any;
};

export const saveOrder = (userId: number, service: string, topic: string, count: number, price: number) => {
  db.prepare('INSERT INTO orders (user_id, service, topic, count, price) VALUES (?, ?, ?, ?, ?)').run(userId, service, topic, count, price);
};
