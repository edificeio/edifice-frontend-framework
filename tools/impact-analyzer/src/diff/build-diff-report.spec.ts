import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  cleanupTempDir,
  createTempGitRepo,
  writePackageJson,
} from '../discovery/test-utils.js';
import { buildCiIndex } from '../index-builder/build-ci-index.js';
import { buildDiffReport } from './build-diff-report.js';

vi.mock('../index-builder/build-ci-index.js', () => ({
  buildCiIndex: vi.fn(),
}));

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

function gitCommitAll(repoPath: string, message: string): string {
  execFileSync('git', ['-C', repoPath, 'add', '-A']);
  execFileSync('git', ['-C', repoPath, 'commit', '-m', message]);
  return execFileSync('git', ['-C', repoPath, 'rev-parse', 'HEAD'], {
    encoding: 'utf-8',
  }).trim();
}

describe('buildDiffReport', () => {
  let ffRepoRoot: string;
  let appRepoPath: string;
  const originalReposRoot = process.env.IMPACT_ANALYZER_REPOS_ROOT;

  beforeEach(() => {
    ffRepoRoot = createTempGitRepo();
    mkdirSync(join(ffRepoRoot, 'packages'), { recursive: true });
    cpSync(ffFixtureDir, join(ffRepoRoot, 'packages', 'fixture-pkg'), {
      recursive: true,
    });
    gitCommitAll(ffRepoRoot, 'base: initial Button');

    appRepoPath = createTempGitRepo();
    writePackageJson(appRepoPath, 'frontend', {
      name: 'fixture-app-frontend',
      dependencies: { '@edifice.io/fixture': 'develop' },
    });
    mkdirSync(join(appRepoPath, 'frontend', 'src'), { recursive: true });
    writeFileSync(
      join(appRepoPath, 'frontend', 'tsconfig.json'),
      JSON.stringify(APP_TSCONFIG),
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

  it('reports a signature change on Button with consumers/riskScore from the head index', async () => {
    const baseCommit = execFileSync(
      'git',
      ['-C', ffRepoRoot, 'rev-parse', 'HEAD'],
      {
        encoding: 'utf-8',
      },
    ).trim();

    // Head: add a parameter to Button.
    writeFileSync(
      join(
        ffRepoRoot,
        'packages',
        'fixture-pkg',
        'src',
        'components',
        'Button.tsx',
      ),
      'export function Button(extra: boolean) {\n  return <button>Click</button>;\n}\n',
    );
    gitCommitAll(ffRepoRoot, 'head: add extra param to Button');

    const repoName = appRepoPath.slice(appRepoPath.lastIndexOf('/') + 1);
    const apps = [
      {
        name: 'fixture-app',
        org: 'edificeio',
        repo: repoName,
        branches: ['develop'],
      },
    ];

    const report = await buildDiffReport(baseCommit, apps, {
      repoRoot: ffRepoRoot,
      ffPackages: [{ packageDirName: 'fixture-pkg' }],
      ffEntryMap: FIXTURE_ENTRY_MAP,
    });

    expect(report.schemaVersion).toBe(1);
    expect(report.base.commit).toBe(baseCommit);

    const buttonDiff = report.symbolDiffs.find((d) => d.name === 'Button');
    expect(buttonDiff).toMatchObject({
      changeKind: 'signature-changed',
      severity: 'likely-breaking',
    });
    expect(buttonDiff?.consumers).toEqual([
      { app: 'fixture-app', appBranch: 'develop', usageSites: 1 },
    ]);
    expect(buttonDiff?.riskScore).toBe(10 * (1 + 1) * (1 + 1));
  });

  it('sorts symbolDiffs by riskScore descending across mixed severities', async () => {
    const baseCommit = execFileSync(
      'git',
      ['-C', ffRepoRoot, 'rev-parse', 'HEAD'],
      {
        encoding: 'utf-8',
      },
    ).trim();

    // Head: remove `Thing` (renamed export, "removed"->breaking) and
    // change Button's body only (needs-review).
    writeFileSync(
      join(ffRepoRoot, 'packages', 'fixture-pkg', 'src', 'index.ts'),
      `export * from './components';\n`,
    );
    writeFileSync(
      join(
        ffRepoRoot,
        'packages',
        'fixture-pkg',
        'src',
        'components',
        'Button.tsx',
      ),
      'export function Button() {\n  return <button>Click me</button>;\n}\n',
    );
    gitCommitAll(
      ffRepoRoot,
      'head: remove RenamedThing export, tweak Button body',
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

    const report = await buildDiffReport(baseCommit, apps, {
      repoRoot: ffRepoRoot,
      ffPackages: [{ packageDirName: 'fixture-pkg' }],
      ffEntryMap: FIXTURE_ENTRY_MAP,
    });

    const names = report.symbolDiffs.map((d) => d.name);
    expect(names.indexOf('RenamedThing')).toBeLessThan(names.indexOf('Button'));
    expect(
      report.symbolDiffs.find((d) => d.name === 'RenamedThing')?.severity,
    ).toBe('breaking');
    expect(report.symbolDiffs.find((d) => d.name === 'Button')?.severity).toBe(
      'needs-review',
    );
  });

  it('uses buildCiIndex for head discovery when mode is "ci", instead of local sibling repos', async () => {
    const baseCommit = execFileSync(
      'git',
      ['-C', ffRepoRoot, 'rev-parse', 'HEAD'],
      { encoding: 'utf-8' },
    ).trim();

    vi.mocked(buildCiIndex).mockResolvedValue({
      schemaVersion: 1,
      generatedAt: '2026-07-02T00:00:00.000Z',
      mode: 'ci',
      ffBranch: 'feat-x',
      ffCommit: 'deadbeef',
      ffDirty: false,
      packages: [],
      scanErrors: [],
      symbols: [],
      outOfContractImports: [],
      cssComponents: [],
      cssGlobalRisks: [],
      appStates: [],
    });

    const report = await buildDiffReport(baseCommit, [], {
      repoRoot: ffRepoRoot,
      ffPackages: [{ packageDirName: 'fixture-pkg' }],
      ffEntryMap: FIXTURE_ENTRY_MAP,
      mode: 'ci',
    });

    expect(buildCiIndex).toHaveBeenCalledTimes(1);
    expect(report.head.commit).toBe('deadbeef');
  });
});
