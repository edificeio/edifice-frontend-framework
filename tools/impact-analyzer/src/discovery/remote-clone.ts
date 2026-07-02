import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export interface ClonedRepo {
  repoPath: string;
}

export interface CloneTargetOptions {
  org: string;
  repo: string;
  branch: string;
  token: string;
  /** Sparse-checkout subpath, e.g. "frontend/src" — resolved upstream by discover-apps-remote.ts. */
  sparsePath: string;
  /** Override for tests (a local file:// remote) — defaults to the real GitHub URL. */
  remoteUrl?: string;
}

function git(repoPath: string, ...args: string[]): void {
  execFileSync('git', ['-C', repoPath, ...args], { stdio: 'pipe' });
}

/**
 * Clones only `sparsePath` at `branch`, depth 1, into a disposable temp
 * dir. Auth is passed via `-c http.extraheader` on the fetch command only
 * — never embedded in the remote URL, so it never leaks into `git remote
 * -v` or the repo's stored config (verified by spike). Caller MUST call
 * `cleanupClone` in a `finally`.
 */
export function cloneTargetSparse(options: CloneTargetOptions): ClonedRepo {
  const { org, repo, branch, token, sparsePath } = options;
  const remoteUrl =
    options.remoteUrl ?? `https://github.com/${org}/${repo}.git`;
  const repoPath = mkdtempSync(join(tmpdir(), 'impact-analyzer-clone-'));

  try {
    git(repoPath, 'init', '-q');
    git(repoPath, 'remote', 'add', 'origin', remoteUrl);
    git(repoPath, 'sparse-checkout', 'init', '--cone');
    git(repoPath, 'sparse-checkout', 'set', sparsePath);

    const authHeader = `AUTHORIZATION: basic ${Buffer.from(`x-access-token:${token}`).toString('base64')}`;
    git(
      repoPath,
      '-c',
      `http.extraheader=${authHeader}`,
      'fetch',
      '--depth=1',
      'origin',
      branch,
    );
    git(repoPath, 'checkout', '-q', 'FETCH_HEAD');
  } catch {
    rmSync(repoPath, { recursive: true, force: true });
    // Never surface the raw command/header in the error — only a generic,
    // context-bearing message (the auth header must never be logged).
    throw new Error(`git fetch failed for ${org}/${repo}#${branch}`);
  }

  return { repoPath };
}

export function cleanupClone(cloned: ClonedRepo): void {
  rmSync(cloned.repoPath, { recursive: true, force: true });
}
