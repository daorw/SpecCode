import { describe, it, expect } from 'vitest';
import { GRILL_ME_SYSTEM_PROMPT } from '@/lib/agent/system-prompt';

describe('System Prompt', () => {
  it('should contain key Grill-me concepts', () => {
    expect(GRILL_ME_SYSTEM_PROMPT).toContain('Grill-me');
    expect(GRILL_ME_SYSTEM_PROMPT).toContain('read_requirements');
    expect(GRILL_ME_SYSTEM_PROMPT).toContain('update_requirements');
    expect(GRILL_ME_SYSTEM_PROMPT).toContain('generate_code');
    expect(GRILL_ME_SYSTEM_PROMPT).toContain('version_control');
  });

  it('should contain the core workflow steps', () => {
    expect(GRILL_ME_SYSTEM_PROMPT).toContain('Capture intent');
    expect(GRILL_ME_SYSTEM_PROMPT).toContain('Define boundaries');
    expect(GRILL_ME_SYSTEM_PROMPT).toContain('Negotiate tech stack');
    expect(GRILL_ME_SYSTEM_PROMPT).toContain('Define acceptance criteria');
  });

  it('should contain interaction rules', () => {
    expect(GRILL_ME_SYSTEM_PROMPT).toContain('One question at a time');
    expect(GRILL_ME_SYSTEM_PROMPT).toContain('Incremental writing');
    expect(GRILL_ME_SYSTEM_PROMPT).toContain('User has final say');
  });

  it('should reference Markdown requirements format', () => {
    expect(GRILL_ME_SYSTEM_PROMPT).toContain('Markdown');
    expect(GRILL_ME_SYSTEM_PROMPT).toContain('[draft]');
    expect(GRILL_ME_SYSTEM_PROMPT).toContain('[confirmed]');
    expect(GRILL_ME_SYSTEM_PROMPT).toContain('[done]');
  });
});
