import { describe, it, expect } from 'vitest';
import { getInMemoryDb } from '@/lib/db/connection';
import { upsertRequirement, getRequirement, getAllRequirements, getRequirementsByStatus, updateRequirementStatus, deleteRequirement, getRequirementsMarkdown } from '@/lib/db/requirements-dao';
import { createVersionRecord, getLatestVersion, getVersionByVersion, getAllVersions } from '@/lib/db/versions-dao';
import { createProject, getProject, getProjectByPath, getAllProjects, updateProject, deleteProject } from '@/lib/db/projects-dao';

describe('Requirements DAO', () => {
  it('should upsert a new requirement', () => {
    const db = getInMemoryDb();
    const req = upsertRequirement({
      id: 'test_1',
      section: 'Test Section',
      status: 'draft',
      content: 'This is a test requirement',
    }, db);

    expect(req.id).toBe('test_1');
    expect(req.status).toBe('draft');
    expect(req.section).toBe('Test Section');
  });

  it('should update an existing requirement', () => {
    const db = getInMemoryDb();
    upsertRequirement({
      id: 'test_1',
      section: 'Original',
      status: 'draft',
      content: 'Original content',
    }, db);

    const updated = upsertRequirement({
      id: 'test_1',
      section: 'Updated',
      status: 'confirmed',
      content: 'Updated content',
    }, db);

    expect(updated.section).toBe('Updated');
    expect(updated.status).toBe('confirmed');
    expect(updated.content).toBe('Updated content');
  });

  it('should get requirement by id', () => {
    const db = getInMemoryDb();
    upsertRequirement({
      id: 'test_1',
      section: 'Section 1',
      status: 'draft',
      content: 'Content 1',
    }, db);

    const req = getRequirement('test_1', db);
    expect(req).toBeTruthy();
    expect(req!.section).toBe('Section 1');
  });

  it('should return undefined for non-existent requirement', () => {
    const db = getInMemoryDb();
    const req = getRequirement('nonexistent', db);
    expect(req).toBeUndefined();
  });

  it('should get requirements by status', () => {
    const db = getInMemoryDb();
    upsertRequirement({ id: 'r1', section: 'S1', status: 'draft', content: 'C1' }, db);
    upsertRequirement({ id: 'r2', section: 'S2', status: 'confirmed', content: 'C2' }, db);
    upsertRequirement({ id: 'r3', section: 'S3', status: 'done', content: 'C3' }, db);

    const draft = getRequirementsByStatus('draft', db);
    expect(draft.length).toBe(1);

    const confirmed = getRequirementsByStatus('confirmed', db);
    expect(confirmed.length).toBe(1);

    const done = getRequirementsByStatus('done', db);
    expect(done.length).toBe(1);
  });

  it('should update requirement status', () => {
    const db = getInMemoryDb();
    upsertRequirement({ id: 'test', section: 'S', status: 'draft', content: 'C' }, db);

    const updated = updateRequirementStatus('test', 'confirmed', db);
    expect(updated?.status).toBe('confirmed');
  });

  it('should delete a requirement', () => {
    const db = getInMemoryDb();
    upsertRequirement({ id: 'test', section: 'S', status: 'draft', content: 'C' }, db);

    deleteRequirement('test', db);
    const req = getRequirement('test', db);
    expect(req).toBeUndefined();
  });

  it('should generate markdown from requirements', () => {
    const db = getInMemoryDb();
    upsertRequirement({ id: 'r1', section: 'Auth', status: 'confirmed', content: 'User auth with JWT' }, db);
    upsertRequirement({ id: 'r2', section: 'API', status: 'draft', content: 'REST API endpoints' }, db);
    upsertRequirement({ id: 'r3', section: 'DB', status: 'done', content: 'PostgreSQL schema' }, db);

    const markdown = getRequirementsMarkdown(db);
    expect(markdown).toContain('已确认');
    expect(markdown).toContain('Auth');
    expect(markdown).toContain('[confirmed]');
    expect(markdown).toContain('待确认');
    expect(markdown).toContain('已完成');
  });

  it('should return empty string for no requirements', () => {
    const db = getInMemoryDb();
    const markdown = getRequirementsMarkdown(db);
    expect(markdown).toBe('');
  });

  it('should get all requirements sorted by section', () => {
    const db = getInMemoryDb();
    upsertRequirement({ id: 'z', section: 'Z Section', status: 'draft', content: 'Z' }, db);
    upsertRequirement({ id: 'a', section: 'A Section', status: 'draft', content: 'A' }, db);

    const all = getAllRequirements(db);
    expect(all[0].section).toBe('A Section');
    expect(all[1].section).toBe('Z Section');
  });
});

