import type Database from 'better-sqlite3';
import { getDb } from './connection';
import type { VersionRecord } from './schema';

export function createVersionRecord(record: Omit<VersionRecord, 'id' | 'created_at'>, database?: Database.Database): VersionRecord {
  const db = database ?? getDb();
  const result = db.prepare(`
    INSERT INTO versions (version, git_tag, git_commit, doc_path)
    VALUES (?, ?, ?, ?)
  `).run(record.version, record.git_tag, record.git_commit, record.doc_path);

  return db.prepare('SELECT * FROM versions WHERE id = ?').get(result.lastInsertRowid) as VersionRecord;
}

export function getLatestVersion(database?: Database.Database): VersionRecord | undefined {
  const db = database ?? getDb();
  return db.prepare('SELECT * FROM versions ORDER BY id DESC LIMIT 1').get() as VersionRecord | undefined;
}

export function getVersionByVersion(version: string, database?: Database.Database): VersionRecord | undefined {
  const db = database ?? getDb();
  return db.prepare('SELECT * FROM versions WHERE version = ?').get(version) as VersionRecord | undefined;
}

export function getAllVersions(database?: Database.Database): VersionRecord[] {
  const db = database ?? getDb();
  return db.prepare('SELECT * FROM versions ORDER BY id DESC').all() as VersionRecord[];
}
