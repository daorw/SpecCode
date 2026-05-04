import type Database from 'better-sqlite3';
import { getDb } from './connection';
import type { Project } from './schema';

export function getAllProjects(database?: Database.Database): Project[] {
  const db = database ?? getDb();
  return db.prepare('SELECT * FROM projects ORDER BY updated_at DESC').all() as Project[];
}

export function getProject(id: string, database?: Database.Database): Project | undefined {
  const db = database ?? getDb();
  return db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as Project | undefined;
}

export function getProjectByPath(path: string, database?: Database.Database): Project | undefined {
  const db = database ?? getDb();
  return db.prepare('SELECT * FROM projects WHERE path = ?').get(path) as Project | undefined;
}

export function createProject(project: { name: string; path: string; description?: string }, database?: Database.Database): Project {
  const db = database ?? getDb();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO projects (id, name, path, description, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, project.name, project.path, project.description || '', now, now);

  return getProject(id, db)!;
}

export function updateProject(id: string, updates: { name?: string; path?: string; description?: string }, database?: Database.Database): Project | undefined {
  const db = database ?? getDb();
  const existing = getProject(id, db);
  if (!existing) return undefined;

  const now = new Date().toISOString();
  const name = updates.name ?? existing.name;
  const path = updates.path ?? existing.path;
  const description = updates.description ?? existing.description;

  db.prepare(`
    UPDATE projects SET name = ?, path = ?, description = ?, updated_at = ?
    WHERE id = ?
  `).run(name, path, description, now, id);

  return getProject(id, db);
}

export function deleteProject(id: string, database?: Database.Database): void {
  const db = database ?? getDb();
  db.prepare('DELETE FROM projects WHERE id = ?').run(id);
}
