import Database from 'better-sqlite3';
import path from 'path';
import { DB_SCHEMA } from './schema';

let db: Database.Database | null = null;

function getDbPath(): string {
  const dbPath = process.env.SPECCODE_DB_PATH;
  if (dbPath) return dbPath;
  return path.join(process.cwd(), 'speccode.db');
}

export function getDb(): Database.Database {
  if (!db) {
    const dbPath = getDbPath();
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    initSchema(db);
  }
  return db;
}

function initSchema(database: Database.Database): void {
  database.exec(DB_SCHEMA);
}

export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}

export function getInMemoryDb(): Database.Database {
  const memDb = new Database(':memory:');
  memDb.exec(DB_SCHEMA);
  return memDb;
}
