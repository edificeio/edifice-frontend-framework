import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { cpSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ImpactIndex } from '../types/index-schema.js';

vi.mock('../discovery/remote-clone.js', () => ({
  cloneTargetSparse: vi.fn(),
  cleanupClone: vi.fn(),
}));

import { cleanupClone, cloneTargetSparse } from '../discovery/remote-clone.js';
import { cleanupTempDir, createTempGitRepo } from '../discovery/test-utils.js';
import { buildCiIndex } from './build-ci-index.js';

const ffFixtureDir = fileURLToPath(
  new URL('../../test/fixtures/ff-fixture', import.meta.url),
);

const FIXTURE_ENTRY_MAP = {
  '@edifice.io/fixture': {
    '.': 'src/index.ts',
    './icons': 'src/icons/index.ts',
  },
};

const APP_TSCONFIG = {
  compilerOptions: {
    target: 'ESNext',
    module: 'ESNext',
    moduleResolution: 'bundler',
    jsx: 'react-jsx',
    esModuleInterop: true,
    skipLibCheck: true,
    noEmit: true,
  },
  include: ['src'],
};

function b64(content: unknown): string {
  return Buffer.from(JSON.stringify(content)).toString('base64');
}

/** Builds a fake "clone" directly on disk (bypasses real git — remote-clone.ts is mocked). */
function makeFakeClone(): string {
  const dir = mkdtempSync(join(tmpdir(), 'impact-analyzer-fakeclone-'));
  mkdirSync(join(dir, 'frontend', 'src'), { recursive: true });
  writeFileSync(
    join(dir, 'frontend', 'tsconfig.json'),
    JSON.stringify(APP_TSCONFIG),
  );
  writeFileSync(
    join(dir, 'frontend', 'src', 'Widget.tsx'),
    `import { Button } from '@edifice.io/fixture';\nexport function Widget() { return <Button />; }\n`,
  );
  return dir;
}

/**
 * Same as makeFakeClone(), but nested under a monorepo subdir (e.g.
 * 'conversation') — mirrors the entcore layout (`<path>/frontend/...`), so
 * the sparse-checkout's srcRelPath/packageJsonRelPath (which now carry the
 * `path` prefix) resolve to real files on disk.
 */
function makeFakeMonorepoClone(subdir: string): string {
  const dir = mkdtempSync(join(tmpdir(), 'impact-analyzer-fakeclone-'));
  mkdirSync(join(dir, subdir, 'frontend', 'src'), { recursive: true });
  writeFileSync(
    join(dir, subdir, 'frontend', 'tsconfig.json'),
    JSON.stringify(APP_TSCONFIG),
  );
  writeFileSync(
    join(dir, subdir, 'frontend', 'src', 'Widget.tsx'),
    `import { Button } from '@edifice.io/fixture';\nexport function Widget() { return <Button />; }\n`,
  );
  return dir;
}