describe('Versions DAO', () => {
  it('should create a version record', () => {
    const db = getInMemoryDb();
    const record = createVersionRecord({
      version: '1.0.0',
      git_tag: 'v1.0.0',
      git_commit: 'abc123',
      doc_path: '/path/to/doc',
    }, db);

    expect(record.version).toBe('1.0.0');
    expect(record.git_tag).toBe('v1.0.0');
    expect(record.git_commit).toBe('abc123');
  });

  it('should get latest version', () => {
    const db = getInMemoryDb();
    createVersionRecord({ version: '1.0.0', git_tag: 'v1.0.0', git_commit: 'a', doc_path: '/d' }, db);
    createVersionRecord({ version: '1.0.1', git_tag: 'v1.0.1', git_commit: 'b', doc_path: '/d' }, db);

    const latest = getLatestVersion(db);
    expect(latest?.version).toBe('1.0.1');
  });

  it('should get version by version string', () => {
    const db = getInMemoryDb();
    createVersionRecord({ version: '2.0.0', git_tag: 'v2.0.0', git_commit: 'c', doc_path: '/d' }, db);

    const v = getVersionByVersion('2.0.0', db);
    expect(v?.git_tag).toBe('v2.0.0');
  });

  it('should get all versions sorted desc', () => {
    const db = getInMemoryDb();
    createVersionRecord({ version: '1.0.0', git_tag: 'v1.0.0', git_commit: 'a', doc_path: '/d' }, db);
    createVersionRecord({ version: '2.0.0', git_tag: 'v2.0.0', git_commit: 'b', doc_path: '/d' }, db);

    const all = getAllVersions(db);
    expect(all.length).toBe(2);
    expect(all[0].version).toBe('2.0.0');
  });
});

describe('Projects DAO', () => {
  it('should create a project', () => {
    const db = getInMemoryDb();
    const p = createProject({ name: 'My Project', path: '/home/user/my-project' }, db);
    expect(p.name).toBe('My Project');
    expect(p.path).toBe('/home/user/my-project');
    expect(p.id).toBeTruthy();
  });

  it('should get project by id', () => {
    const db = getInMemoryDb();
    const created = createProject({ name: 'Test', path: '/tmp/test' }, db);
    const p = getProject(created.id, db);
    expect(p?.name).toBe('Test');
  });

  it('should get project by path', () => {
    const db = getInMemoryDb();
    createProject({ name: 'P1', path: '/a/b' }, db);
    const p = getProjectByPath('/a/b', db);
    expect(p?.name).toBe('P1');
  });

  it('should get all projects sorted by updated_at desc', () => {
    const db = getInMemoryDb();
    createProject({ name: 'Old', path: '/old', description: '' }, db);
    // Explicitly update Old project to set an older timestamp
    db.prepare("UPDATE projects SET updated_at = '2020-01-01T00:00:00Z' WHERE path = '/old'").run();
    createProject({ name: 'New', path: '/new', description: '' }, db);
    const all = getAllProjects(db);
    expect(all.length).toBe(2);
    expect(all[0].name).toBe('New');
  });

  it('should update a project', () => {
    const db = getInMemoryDb();
    const created = createProject({ name: 'Original', path: '/original' }, db);
    const updated = updateProject(created.id, { name: 'Updated' }, db);
    expect(updated?.name).toBe('Updated');
    expect(updated?.path).toBe('/original');
  });

  it('should delete a project', () => {
    const db = getInMemoryDb();
    const created = createProject({ name: 'Delete Me', path: '/delete' }, db);
    deleteProject(created.id, db);
    const p = getProject(created.id, db);
    expect(p).toBeUndefined();
  });

  it('should throw on duplicate path', () => {
    const db = getInMemoryDb();
    createProject({ name: 'First', path: '/same' }, db);
    expect(() => createProject({ name: 'Second', path: '/same' }, db)).toThrow();
  });
});
