export type FetchLike = typeof fetch;
export type SleepLike = (ms: number) => Promise<void>;

export interface GithubClientOptions {
  /** Injectable for tests — defaults to the global fetch. Never a real network call in the test suite. */
  fetchImpl?: FetchLike;
  /** Override for tests — defaults to the real GitHub API. */
  baseUrl?: string;
  /** Injectable for tests — defaults to a real timer-based delay, used between retries. */
  sleepImpl?: SleepLike;
}

const DEFAULT_BASE_URL = 'https://api.github.com';

// 1 initial attempt + up to 3 retries — enough to ride out a transient 5xx
// or a short secondary rate-limit window without turning a real outage into
// a very long hang.
const MAX_ATTEMPTS = 4;
const BASE_RETRY_DELAY_MS = 500;

export class GithubApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly url: string,
    public readonly rateLimited: boolean = false,
  ) {
    super(message);
  }
}

function resolve(options: GithubClientOptions | undefined) {
  return {
    fetchImpl: options?.fetchImpl ?? fetch,
    baseUrl: options?.baseUrl ?? DEFAULT_BASE_URL,
    sleepImpl:
      options?.sleepImpl ??
      ((ms: number) => new Promise<void>((r) => setTimeout(r, ms))),
  };
}

function encodePath(path: string): string {
  return path.split('/').map(encodeURIComponent).join('/');
}

// GitHub reuses HTTP 403 for both "forbidden" and secondary rate limits —
// the only way to tell them apart is these headers (429 is unambiguous).
function isRateLimited(res: Response): boolean {
  if (res.status === 429) return true;
  if (res.status === 403) {
    return (
      res.headers.get('x-ratelimit-remaining') === '0' ||
      res.headers.has('retry-after')
    );
  }
  return false;
}

function isRetryable(res: Response): boolean {
  return res.status >= 500 || isRateLimited(res);
}

function retryDelayMs(res: Response, attempt: number): number {
  const retryAfter = Number(res.headers.get('retry-after'));
  if (Number.isFinite(retryAfter) && retryAfter > 0) return retryAfter * 1000;
  return BASE_RETRY_DELAY_MS * 2 ** attempt;
}

async function githubGet(
  url: string,
  token: string,
  fetchImpl: FetchLike,
  sleepImpl: SleepLike,
): Promise<unknown | undefined> {
  let res: Response;
  for (let attempt = 0; ; attempt++) {
    res = await fetchImpl(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
    });

    if (res.status === 404) return undefined;
    if (res.ok) return res.json();
    if (attempt + 1 >= MAX_ATTEMPTS || !isRetryable(res)) break;

    await sleepImpl(retryDelayMs(res, attempt));
  }

  const body = await res.text().catch(() => '');
  const rateLimited = isRateLimited(res);
  // Never include the token here — only the URL (which never carries it) and the response body.
  throw new GithubApiError(
    `GitHub API request failed (${res.status}${rateLimited ? ', rate limited' : ''}): ${body}`,
    res.status,
    url,
    rateLimited,
  );
}

/**
 * Reads a file's content at a given ref via the GitHub Contents API.
 * Returns undefined on 404 (file or branch doesn't exist) — that's an
 * expected outcome for this tool, not an error (plan §4: "sauter
 * silencieusement" for a branch an app doesn't have).
 */
export async function fetchFileContent(
  org: string,
  repo: string,
  path: string,
  ref: string,
  token: string,
  options?: GithubClientOptions,
): Promise<string | undefined> {
  const { fetchImpl, baseUrl, sleepImpl } = resolve(options);
  const url = `${baseUrl}/repos/${encodeURIComponent(org)}/${encodeURIComponent(repo)}/contents/${encodePath(path)}?ref=${encodeURIComponent(ref)}`;

  const json = await githubGet(url, token, fetchImpl, sleepImpl);
  if (json === undefined) return undefined;

  const { content } = json as { content: string };
  return Buffer.from(content, 'base64').toString('utf-8');
}

export interface BranchHead {
  sha: string;
}

/** Returns undefined when the branch doesn't exist (404) — not an error. */
export async function fetchBranchHead(
  org: string,
  repo: string,
  branch: string,
  token: string,
  options?: GithubClientOptions,
): Promise<BranchHead | undefined> {
  const { fetchImpl, baseUrl, sleepImpl } = resolve(options);
  const url = `${baseUrl}/repos/${encodeURIComponent(org)}/${encodeURIComponent(repo)}/branches/${encodeURIComponent(branch)}`;

  const json = await githubGet(url, token, fetchImpl, sleepImpl);
  if (json === undefined) return undefined;

  const { commit } = json as { commit: { sha: string } };
  return { sha: commit.sha };
}
