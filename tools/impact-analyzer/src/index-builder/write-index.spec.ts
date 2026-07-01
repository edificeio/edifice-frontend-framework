import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import type { ImpactIndex } from '../types/index-schema.js';
import { writeIndex } from './write-index.js';

function makeIndex(ffBranch: string): ImpactIndex {
  return {
    schemaVersion: 1,
    generatedAt: '2026-07-01T00:00:00.000Z',
    mode: 'local',
    ffBranch,
    ffCommit: 'abc123',
    ffDirty: false,
    packages: [],
    scanErrors: [],
    symbols: [],
    outOfContractImports: [],
    cssComponents: [],
    cssGlobalRisks: [],
  };
}

describe('writeIndex', () => {
  let dataDir: string;

  afterEach(() => {
    if (dataDir) rmSync(dataDir, { recursive: true, force: true });
  });

  it('writes one JSON file per branch, creating the data dir if needed', () => {
    dataDir = mkdtempSync(join(tmpdir(), 'impact-analyzer-data-'));
    const nestedDataDir = join(dataDir, 'nested');

    const filePath = writeIndex(makeIndex('develop'), nestedDataDir);

    expect(filePath).toBe(join(nestedDataDir, 'index.develop.json'));
    expect(existsSync(filePath)).toBe(true);
    expect(JSON.parse(readFileSync(filePath, 'utf-8')).ffBranch).toBe(
      'develop',
    );
  });

  it('sanitizes branch names containing slashes for the filename', () => {
    dataDir = mkdtempSync(join(tmpdir(), 'impact-analyzer-data-'));
    const filePath = writeIndex(makeIndex('feat/ENABLING-123'), dataDir);
    expect(filePath).toBe(join(dataDir, 'index.feat-ENABLING-123.json'));
  });
});
