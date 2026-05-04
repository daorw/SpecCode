import { describe, it, expect } from 'vitest';
import { parseVersion, bumpVersion, readRequirementsVersion } from '@/lib/git/git-ops';

describe('Git Ops - Version Utilities', () => {
  it('should parse a version string', () => {
    expect(parseVersion('1.2.3')).toEqual({ major: 1, minor: 2, patch: 3 });
    expect(parseVersion('0.0.1')).toEqual({ major: 0, minor: 0, patch: 1 });
  });

  it('should bump major version', () => {
    expect(bumpVersion('1.2.3', 'major')).toBe('2.0.0');
  });

  it('should bump minor version', () => {
    expect(bumpVersion('1.2.3', 'minor')).toBe('1.3.0');
  });

  it('should bump patch version', () => {
    expect(bumpVersion('1.2.3', 'patch')).toBe('1.2.4');
  });

  it('should read version from requirements document', () => {
    const doc = '# speccode 需求文档 V2.1.3\n\n## Overview\n...';
    expect(readRequirementsVersion(doc)).toBe('2.1.3');
  });

  it('should default to 1.0.0 when no version found', () => {
    expect(readRequirementsVersion('Just some text')).toBe('1.0.0');
  });
});
