import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanupTempDir,
  createTempGitRepo,
  writePackageJson,
} from '../discovery/test-utils.js';
import { buildLocalIndex } from './build-index.js';

const ffFixtureDir = fileURLToPath(
  new URL('../../test/fixtures/ff-fixture', import.meta.url),
);

const FIXTURE_ENTRY_MAP = {
  '@edifice.io/fixture': {
    '.': 'src/index.ts',
    './icons': 'src/icons/index.ts',
  },
};

const FIXTURE_TSCONFIG = {
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

describe('buildLocalIndex', () => {
  let ffRepoRoot: string;
  let appRepoPath: string;
  const originalReposRoot = process.env.IMPACT_ANALYZER_REPOS_ROOT;

  beforeEach(() => {
    ffRepoRoot = createTempGitRepo();
    mkdirSync(join(ffRepoRoot, 'packages'), { recursive: true });
    cpSync(ffFixtureDir, join(ffRepoRoot, 'packages', 'fixture-pkg'), {
      recursive: true,
    });

    appRepoPath = createTempGitRepo();
    writePackageJson(appRepoPath, 'frontend', {
      name: 'fixture-app-frontend',
      dependencies: { '@edifice.io/fixture': 'develop' },
    });
    mkdirSync(join(appRepoPath, 'frontend', 'src'), { recursive: true });
    writeFileSync(
      join(appRepoPath, 'frontend', 'tsconfig.json'),
      JSON.stringify(FIXTURE_TSCONFIG),
    );
    writeFileSync(
      join(appRepoPath, 'frontend', 'src', 'Widget.tsx'),
      `import { Button } from '@edifice.io/fixture';\nexport function Widget() { return <Button />; }\n`,
    );

    process.env.IMPACT_ANALYZER_REPOS_ROOT = dirname(appRepoPath);
  });

  afterEach(() => {
    cleanupTempDir(ffRepoRoot);
    cleanupTempDir(appRepoPath);
    if (originalReposRoot === undefined)
      delete process.env.IMPACT_ANALYZER_REPOS_ROOT;
    else process.env.IMPACT_ANALYZER_REPOS_ROOT = originalReposRoot;
  });

  it('builds a full index: FF symbols with attached consumers, and a scanError for a missing app', () => {
    const repoName = appRepoPath.slice(appRepoPath.lastIndexOf('/') + 1);
    const apps = [
      {
        name: 'fixture-app',
        org: 'edificeio',
        repo: repoName,
        branches: ['develop'],
      },
      {
        name: 'ghost-app',
        org: 'edificeio',
        repo: 'does-not-exist',
        branches: ['develop'],
      },
    ];

    const index = buildLocalIndex(apps, {
      repoRoot: ffRepoRoot,
      ffPackages: [{ packageDirName: 'fixture-pkg' }],
      ffEntryMap: FIXTURE_ENTRY_MAP,
    });

    expect(index.schemaVersion).toBe(1);
    expect(index.mode).toBe('local');
    expect(index.ffBranch).toBe('develop');
    // ffDirty just reflects `git status --porcelain` truthfully — the fixture
    // files copied in beforeEach are untracked, so a dirty FF repo here is
    // expected, not a defect.
    expect(index.packages).toEqual(['@edifice.io/fixture']);

    const buttonSymbol = index.symbols.find(
      (s) => s.name === 'Button' && !s.isAggregate,
    );
    expect(buttonSymbol?.consumers).toHaveLength(1);
    expect(buttonSymbol?.consumers[0]).toMatchObject({
      app: 'fixture-app',
      org: 'edificeio',
      repo: repoName,
      appBranch: 'develop',
      pins: 'develop',
      usageSites: 1,
      // Repo-root-relative (never absolute, never machine-specific) — the
      // form GitHub blob permalinks are built from.
      files: ['frontend/src/Widget.tsx'],
    });

    // Icons aggregate rolls up per-app usage even though no icon is used here.
    const iconsAggregate = index.symbols.find((s) => s.isAggregate);
    expect(iconsAggregate?.consumers).toEqual([]);

    expect(index.scanErrors).toHaveLength(1);
    expect(index.scanErrors[0]).toMatchObject({
      app: 'ghost-app',
      branch: null,
    });

    // No packages/bootstrap/src in this fake FF repo — CSS wiring degrades
    // to empty arrays rather than throwing.
    expect(index.cssComponents).toEqual([]);
    expect(index.cssGlobalRisks).toEqual([]);
  });

  it('wires the CSS analyzer into the index when a bootstrapSrcDir is provided', () => {
    mkdirSync(join(ffRepoRoot, 'bootstrap-src', 'components'), {
      recursive: true,
    });
    writeFileSync(
      join(ffRepoRoot, 'bootstrap-src', 'components', '_button.scss'),
      '.button {\n  &-primary { color: blue; }\n}\n',
    );

    const repoName = appRepoPath.slice(appRepoPath.lastIndexOf('/') + 1);
    const apps = [
      {
        name: 'fixture-app',
        org: 'edificeio',
        repo: repoName,
        branches: ['develop'],
      },
    ];

    const index = buildLocalIndex(apps, {
      repoRoot: ffRepoRoot,
      ffPackages: [{ packageDirName: 'fixture-pkg' }],
      ffEntryMap: FIXTURE_ENTRY_MAP,
      bootstrapSrcDir: join(ffRepoRoot, 'bootstrap-src'),
    });

    expect(index.cssComponents).toHaveLength(1);
    expect(index.cssComponents[0]).toMatchObject({
      file: 'components/_button.scss',
      reactPeer: 'Button',
      selectors: ['button', 'button-primary'],
    });
  });
});
