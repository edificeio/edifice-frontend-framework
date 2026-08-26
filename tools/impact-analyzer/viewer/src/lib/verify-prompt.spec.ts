import { describe, expect, it } from 'vitest';
import { buildVerifyPrompt } from './verify-prompt.js';

describe('buildVerifyPrompt', () => {
  it('references the data repo and the exact report file, not the report content', () => {
    const prompt = buildVerifyPrompt(
      'diff.develop-enabling..feat-ENABLING-1165-figma-design-tokens.json',
    );
    expect(prompt).toContain('edificeio/impact-analyzer-data');
    expect(prompt).toContain(
      'diff.develop-enabling..feat-ENABLING-1165-figma-design-tokens.json',
    );
  });

  it('stays short regardless of the file name — a pointer, not the report data', () => {
    const prompt = buildVerifyPrompt('diff.a..b.json');
    expect(prompt.length).toBeLessThan(200);
  });
});
