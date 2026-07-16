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

// A hung fetch (dead network, unresponsive remote) must not block the whole
// CI run indefinitely — each git invocation gets its own bounded timeout.
const GIT_TIMEOUT_MS = 60_000;

function git(repoPath: string, ...args: string[]): void {
  execFileSync('git', ['-C', repoPath, ...args], {
    stdio: 'pipe',
    timeout: GIT_TIMEOUT_MS,
  });
}

function isTimedOut(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'signal' in error &&
    (error as { signal?: string | null }).signal != null
  );
}

/**
 * Extracts git's own stderr for diagnosis (a network failure and a missing
 * branch currently produce the same opaque message otherwise), stripped of
 * anything that could carry the auth header or the raw token.
 */
function sanitizeGitStderr(error: unknown, token: string): string | undefined {
  if (!(error && typeof error === 'object' && 'stderr' in error))
    return undefined;
  const raw = String(
    (error as { stderr?: Buffer | string }).stderr ?? '',
  ).trim();
  if (!raw) return undefined;
  return raw
    .split('\n')
    .filter((line) => !line.includes('http.extraheader'))
    .join('\n')
    .split(token)
    .join('[redacted]')
    .trim();
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
  } catch (error) {
    rmSync(repoPath, { recursive: true, force: true });
    // Never surface the raw command/header in the error — only a sanitized
    // stderr (the auth header/token must never be logged) or a timeout marker.
    const detail = isTimedOut(error)
      ? `timed out after ${GIT_TIMEOUT_MS}ms`
      : (sanitizeGitStderr(error, token) ?? 'see logs for detail');
    throw new Error(`git fetch failed for ${org}/${repo}#${branch}: ${detail}`);
  }

  return { repoPath };
}

export function cleanupClone(cloned: ClonedRepo): void {
  rmSync(cloned.repoPath, { recursive: true, force: true });
}
