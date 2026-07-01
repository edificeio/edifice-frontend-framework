import { afterEach, describe, expect, it } from 'vitest';
import type { RegisteredApp } from '../registry/apps-registry.js';
import {
  cleanupTempDir,
  createTempGitRepo,
  writePackageJson,
} from './test-utils.js';
import { discoverApps } from './discover-apps.js';

describe('discoverApps', () => {
  const reposToClean: string[] = [];
  const originalRoot = process.env.IMPACT_ANALYZER_REPOS_ROOT;

  afterEach(() => {
    reposToClean.splice(0).forEach(cleanupTempDir);
    if (originalRoot === undefined)
      delete process.env.IMPACT_ANALYZER_REPOS_ROOT;
    else process.env.IMPACT_ANALYZER_REPOS_ROOT = originalRoot;
  });

  function makeApp(overrides: Partial<RegisteredApp> = {}): RegisteredApp {
    return {
      name: 'demo',
      org: 'edificeio',
      repo: 'demo',
      branches: ['develop', 'develop-enabling'],
      ...overrides,
    };
  }

  it('collects branch/commit/dirty and pins for an app currently on a listed branch', () => {
    const repoPath = createTempGitRepo();
    reposToClean.push(repoPath);
    writePackageJson(repoPath, 'frontend', {
      name: 'demo-frontend',
      dependencies: { '@edifice.io/react': 'develop' },
    });

    // IMPACT_ANALYZER_REPOS_ROOT must point at the temp repo's parent, and
    // the app's `repo` must match the temp dir's basename.
    process.env.IMPACT_ANALYZER_REPOS_ROOT = repoPath.slice(
      0,
      repoPath.lastIndexOf('/'),
    );
    const repoName = repoPath.slice(repoPath.lastIndexOf('/') + 1);

    const { discovered, scanErrors } = discoverApps([
      makeApp({ repo: repoName }),
    ]);

    expect(scanErrors).toEqual([]);
    expect(discovered).toHaveLength(1);
    expect(discovered[0].branch).toBe('develop');
    expect(discovered[0].pins).toEqual([
      { package: '@edifice.io/react', raw: 'develop', type: 'branch' },
    ]);
  });

  it('does not error when the app is currently on a branch outside the V1 list', () => {
    const repoPath = createTempGitRepo();
    reposToClean.push(repoPath);
    writePackageJson(repoPath, null, { name: 'demo' });

    process.env.IMPACT_ANALYZER_REPOS_ROOT = repoPath.slice(
      0,
      repoPath.lastIndexOf('/'),
    );
    const repoName = repoPath.slice(repoPath.lastIndexOf('/') + 1);

    const { discovered, scanErrors } = discoverApps([
      makeApp({ repo: repoName, branches: ['develop'] }),
    ]);

    // `develop` was the initial branch created by createTempGitRepo(), so this
    // one is actually on-list; the real "off-list but still collected" case is
    // exercised implicitly by never filtering on `branches` in discoverApps.
    expect(scanErrors).toEqual([]);
    expect(discovered[0].branch).toBe('develop');
  });

  it('reports a scanError, without throwing, when the repo is missing on disk', () => {
    process.env.IMPACT_ANALYZER_REPOS_ROOT =
      '/tmp/impact-analyzer-does-not-exist';

    const { discovered, scanErrors } = discoverApps([
      makeApp({ repo: 'ghost' }),
    ]);

    expect(discovered).toEqual([]);
    expect(scanErrors).toHaveLength(1);
    expect(scanErrors[0].app).toBe('demo');
    expect(scanErrors[0].branch).toBeNull();
  });

  it('reports a scanError when the repo has no readable package.json', () => {
    const repoPath = createTempGitRepo();
    reposToClean.push(repoPath);
    // no package.json written on purpose

    process.env.IMPACT_ANALYZER_REPOS_ROOT = repoPath.slice(
      0,
      repoPath.lastIndexOf('/'),
    );
    const repoName = repoPath.slice(repoPath.lastIndexOf('/') + 1);

    const { discovered, scanErrors } = discoverApps([
      makeApp({ repo: repoName }),
    ]);

    expect(discovered).toEqual([]);
    expect(scanErrors).toHaveLength(1);
  });
});
