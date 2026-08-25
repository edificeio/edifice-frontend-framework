import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { SleepLike } from './github-client.js';

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
  /** Injectable for tests — defaults to a real timer-based delay, used between fetch retries. */
  sleepImpl?: SleepLike;
}

// A hung fetch (dead network, unresponsive remote) must not block the whole
// CI run indefinitely — each git invocation gets its own bounded timeout.
const GIT_TIMEOUT_MS = 60_000;

// Observed in production (impact-analyzer-data scanErrors): repeated,
// transient `git fetch` failures — plain timeouts and mid-stream 5xx from
// the git smart-HTTP backend (e.g. "503 ... expected 'packfile'") — always
// on the same handful of large/slow repos. By the time this function runs,
// the branch's existence was already confirmed via the GitHub API
// (discover-apps-remote.ts resolves its head SHA first), so a fetch failure
// here is presumed transient rather than "branch doesn't exist" — safe to
// retry unconditionally. Same policy as github-client.ts for consistency.
const MAX_FETCH_ATTEMPTS = 4;
const BASE_RETRY_DELAY_MS = 500;

function defaultSleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
 * Retries only the network `fetch` step — init/sparse-checkout config are
 * local and deterministic, retrying them can't turn a failure into a
 * success. Backs off exponentially between attempts (same schedule as
 * github-client.ts) and rethrows the last error verbatim for the caller to
 * sanitize/classify.
 */
async function fetchWithRetry(
  repoPath: string,
  authHeader: string,
  branch: string,
  sleepImpl: SleepLike,
): Promise<void> {
  for (let attempt = 0; ; attempt++) {
    try {
      git(
        repoPath,
        '-c',
        `http.extraheader=${authHeader}`,
        'fetch',
        '--depth=1',
        'origin',
        branch,
      );
      return;
    } catch (error) {
      if (attempt + 1 >= MAX_FETCH_ATTEMPTS) throw error;
      await sleepImpl(BASE_RETRY_DELAY_MS * 2 ** attempt);
    }
  }
}

/**
 * Clones only `sparsePath` at `branch`, depth 1, into a disposable temp
 * dir. Auth is passed via `-c http.extraheader` on the fetch command only
 * — never embedded in the remote URL, so it never leaks into `git remote
 * -v` or the repo's stored config (verified by spike). Caller MUST call
 * `cleanupClone` in a `finally`.
 */
export async function cloneTargetSparse(
  options: CloneTargetOptions,
): Promise<ClonedRepo> {
  const { org, repo, branch, token, sparsePath } = options;
  const sleepImpl = options.sleepImpl ?? defaultSleep;
  const remoteUrl =
    options.remoteUrl ?? `https://github.com/${org}/${repo}.git`;
  const repoPath = mkdtempSync(join(tmpdir(), 'impact-analyzer-clone-'));

  try {
    git(repoPath, 'init', '-q');
    git(repoPath, 'remote', 'add', 'origin', remoteUrl);
    git(repoPath, 'sparse-checkout', 'init', '--cone');
    git(repoPath, 'sparse-checkout', 'set', sparsePath);

    const authHeader = `AUTHORIZATION: basic ${Buffer.from(`x-access-token:${token}`).toString('base64')}`;
    await fetchWithRetry(repoPath, authHeader, branch, sleepImpl);
    git(repoPath, 'checkout', '-q', 'FETCH_HEAD');
  } catch (error) {
    rmSync(repoPath, { recursive: true, force: true });
    // Never surface the raw command/header in the error — only a sanitized
    // stderr (the auth header/token must never be logged) or a timeout marker.
    const detail = isTimedOut(error)
      ? `timed out after ${GIT_TIMEOUT_MS}ms`
      : (sanitizeGitStderr(error, token) ?? 'see logs for detail');
    throw new Error(
      `git fetch failed for ${org}/${repo}#${branch} after ${MAX_FETCH_ATTEMPTS} attempts: ${detail}`,
    );
  }

  return { repoPath };
}

export function cleanupClone(cloned: ClonedRepo): void {
  rmSync(cloned.repoPath, { recursive: true, force: true });
}