describe('buildCiIndex', () => {
  let ffRepoRoot: string;
  const fakeCloneDirs: string[] = [];
  const originalToken = process.env.IMPACT_ANALYZER_GITHUB_TOKEN;

  beforeEach(() => {
    ffRepoRoot = createTempGitRepo();
    mkdirSync(join(ffRepoRoot, 'packages'), { recursive: true });
    cpSync(ffFixtureDir, join(ffRepoRoot, 'packages', 'fixture-pkg'), {
      recursive: true,
    });
    process.env.IMPACT_ANALYZER_GITHUB_TOKEN = 'tok';

    vi.mocked(cloneTargetSparse).mockImplementation(() => {
      const dir = makeFakeClone();
      fakeCloneDirs.push(dir);
      return { repoPath: dir };
    });
    vi.mocked(cleanupClone).mockImplementation(({ repoPath }) => {
      rmSync(repoPath, { recursive: true, force: true });
    });
  });

  afterEach(() => {
    cleanupTempDir(ffRepoRoot);
    fakeCloneDirs
      .splice(0)
      .forEach((d) => rmSync(d, { recursive: true, force: true }));
    vi.mocked(cloneTargetSparse).mockReset();
    vi.mocked(cleanupClone).mockReset();
    if (originalToken === undefined)
      delete process.env.IMPACT_ANALYZER_GITHUB_TOKEN;
    else process.env.IMPACT_ANALYZER_GITHUB_TOKEN = originalToken;
  });

  function fetchImplFor(apps: string[]) {
    return vi.fn(async (url: string) => {
      if (apps.some((a) => url.includes(`/repos/edificeio/${a}/branches/`))) {
        return new Response(
          JSON.stringify({
            commit: { sha: `sha-${apps.find((a) => url.includes(a))}` },
          }),
        );
      }
      if (url.includes('/contents/frontend/package.json')) {
        return new Response(
          JSON.stringify({
            content: b64({
              dependencies: { '@edifice.io/fixture': 'develop' },
            }),
          }),
        );
      }
      return new Response(null, { status: 404 });
    });
  }

  function makePreviousIndex(
    overrides: Partial<ImpactIndex> = {},
  ): ImpactIndex {
    return {
      schemaVersion: 1,
      generatedAt: '2026-06-30T02:00:00.000Z',
      mode: 'ci',
      ffBranch: 'develop',
      ffCommit: 'old-ff-commit',
      ffDirty: false,
      packages: ['@edifice.io/fixture'],
      scanErrors: [],
      symbols: [],
      outOfContractImports: [],
      cssComponents: [],
      cssGlobalRisks: [],
      appStates: [],
      ...overrides,
    };
  }

  function makeButtonSymbol(appCommit: string) {
    return {
      package: '@edifice.io/fixture',
      entry: '.',
      name: 'Button',
      kind: 'component' as const,
      sourceFiles: [],
      consumers: [
        {
          app: 'good-app',
          org: 'edificeio',
          appBranch: 'develop',
          pins: 'develop',
          appCommit,
          appDirty: false,
          usageSites: 1,
          files: ['frontend/src/Widget.tsx'],
        },
      ],
    };
  }

  it('reuses previous consumers without re-cloning when the branch head commit is unchanged (cache hit)', async () => {
    const fetchImpl = fetchImplFor(['good-app']); // branch head resolves to "sha-good-app"
    const previousIndex = makePreviousIndex({
      symbols: [makeButtonSymbol('sha-good-app')],
      appStates: [
        { app: 'good-app', branch: 'develop', commit: 'sha-good-app' },
      ],
    });

    const index = await buildCiIndex(
      [
        {
          name: 'good-app',
          org: 'edificeio',
          repo: 'good-app',
          branches: ['develop'],
        },
      ],
      {
        repoRoot: ffRepoRoot,
        ffPackages: [{ packageDirName: 'fixture-pkg' }],
        ffEntryMap: FIXTURE_ENTRY_MAP,
        githubClientOptions: { fetchImpl },
        previousIndex,
      },
    );

    expect(index.scanErrors).toEqual([]);
    expect(cloneTargetSparse).not.toHaveBeenCalled();

    const buttonSymbol = index.symbols.find(
      (s) => s.name === 'Button' && !s.isAggregate,
    );
    expect(buttonSymbol?.consumers).toEqual([
      expect.objectContaining({
        app: 'good-app',
        appCommit: 'sha-good-app',
        usageSites: 1,
      }),
    ]);
    expect(index.appStates).toEqual([
      { app: 'good-app', branch: 'develop', commit: 'sha-good-app' },
    ]);
  });

  it('falls back to previous data marked stale when a cache-miss clone fails', async () => {
    const fetchImpl = fetchImplFor(['good-app']); // branch head resolves to "sha-good-app" — differs from the cached "old-sha"
    vi.mocked(cloneTargetSparse).mockImplementationOnce(() => {
      throw new Error('git fetch failed for edificeio/good-app#develop');
    });
    const previousIndex = makePreviousIndex({
      symbols: [makeButtonSymbol('old-sha')],
      appStates: [{ app: 'good-app', branch: 'develop', commit: 'old-sha' }],
    });

    const index = await buildCiIndex(
      [
        {
          name: 'good-app',
          org: 'edificeio',
          repo: 'good-app',
          branches: ['develop'],
        },
      ],
      {
        repoRoot: ffRepoRoot,
        ffPackages: [{ packageDirName: 'fixture-pkg' }],
        ffEntryMap: FIXTURE_ENTRY_MAP,
        githubClientOptions: { fetchImpl },
        previousIndex,
      },
    );

    expect(index.scanErrors).toHaveLength(1);
    expect(index.scanErrors[0].app).toBe('good-app');
    expect(index.scanErrors[0].staleSince).toBe(previousIndex.generatedAt);

    const buttonSymbol = index.symbols.find(
      (s) => s.name === 'Button' && !s.isAggregate,
    );
    expect(buttonSymbol?.consumers).toEqual([
      expect.objectContaining({ app: 'good-app', appCommit: 'old-sha' }),
    ]);
    // Keeps the OLD commit, not the unreachable current one — forces a real retry next run.
    expect(index.appStates).toEqual([
      { app: 'good-app', branch: 'develop', commit: 'old-sha' },
    ]);
  });

  it('builds a mode: ci index with consumers stitched from cloned apps, and cleans up every clone', async () => {
    const fetchImpl = fetchImplFor(['good-app']);

    const index = await buildCiIndex(
      [
        {
          name: 'good-app',
          org: 'edificeio',
          repo: 'good-app',
          branches: ['develop'],
        },
      ],
      {
        repoRoot: ffRepoRoot,
        ffPackages: [{ packageDirName: 'fixture-pkg' }],
        ffEntryMap: FIXTURE_ENTRY_MAP,
        githubClientOptions: { fetchImpl },
      },
    );

    expect(index.mode).toBe('ci');
    expect(index.scanErrors).toEqual([]);

    const buttonSymbol = index.symbols.find(
      (s) => s.name === 'Button' && !s.isAggregate,
    );
    expect(buttonSymbol?.consumers).toEqual([
      expect.objectContaining({
        app: 'good-app',
        appBranch: 'develop',
        appCommit: 'sha-good-app',
        appDirty: false,
        usageSites: 1,
      }),
    ]);

    expect(cloneTargetSparse).toHaveBeenCalledTimes(1);
    expect(cleanupClone).toHaveBeenCalledTimes(1);
  });

  it('reports a scanError and still processes other apps when a clone fails', async () => {
    const fetchImpl = fetchImplFor(['bad-app', 'good-app']);
    vi.mocked(cloneTargetSparse).mockImplementationOnce(() => {
      throw new Error('git fetch failed for edificeio/bad-app#develop');
    });

    const index = await buildCiIndex(
      [
        {
          name: 'bad-app',
          org: 'edificeio',
          repo: 'bad-app',
          branches: ['develop'],
        },
        {
          name: 'good-app',
          org: 'edificeio',
          repo: 'good-app',
          branches: ['develop'],
        },
      ],
      {
        repoRoot: ffRepoRoot,
        ffPackages: [{ packageDirName: 'fixture-pkg' }],
        ffEntryMap: FIXTURE_ENTRY_MAP,
        githubClientOptions: { fetchImpl },
      },
    );

    expect(index.scanErrors).toHaveLength(1);
    expect(index.scanErrors[0].app).toBe('bad-app');
    const buttonSymbol = index.symbols.find(
      (s) => s.name === 'Button' && !s.isAggregate,
    );
    expect(buttonSymbol?.consumers).toHaveLength(1);
    expect(buttonSymbol?.consumers[0].app).toBe('good-app');
  });

  it('e2e monorepo case: an entcore-style app (path) produces repo-relative files prefixed by its subdir', async () => {
    vi.mocked(cloneTargetSparse).mockImplementation((opts) => {
      const dir = makeFakeMonorepoClone('conversation');
      fakeCloneDirs.push(dir);
      // Real remote-clone.ts uses opts.sparsePath for `git sparse-checkout
      // set` — nothing to assert on disk here since it's mocked, but keep
      // it referenced so a future signature change isn't silently ignored.
      expect(opts.sparsePath).toBe('conversation/frontend/src');
      return { repoPath: dir };
    });

    const fetchImpl = vi.fn(async (url: string) => {
      if (url.includes('/repos/edificeio/entcore/branches/'))
        return new Response(JSON.stringify({ commit: { sha: 'sha-conv' } }));
      if (
        url.includes('/contents/conversation/frontend/package.json.template')
      ) {
        return new Response(
          JSON.stringify({
            content: b64({
              dependencies: { '@edifice.io/fixture': 'develop' },
            }),
          }),
        );
      }
      if (url.includes('/contents/conversation/frontend/package.json')) {
        return new Response(null, { status: 404 });
      }
      return new Response(null, { status: 404 });
    });

    const index = await buildCiIndex(
      [
        {
          name: 'conversation',
          org: 'edificeio',
          repo: 'entcore',
          path: 'conversation',
          branches: ['dev'],
        },
      ],
      {
        repoRoot: ffRepoRoot,
        ffPackages: [{ packageDirName: 'fixture-pkg' }],
        ffEntryMap: FIXTURE_ENTRY_MAP,
        githubClientOptions: { fetchImpl },
      },
    );

    expect(index.scanErrors).toEqual([]);

    const buttonSymbol = index.symbols.find(
      (s) => s.name === 'Button' && !s.isAggregate,
    );
    expect(buttonSymbol?.consumers).toEqual([
      expect.objectContaining({
        app: 'conversation',
        repo: 'entcore',
        appBranch: 'dev',
        files: ['conversation/frontend/src/Widget.tsx'],
      }),
    ]);
  });

  it('reports a scanError (missing token) without crashing, and cleans up no clone for that app', async () => {
    delete process.env.IMPACT_ANALYZER_GITHUB_TOKEN;
    const fetchImpl = fetchImplFor(['good-app']);

    const index = await buildCiIndex(
      [
        {
          name: 'good-app',
          org: 'edificeio',
          repo: 'good-app',
          branches: ['develop'],
        },
      ],
      {
        repoRoot: ffRepoRoot,
        ffPackages: [{ packageDirName: 'fixture-pkg' }],
        ffEntryMap: FIXTURE_ENTRY_MAP,
        githubClientOptions: { fetchImpl },
      },
    );

    expect(index.scanErrors).toHaveLength(1);
    expect(index.scanErrors[0].error).toContain('No GitHub token found');
    expect(cloneTargetSparse).not.toHaveBeenCalled();
  });
});
