import type Database from 'better-sqlite3';
import { getDb } from './connection';
import type { Requirement } from './schema';

export function getAllRequirements(database?: Database.Database): Requirement[] {
  const db = database ?? getDb();
  return db.prepare('SELECT * FROM requirements ORDER BY section').all() as Requirement[];
}

export function getRequirement(id: string, database?: Database.Database): Requirement | undefined {
  const db = database ?? getDb();
  return db.prepare('SELECT * FROM requirements WHERE id = ?').get(id) as Requirement | undefined;
}

export function getRequirementsByStatus(status: string, database?: Database.Database): Requirement[] {
  const db = database ?? getDb();
  return db.prepare('SELECT * FROM requirements WHERE status = ? ORDER BY section').all(status) as Requirement[];
}

export function upsertRequirement(req: Omit<Requirement, 'created_at' | 'updated_at'>, database?: Database.Database): Requirement {
  const db = database ?? getDb();
  const now = new Date().toISOString();

  const existing = getRequirement(req.id, db);
  if (existing) {
    db.prepare(`
      UPDATE requirements SET section = ?, status = ?, content = ?, updated_at = ?
      WHERE id = ?
    `).run(req.section, req.status, req.content, now, req.id);
  } else {
    db.prepare(`
      INSERT INTO requirements (id, section, status, content, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(req.id, req.section, req.status, req.content, now, now);
  }

  return getRequirement(req.id, db)!;
}

export function updateRequirementStatus(id: string, status: Requirement['status'], database?: Database.Database): Requirement | undefined {
  const db = database ?? getDb();
  const now = new Date().toISOString();
  db.prepare('UPDATE requirements SET status = ?, updated_at = ? WHERE id = ?').run(status, now, id);
  return getRequirement(id, db);
}

export function deleteRequirement(id: string, database?: Database.Database): void {
  const db = database ?? getDb();
  db.prepare('DELETE FROM requirements WHERE id = ?').run(id);
}

export function getRequirementsMarkdown(database?: Database.Database): string {
  const reqs = getAllRequirements(database);
  if (reqs.length === 0) return '';

  const lines: string[] = [];
  const byStatus: Record<string, Requirement[]> = {};
  for (const r of reqs) {
    if (!byStatus[r.status]) byStatus[r.status] = [];
    byStatus[r.status].push(r);
  }

  const statusOrder = ['confirmed', 'draft', 'done'];
  for (const status of statusOrder) {
    const items = byStatus[status];
    if (!items) continue;
    const label = status === 'confirmed' ? '已确认' : status === 'draft' ? '待确认' : '已完成';
    lines.push(`## ${label}`);
    lines.push('');
    for (const item of items) {
      lines.push(`### ${item.section} \`[${item.status}]\``);
      lines.push('');
      lines.push(item.content);
      lines.push('');
    }
  }

  return lines.join('\n');
}
