import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanupTempDir, createTempGitRepo } from './test-utils.js';
import {
  readRepoState,
  RepoNotFoundError,
  reposRoot,
  resolveRepoPath,
} from './local-repo-resolver.js';

describe('reposRoot / resolveRepoPath', () => {
  const original = process.env.IMPACT_ANALYZER_REPOS_ROOT;

  afterEach(() => {
    if (original === undefined) delete process.env.IMPACT_ANALYZER_REPOS_ROOT;
    else process.env.IMPACT_ANALYZER_REPOS_ROOT = original;
  });

  it('defaults to /Volumes/Work', () => {
    delete process.env.IMPACT_ANALYZER_REPOS_ROOT;
    expect(reposRoot()).toBe('/Volumes/Work');
    expect(resolveRepoPath('communities')).toBe('/Volumes/Work/communities');
  });

  it('honors IMPACT_ANALYZER_REPOS_ROOT', () => {
    process.env.IMPACT_ANALYZER_REPOS_ROOT = '/tmp/repos';
    expect(reposRoot()).toBe('/tmp/repos');
    expect(resolveRepoPath('communities')).toBe('/tmp/repos/communities');
  });
});

describe('readRepoState', () => {
  let repoPath: string;

  beforeEach(() => {
    repoPath = createTempGitRepo();
  });

  afterEach(() => {
    cleanupTempDir(repoPath);
  });

  it('reads the currently checked-out branch and commit, clean tree', () => {
    const state = readRepoState(repoPath);
    expect(state.branch).toBe('develop');
    expect(state.commit).toMatch(/^[0-9a-f]{40}$/);
    expect(state.dirty).toBe(false);
  });

  it('reports dirty when there are uncommitted changes', () => {
    writeFileSync(join(repoPath, 'untracked.txt'), 'hello');
    const state = readRepoState(repoPath);
    expect(state.dirty).toBe(true);
  });

  it('reflects whatever branch is checked out, without switching it itself', () => {
    execFileSync('git', ['-C', repoPath, 'checkout', '-b', 'feat-something']);
    const state = readRepoState(repoPath);
    expect(state.branch).toBe('feat-something');
  });

  it('throws RepoNotFoundError when the path is not a git repo', () => {
    expect(() => readRepoState('/nonexistent/path/xyz')).toThrow(
      RepoNotFoundError,
    );
  });
});
