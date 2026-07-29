import initSqlJs, { Database } from 'sql.js';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(__dirname, '..', '..', 'database', 'poe_market_329.sqlite');

let dbInstance: Database | null = null;

export async function getDb(): Promise<Database> {
  if (dbInstance) return dbInstance;

  const SQL = await initSqlJs();

  const dbDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  if (fs.existsSync(DB_PATH)) {
    const filebuffer = fs.readFileSync(DB_PATH);
    dbInstance = new SQL.Database(filebuffer);
  } else {
    dbInstance = new SQL.Database();
  }

  initSchema(dbInstance);
  return dbInstance;
}

export function saveDb() {
  if (!dbInstance) return;
  const data = dbInstance.export();
  const buffer = Buffer.from(data);
  const dbDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, buffer);
}

function initSchema(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS currency_prices (
      id TEXT PRIMARY KEY,
      league TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      chaos_value REAL NOT NULL,
      divine_value REAL,
      icon TEXT,
      sparkline TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS unique_prices (
      id TEXT PRIMARY KEY,
      league TEXT NOT NULL,
      name TEXT NOT NULL,
      base_type TEXT,
      category TEXT NOT NULL,
      chaos_value REAL NOT NULL,
      divine_value REAL,
      icon TEXT,
      links INTEGER DEFAULT 0,
      sparkline TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS meta_builds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      league TEXT NOT NULL,
      class_name TEXT NOT NULL,
      ascendancy TEXT NOT NULL,
      main_skill TEXT NOT NULL,
      pct_usage REAL NOT NULL,
      top_uniques TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS patch_329_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      gem_name TEXT NOT NULL,
      change_type TEXT NOT NULL,
      summary TEXT NOT NULL,
      full_text TEXT NOT NULL
    );
  `);
  saveDb();
}
