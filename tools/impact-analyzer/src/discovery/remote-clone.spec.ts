import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanupTempDir, commitFile, createTempGitRepo } from './test-utils.js';
import { cleanupClone, cloneTargetSparse } from './remote-clone.js';

// No real delay in tests — retry timing itself is covered by the dedicated
// 'retry/backoff' suite below via a spied sleepImpl.
const noSleep = () => Promise.resolve();

function git(repoPath: string, ...args: string[]): string {
  return execFileSync('git', ['-C', repoPath, ...args], {
    encoding: 'utf-8',
  }).trim();
}

describe('cloneTargetSparse / cleanupClone', () => {
  let sourceRepo: string;
  let cloneRepoPath: string | undefined;

  afterEach(() => {
    if (sourceRepo) cleanupTempDir(sourceRepo);
    if (cloneRepoPath) cleanupTempDir(cloneRepoPath);
  });

  it('materializes only the sparse path, with the content of the requested branch', async () => {
    sourceRepo = createTempGitRepo();
    commitFile(sourceRepo, 'frontend/src/wanted.txt', 'wanted', 'base');
    commitFile(sourceRepo, 'other-dir/unwanted.txt', 'unwanted', 'unrelated');
    git(sourceRepo, 'checkout', '-b', 'feature');
    commitFile(
      sourceRepo,
      'frontend/src/wanted.txt',
      'feature-content',
      'feature change',
    );
    git(sourceRepo, 'checkout', 'develop');

    const cloned = await cloneTargetSparse({
      org: 'org',
      repo: 'repo',
      branch: 'develop',
      token: 'fake-token',
      sparsePath: 'frontend/src',
      remoteUrl: `file://${sourceRepo}`,
    });
    cloneRepoPath = cloned.repoPath;

    expect(existsSync(join(cloned.repoPath, 'frontend/src/wanted.txt'))).toBe(
      true,
    );
    expect(
      readFileSync(join(cloned.repoPath, 'frontend/src/wanted.txt'), 'utf-8'),
    ).toBe('wanted');
    expect(existsSync(join(cloned.repoPath, 'other-dir'))).toBe(false);
  });

  it('checks out the requested branch, not another one in the same repo', async () => {
    sourceRepo = createTempGitRepo();
    commitFile(sourceRepo, 'frontend/src/a.txt', 'develop-content', 'base');
    git(sourceRepo, 'checkout', '-b', 'other-branch');
    commitFile(sourceRepo, 'frontend/src/a.txt', 'other-content', 'other');
    git(sourceRepo, 'checkout', 'develop');

    const cloned = await cloneTargetSparse({
      org: 'org',
      repo: 'repo',
      branch: 'other-branch',
      token: 'tok',
      sparsePath: 'frontend/src',
      remoteUrl: `file://${sourceRepo}`,
    });
    cloneRepoPath = cloned.repoPath;

    expect(
      readFileSync(join(cloned.repoPath, 'frontend/src/a.txt'), 'utf-8'),
    ).toBe('other-content');
  });

  it('cleanupClone removes the temp directory entirely', async () => {
    sourceRepo = createTempGitRepo();
    commitFile(sourceRepo, 'frontend/src/a.txt', 'x', 'base');

    const cloned = await cloneTargetSparse({
      org: 'org',
      repo: 'repo',
      branch: 'develop',
      token: 'tok',
      sparsePath: 'frontend/src',
      remoteUrl: `file://${sourceRepo}`,
    });
    cleanupClone(cloned);
    expect(existsSync(cloned.repoPath)).toBe(false);
  });

  it('never exposes the token via git remote -v or the stored remote URL', async () => {
    sourceRepo = createTempGitRepo();
    commitFile(sourceRepo, 'frontend/src/a.txt', 'x', 'base');

    const cloned = await cloneTargetSparse({
      org: 'org',
      repo: 'repo',
      branch: 'develop',
      token: 'super-secret-fake-token',
      sparsePath: 'frontend/src',
      remoteUrl: `file://${sourceRepo}`,
    });
    cloneRepoPath = cloned.repoPath;

    const remoteV = git(cloned.repoPath, 'remote', '-v');
    const remoteUrl = git(
      cloned.repoPath,
      'config',
      '--get',
      'remote.origin.url',
    );
    expect(remoteV).not.toContain('super-secret-fake-token');
    expect(remoteUrl).not.toContain('super-secret-fake-token');
  });

  it('throws a generic error (never the raw command) when the remote is invalid', async () => {
    await expect(
      cloneTargetSparse({
        org: 'org',
        repo: 'repo',
        branch: 'develop',
        token: 'tok',
        sparsePath: 'frontend/src',
        remoteUrl: 'file:///nonexistent/path/xyz',
        sleepImpl: noSleep,
      }),
    ).rejects.toThrow('git fetch failed for org/repo#develop');
  });

  it('includes sanitized stderr detail in the error without leaking the token', async () => {
    let thrown: unknown;
    try {
      await cloneTargetSparse({
        org: 'org',
        repo: 'repo',
        branch: 'develop',
        token: 'super-secret-fake-token',
        sparsePath: 'frontend/src',
        remoteUrl: 'file:///nonexistent/path/xyz',
        sleepImpl: noSleep,
      });
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBeInstanceOf(Error);
    const message = (thrown as Error).message;
    expect(message).toContain('git fetch failed for org/repo#develop');
    expect(message).not.toContain('super-secret-fake-token');
    expect(message).not.toContain('http.extraheader');
    // A real git stderr snippet should be appended beyond the bare prefix.
    expect(message.length).toBeGreaterThan(
      'git fetch failed for org/repo#develop after '.length,
    );
  });

  describe('retry/backoff on fetch', () => {
    it('gives up after the max attempts, backing off exponentially between tries', async () => {
      const sleepImpl = vi.fn().mockResolvedValue(undefined);

      await expect(
        cloneTargetSparse({
          org: 'org',
          repo: 'repo',
          branch: 'develop',
          token: 'tok',
          sparsePath: 'frontend/src',
          remoteUrl: 'file:///nonexistent/path/xyz',
          sleepImpl,
        }),
      ).rejects.toThrow(
        'git fetch failed for org/repo#develop after 4 attempts',
      );

      expect(sleepImpl).toHaveBeenCalledTimes(3); // 1 initial + 3 retries
      expect(sleepImpl).toHaveBeenNthCalledWith(1, 500);
      expect(sleepImpl).toHaveBeenNthCalledWith(2, 1000);
      expect(sleepImpl).toHaveBeenNthCalledWith(3, 2000);
    });
  });
});
