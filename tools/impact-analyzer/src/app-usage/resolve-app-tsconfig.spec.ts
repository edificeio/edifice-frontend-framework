import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resolveAppTsconfigPath } from './resolve-app-tsconfig.js';

describe('resolveAppTsconfigPath', () => {
  let appDir: string;

  beforeEach(() => {
    appDir = mkdtempSync(join(tmpdir(), 'impact-analyzer-tsconfig-'));
  });

  afterEach(() => {
    rmSync(appDir, { recursive: true, force: true });
  });

  it('returns null when none of the candidate tsconfig files exist', () => {
    expect(resolveAppTsconfigPath(appDir)).toBeNull();
  });

  it('falls back to tsconfig.json when no more specific candidate exists', () => {
    writeFileSync(join(appDir, 'tsconfig.json'), '{}');
    expect(resolveAppTsconfigPath(appDir)).toBe(join(appDir, 'tsconfig.json'));
  });

  it('prefers tsconfig.app.json over tsconfig.json (Vite solution-style layout)', () => {
    writeFileSync(join(appDir, 'tsconfig.json'), '{}');
    writeFileSync(join(appDir, 'tsconfig.app.json'), '{}');
    expect(resolveAppTsconfigPath(appDir)).toBe(
      join(appDir, 'tsconfig.app.json'),
    );
  });

  it('prefers tsconfig.app.json over tsconfig.lib.json when both exist', () => {
    writeFileSync(join(appDir, 'tsconfig.lib.json'), '{}');
    writeFileSync(join(appDir, 'tsconfig.app.json'), '{}');
    expect(resolveAppTsconfigPath(appDir)).toBe(
      join(appDir, 'tsconfig.app.json'),
    );
  });

  it('falls back to tsconfig.lib.json over the generic tsconfig.json', () => {
    writeFileSync(join(appDir, 'tsconfig.json'), '{}');
    writeFileSync(join(appDir, 'tsconfig.lib.json'), '{}');
    expect(resolveAppTsconfigPath(appDir)).toBe(
      join(appDir, 'tsconfig.lib.json'),
    );
  });
});
