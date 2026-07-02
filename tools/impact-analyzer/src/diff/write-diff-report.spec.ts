import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import type { DiffReport } from '../types/diff-schema.js';
import { diffReportFilePath, writeDiffReport } from './write-diff-report.js';

function makeReport(base: string, head: string): DiffReport {
  return {
    schemaVersion: 1,
    generatedAt: '2026-07-01T00:00:00.000Z',
    base: { ref: base, commit: 'aaa' },
    head: { ref: head, commit: 'bbb' },
    symbolDiffs: [],
    cssDiffs: [],
    scanErrors: [],
  };
}

describe('writeDiffReport', () => {
  let dataDir: string;

  afterEach(() => {
    if (dataDir) rmSync(dataDir, { recursive: true, force: true });
  });

  it('writes the report keyed by base..head, creating the data dir if needed', () => {
    dataDir = mkdtempSync(join(tmpdir(), 'impact-analyzer-diff-data-'));
    const nestedDataDir = join(dataDir, 'nested');

    const filePath = writeDiffReport(
      makeReport('develop', 'feat-x'),
      nestedDataDir,
    );

    expect(filePath).toBe(join(nestedDataDir, 'diff.develop..feat-x.json'));
    expect(existsSync(filePath)).toBe(true);
    const written = JSON.parse(readFileSync(filePath, 'utf-8'));
    expect(written.base.ref).toBe('develop');
    expect(written.head.ref).toBe('feat-x');
  });

  it('sanitizes ref names containing slashes for the filename', () => {
    dataDir = mkdtempSync(join(tmpdir(), 'impact-analyzer-diff-data-'));

    const filePath = writeDiffReport(
      makeReport('develop', 'feat/ENABLING-123'),
      dataDir,
    );

    expect(filePath).toBe(
      join(dataDir, 'diff.develop..feat-ENABLING-123.json'),
    );
  });

  it('computes the same path via diffReportFilePath without writing anything', () => {
    dataDir = mkdtempSync(join(tmpdir(), 'impact-analyzer-diff-data-'));

    const path = diffReportFilePath('develop', 'feat-x', dataDir);

    expect(path).toBe(join(dataDir, 'diff.develop..feat-x.json'));
    expect(existsSync(path)).toBe(false);
  });
});
