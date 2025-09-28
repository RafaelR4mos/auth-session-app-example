import Database from "better-sqlite3";
import path from "node:path";

const dbPath = path.join(process.cwd(), "app.db");
// Para modo totalmente em memória durante a aula, troque por:
// const db = new Database(':memory:');
const db = new Database(dbPath);

// Criação das tabelas
db.exec(`
PRAGMA journal_mode = WAL;


CREATE TABLE IF NOT EXISTS users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
email TEXT UNIQUE NOT NULL,
password_hash TEXT NOT NULL,
created_at TEXT NOT NULL DEFAULT (datetime('now'))
);


CREATE TABLE IF NOT EXISTS sessions (
id TEXT PRIMARY KEY,
user_id INTEGER NOT NULL,
created_at TEXT NOT NULL DEFAULT (datetime('now')),
expires_at TEXT NOT NULL,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
`);

export default db;
