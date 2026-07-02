import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { buildCiIndex } from '../index-builder/build-ci-index.js';
import { buildLocalIndex } from '../index-builder/build-index.js';
import { writeIndex } from '../index-builder/write-index.js';
import type { ImpactIndex } from '../types/index-schema.js';
import { runGenerate } from './generate-command.js';

vi.mock('../index-builder/build-ci-index.js', () => ({
  buildCiIndex: vi.fn(),
}));
vi.mock('../index-builder/build-index.js', () => ({
  buildLocalIndex: vi.fn(),
}));
vi.mock('../index-builder/write-index.js', () => ({
  writeIndex: vi.fn(() => '/tmp/index.develop.json'),
}));

function makeIndex(overrides: Partial<ImpactIndex> = {}): ImpactIndex {
  return {
    schemaVersion: 1,
    generatedAt: '2026-07-01T00:00:00.000Z',
    mode: 'ci',
    ffBranch: 'develop',
    ffCommit: 'abc1234',
    ffDirty: false,
    packages: [],
    scanErrors: [],
    symbols: [],
    outOfContractImports: [],
    cssComponents: [],
    cssGlobalRisks: [],
    appStates: [],
    ...overrides,
  };
}

describe('runGenerate', () => {
  let logs: string[];
  let tmpDir: string;

  beforeEach(() => {
    logs = [];
    vi.spyOn(console, 'log').mockImplementation((msg: string) => {
      logs.push(msg);
    });
    vi.spyOn(console, 'warn').mockImplementation((msg: string) => {
      logs.push(msg);
    });
    vi.spyOn(console, 'error').mockImplementation(() => {});
    process.exitCode = undefined;
    tmpDir = mkdtempSync(join(tmpdir(), 'impact-analyzer-generate-'));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.mocked(buildCiIndex).mockReset();
    vi.mocked(buildLocalIndex).mockReset();
    vi.mocked(writeIndex)
      .mockReset()
      .mockReturnValue('/tmp/index.develop.json');
    rmSync(tmpDir, { recursive: true, force: true });
    process.exitCode = undefined;
  });

  it('rejects an unknown mode without calling either builder', async () => {
    await runGenerate('bogus');

    expect(process.exitCode).toBe(1);
    expect(buildCiIndex).not.toHaveBeenCalled();
    expect(buildLocalIndex).not.toHaveBeenCalled();
  });

  it('calls buildLocalIndex for mode=local and ignores cachePath', async () => {
    vi.mocked(buildLocalIndex).mockReturnValue(makeIndex({ mode: 'local' }));

    await runGenerate('local', { cachePath: join(tmpDir, 'index.json') });

    expect(buildLocalIndex).toHaveBeenCalledTimes(1);
    expect(buildCiIndex).not.toHaveBeenCalled();
  });

  it('calls buildCiIndex without a previousIndex when no cachePath is given', async () => {
    vi.mocked(buildCiIndex).mockResolvedValue(makeIndex());

    await runGenerate('ci');

    expect(buildCiIndex).toHaveBeenCalledWith(undefined, {
      previousIndex: undefined,
    });
  });

  it('calls buildCiIndex without a previousIndex when cachePath points to a missing file', async () => {
    vi.mocked(buildCiIndex).mockResolvedValue(makeIndex());

    await runGenerate('ci', { cachePath: join(tmpDir, 'missing.json') });

    expect(buildCiIndex).toHaveBeenCalledWith(undefined, {
      previousIndex: undefined,
    });
  });

  it('loads and passes the previousIndex when cachePath points to an existing file', async () => {
    const previousIndex = makeIndex({
      appStates: [{ app: 'blog', branch: 'develop', commit: 'sha-1' }],
    });
    const cachePath = join(tmpDir, 'index.json');
    writeFileSync(cachePath, JSON.stringify(previousIndex));
    vi.mocked(buildCiIndex).mockResolvedValue(
      makeIndex({ appStates: previousIndex.appStates }),
    );

    await runGenerate('ci', { cachePath });

    expect(buildCiIndex).toHaveBeenCalledWith(undefined, {
      previousIndex,
    });
    expect(logs.some((l) => l.includes('cache:'))).toBe(true);
  });

  it('reports the scanError staleSince marker in its log output', async () => {
    const previousIndex = makeIndex({
      appStates: [{ app: 'blog', branch: 'develop', commit: 'sha-1' }],
    });
    const cachePath = join(tmpDir, 'index.json');
    writeFileSync(cachePath, JSON.stringify(previousIndex));
    vi.mocked(buildCiIndex).mockResolvedValue(
      makeIndex({
        appStates: previousIndex.appStates,
        scanErrors: [
          {
            app: 'blog',
            branch: 'develop',
            error: 'clone failed',
            staleSince: previousIndex.generatedAt,
          },
        ],
      }),
    );

    await runGenerate('ci', { cachePath });

    expect(
      logs.some((l) => l.includes('clone failed') && l.includes('stale since')),
    ).toBe(true);
  });
});
