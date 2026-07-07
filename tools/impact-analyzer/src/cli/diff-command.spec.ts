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

  it('prints a neutral message and exits 0 when nothing changed', async () => {
    await runDiff({ base: 'develop' }, makeReport());
    expect(logs.some((l) => l.includes('No breaking or risky changes'))).toBe(
      true,
    );
    expect(process.exitCode).toBeUndefined();
  });

  it('always persists the report, even when nothing changed', async () => {
    const report = makeReport();
    await runDiff({ base: 'develop' }, report);

    expect(writeDiffReport).toHaveBeenCalledWith(report);
    expect(logs.some((l) => l.includes('Wrote'))).toBe(true);
  });

  it('does not persist anything when the report could not be built', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(buildDiffReport).mockImplementation(() => {
      throw new Error('some other unexpected failure');
    });

    await runDiff({ base: 'develop' });

    expect(writeDiffReport).not.toHaveBeenCalled();
  });

  it('defaults to local mode and passes it through to buildDiffReport', async () => {
    vi.mocked(buildDiffReport).mockResolvedValue(makeReport());

    await runDiff({ base: 'develop' });

    expect(buildDiffReport).toHaveBeenCalledWith('develop', undefined, {
      mode: 'local',
    });
  });

  it('passes mode: ci through to buildDiffReport when requested', async () => {
    vi.mocked(buildDiffReport).mockResolvedValue(makeReport());

    await runDiff({ base: 'develop', mode: 'ci' });

    expect(buildDiffReport).toHaveBeenCalledWith('develop', undefined, {
      mode: 'ci',
    });
  });

  it('rejects an unknown mode without calling buildDiffReport', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    await runDiff({ base: 'develop', mode: 'bogus' });

    expect(process.exitCode).toBe(1);
    expect(buildDiffReport).not.toHaveBeenCalled();
  });

  it('loads --head-index and passes it through to buildDiffReport', async () => {
    const { mkdtempSync, writeFileSync, rmSync } = await import('node:fs');
    const { tmpdir } = await import('node:os');
    const { join } = await import('node:path');
    const dir = mkdtempSync(join(tmpdir(), 'diff-command-spec-'));
    const headIndexPath = join(dir, 'index.develop.json');
    writeFileSync(
      headIndexPath,
      JSON.stringify({
        schemaVersion: 1,
        generatedAt: '2026-01-01T00:00:00.000Z',
        mode: 'ci',
        ffBranch: 'develop',
        ffCommit: 'bbb',
        ffDirty: false,
        packages: [],
        scanErrors: [],
        symbols: [],
        outOfContractImports: [],
        cssComponents: [],
        cssGlobalRisks: [],
        appStates: [],
      }),
    );
    vi.mocked(buildDiffReport).mockResolvedValue(makeReport());

    try {
      await runDiff({ base: '2.5.24', mode: 'ci', headIndexPath });

      expect(buildDiffReport).toHaveBeenCalledWith(
        '2.5.24',
        undefined,
        expect.objectContaining({
          headIndex: expect.objectContaining({ ffCommit: 'bbb' }),
        }),
      );
      expect(process.exitCode).toBeUndefined();
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('rejects an incompatible --head-index without building anything', async () => {
    const { mkdtempSync, writeFileSync, rmSync } = await import('node:fs');
    const { tmpdir } = await import('node:os');
    const { join } = await import('node:path');
    const errors: string[] = [];
    vi.spyOn(console, 'error').mockImplementation((msg: string) => {
      errors.push(msg);
    });
    const dir = mkdtempSync(join(tmpdir(), 'diff-command-spec-'));
    const headIndexPath = join(dir, 'index.develop.json');
    writeFileSync(headIndexPath, JSON.stringify({ schemaVersion: 999 }));

    try {
      await runDiff({ base: 'develop', headIndexPath });

      expect(process.exitCode).toBe(1);
      expect(buildDiffReport).not.toHaveBeenCalled();
      expect(errors.some((e) => e.includes('schemaVersion'))).toBe(true);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('records PR provenance in the report when --pr-url is given', async () => {
    vi.mocked(buildDiffReport).mockResolvedValue(makeReport());

    await runDiff({
      base: 'develop',
      prUrl: 'https://github.com/edificeio/edifice-frontend-framework/pull/527',
      prNumber: 527,
      prTitle: 'fix: Dropdown focus',
    });

    expect(buildDiffReport).toHaveBeenCalledWith(
      'develop',
      undefined,
      expect.objectContaining({
        source: {
          kind: 'pull-request',
          url: 'https://github.com/edificeio/edifice-frontend-framework/pull/527',
          number: 527,
          title: 'fix: Dropdown focus',
        },
      }),
    );
  });

  it('records no source when --pr-url is absent', async () => {
    vi.mocked(buildDiffReport).mockResolvedValue(makeReport());

    await runDiff({ base: 'develop' });

    const options = vi.mocked(buildDiffReport).mock.calls[0][2];
    expect(options?.source).toBeUndefined();
  });

  it('rejects a missing --head-index file without building anything', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    await runDiff({
      base: 'develop',
      headIndexPath: '/nonexistent/index.json',
    });

    expect(process.exitCode).toBe(1);
    expect(buildDiffReport).not.toHaveBeenCalled();
  });

  it('renders symbol diffs sorted as provided (already sorted by the report), with severity emoji', async () => {
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

    await runDiff({ base: 'develop' }, report);
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

  it('truncates a long app list beyond 5 entries', async () => {
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

    await runDiff({ base: 'develop' }, report);
    const table = logs.find((l) => l.includes('themes/_x.scss'));
    expect(table).toContain('a, b, c, d, e +2 more');
  });

  it('gives a contextualized error and exits 1 when the base ref cannot be found', async () => {
    const errors: string[] = [];
    vi.spyOn(console, 'error').mockImplementation((msg: string) => {
      errors.push(msg);
    });
    vi.mocked(buildDiffReport).mockImplementation(() => {
      throw new Error('fatal: invalid reference: this-ref-does-not-exist-xyz');
    });

    await runDiff({ base: 'this-ref-does-not-exist-xyz' });

    expect(process.exitCode).toBe(1);
    expect(errors.some((e) => e.includes('not found locally'))).toBe(true);
  });

  it('prints the raw error message for an unrelated failure', async () => {
    const errors: string[] = [];
    vi.spyOn(console, 'error').mockImplementation((msg: string) => {
      errors.push(msg);
    });
    vi.mocked(buildDiffReport).mockImplementation(() => {
      throw new Error('some other unexpected failure');
    });

    await runDiff({ base: 'develop' });

    expect(process.exitCode).toBe(1);
    expect(errors).toEqual(['some other unexpected failure']);
  });
});
