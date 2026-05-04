import simpleGit, { type SimpleGit } from 'simple-git';
import path from 'path';

export interface VersionIteration {
  version: string;
  branchName: string;
  tagName: string;
}

let git: SimpleGit | null = null;

export function getGit(repoPath: string): SimpleGit {
  if (!git || (git as unknown as { _baseDir?: string })._baseDir !== repoPath) {
    git = simpleGit(repoPath);
  }
  return git;
}

export async function initRepo(repoPath: string): Promise<void> {
  const g = simpleGit(repoPath);
  const isRepo = await g.checkIsRepo().catch(() => false);
  if (!isRepo) {
    await g.init();
  }
}

export async function getCurrentBranch(repoPath: string): Promise<string> {
  const g = getGit(repoPath);
  const status = await g.status();
  return status.current ?? 'main';
}

export async function getCurrentCommit(repoPath: string): Promise<string> {
  const g = getGit(repoPath);
  const log = await g.log({ maxCount: 1 });
  return log.latest?.hash ?? '';
}

export async function createVersionBranch(
  repoPath: string,
  version: string
): Promise<string> {
  const g = getGit(repoPath);
  const branchName = `version/${version}`;

  const branches = await g.branch();
  if (branches.all.includes(branchName)) {
    await g.checkout(branchName);
  } else {
    await g.checkoutLocalBranch(branchName);
  }

  return branchName;
}

export async function getDiff(
  repoPath: string,
  filePath: string,
  oldVersion: string,
  newVersion: string
): Promise<string> {
  const g = getGit(repoPath);
  const oldTag = `v${oldVersion}`;
  const newTag = `v${newVersion}`;

  try {
    const diff = await g.diff([oldTag, newTag, '--', filePath]);
    return diff;
  } catch {
    return '';
  }
}

export async function mergeToMain(repoPath: string, branchName: string, message: string): Promise<void> {
  const g = getGit(repoPath);
  const currentBranch = await getCurrentBranch(repoPath);

  try {
    await g.checkout('main');
    await g.merge([branchName]);
  } finally {
    await g.checkout(currentBranch);
  }
}

export async function createTag(repoPath: string, version: string, message: string): Promise<string> {
  const g = getGit(repoPath);
  const tagName = `v${version}`;

  try {
    await g.tag(['-d', tagName]);
  } catch {
    // tag doesn't exist yet, ignore
  }

  await g.addTag(tagName);
  return tagName;
}

export async function stageAndCommit(repoPath: string, files: string[], message: string): Promise<string> {
  const g = getGit(repoPath);
  for (const file of files) {
    await g.add(file);
  }
  const result = await g.commit(message);
  return result.commit;
}

export async function getTags(repoPath: string): Promise<string[]> {
  const g = getGit(repoPath);
  const tags = await g.tags();
  return tags.all;
}

export function parseVersion(version: string): { major: number; minor: number; patch: number } {
  const parts = version.split('.').map(Number);
  return {
    major: parts[0] ?? 0,
    minor: parts[1] ?? 0,
    patch: parts[2] ?? 0,
  };
}

export function bumpVersion(current: string, level: 'major' | 'minor' | 'patch'): string {
  const v = parseVersion(current);
  switch (level) {
    case 'major': return `${v.major + 1}.0.0`;
    case 'minor': return `${v.major}.${v.minor + 1}.0`;
    case 'patch': return `${v.major}.${v.minor}.${v.patch + 1}`;
  }
}

export function readRequirementsVersion(docContent: string): string {
  const match = docContent.match(/#\s+speccode\s+需求文档\s+V(\d+\.\d+\.\d+)/);
  if (match) return match[1];

  const altMatch = docContent.match(/version.*?(\d+\.\d+\.\d+)/i);
  if (altMatch) return altMatch[1];

  return '1.0.0';
}
