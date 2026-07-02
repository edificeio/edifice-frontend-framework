import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { buildDiffReport } from '../diff/build-diff-report.js';
import { writeDiffReport } from '../diff/write-diff-report.js';
import type { DiffReport } from '../types/diff-schema.js';
import { runDiff } from './diff-command.js';

vi.mock('../diff/build-diff-report.js', () => ({ buildDiffReport: vi.fn() }));
vi.mock('../diff/write-diff-report.js', () => ({
  writeDiffReport: vi.fn(() => '/tmp/diff.develop..feat-x.json'),
}));

function makeReport(overrides: Partial<DiffReport> = {}): DiffReport {
  return {
    schemaVersion: 1,
    generatedAt: '2026-01-01T00:00:00.000Z',
    base: { ref: 'develop', commit: 'aaa' },
    head: { ref: 'feat-x', commit: 'bbb' },
    symbolDiffs: [],
    cssDiffs: [],
    scanErrors: [],
    ...overrides,
  };
}

describe('runDiff', () => {
  let logs: string[];

  beforeEach(() => {
    logs = [];
    vi.spyOn(console, 'log').mockImplementation((msg: string) => {
      logs.push(msg);
    });
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    process.exitCode = undefined;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.mocked(buildDiffReport).mockReset();
    vi.mocked(writeDiffReport).mockClear();
    process.exitCode = undefined;
  });

  it('prints a neutral message and exits 0 when nothing changed', () => {
    runDiff({ base: 'develop' }, makeReport());
    expect(logs.some((l) => l.includes('No breaking or risky changes'))).toBe(
      true,
    );
    expect(process.exitCode).toBeUndefined();
  });

  it('always persists the report, even when nothing changed', () => {
    const report = makeReport();
    runDiff({ base: 'develop' }, report);

    expect(writeDiffReport).toHaveBeenCalledWith(report);
    expect(logs.some((l) => l.includes('Wrote'))).toBe(true);
  });

  it('does not persist anything when the report could not be built', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(buildDiffReport).mockImplementation(() => {
      throw new Error('some other unexpected failure');
    });

    runDiff({ base: 'develop' });

    expect(writeDiffReport).not.toHaveBeenCalled();
  });

  it('renders symbol diffs sorted as provided (already sorted by the report), with severity emoji', () => {
    const report = makeReport({
      symbolDiffs: [
        {
          package: '@edifice.io/react',
          entry: '.',
          name: 'Dropdown',
          kind: 'const',
          changeKind: 'removed',
          severity: 'breaking',
          sourceFilesBase: [],
          sourceFilesHead: [],
          consumers: [
            { app: 'communities', appBranch: 'develop', usageSites: 12 },
            { app: 'blog', appBranch: 'develop', usageSites: 3 },
          ],
          riskScore: 4500,
        },
      ],
    });

    runDiff({ base: 'develop' }, report);
    const table = logs.find((l) => l.includes('Dropdown'));
    expect(table).toContain('🔴');
    expect(table).toContain('removed');
    expect(table).toContain('communities, blog');
    expect(
      logs.some((l) =>
        l.includes('1 breaking, 0 likely-breaking, 0 needs-review'),
      ),
    ).toBe(true);
  });

  it('truncates a long app list beyond 5 entries', () => {
    const report = makeReport({
      cssDiffs: [
        {
          file: 'themes/_x.scss',
          scope: 'global',
          globalScope: 'theme',
          severity: 'breaking',
          affectedApps: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
          riskScore: 800,
        },
      ],
    });

    runDiff({ base: 'develop' }, report);
    const table = logs.find((l) => l.includes('themes/_x.scss'));
    expect(table).toContain('a, b, c, d, e +2 more');
  });

  it('gives a contextualized error and exits 1 when the base ref cannot be found', () => {
    const errors: string[] = [];
    vi.spyOn(console, 'error').mockImplementation((msg: string) => {
      errors.push(msg);
    });
    vi.mocked(buildDiffReport).mockImplementation(() => {
      throw new Error('fatal: invalid reference: this-ref-does-not-exist-xyz');
    });

    runDiff({ base: 'this-ref-does-not-exist-xyz' });

    expect(process.exitCode).toBe(1);
    expect(errors.some((e) => e.includes('not found locally'))).toBe(true);
  });

  it('prints the raw error message for an unrelated failure', () => {
    const errors: string[] = [];
    vi.spyOn(console, 'error').mockImplementation((msg: string) => {
      errors.push(msg);
    });
    vi.mocked(buildDiffReport).mockImplementation(() => {
      throw new Error('some other unexpected failure');
    });

    runDiff({ base: 'develop' });

    expect(process.exitCode).toBe(1);
    expect(errors).toEqual(['some other unexpected failure']);
  });
});
