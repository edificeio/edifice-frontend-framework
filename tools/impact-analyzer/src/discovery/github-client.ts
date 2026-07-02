export type FetchLike = typeof fetch;

export interface GithubClientOptions {
  /** Injectable for tests — defaults to the global fetch. Never a real network call in the test suite. */
  fetchImpl?: FetchLike;
  /** Override for tests — defaults to the real GitHub API. */
  baseUrl?: string;
}

const DEFAULT_BASE_URL = 'https://api.github.com';

export class GithubApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly url: string,
  ) {
    super(message);
  }
}

function resolve(options: GithubClientOptions | undefined) {
  return {
    fetchImpl: options?.fetchImpl ?? fetch,
    baseUrl: options?.baseUrl ?? DEFAULT_BASE_URL,
  };
}

function encodePath(path: string): string {
  return path.split('/').map(encodeURIComponent).join('/');
}

async function githubGet(
  url: string,
  token: string,
  fetchImpl: FetchLike,
): Promise<unknown | undefined> {
  const res = await fetchImpl(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
  });

  if (res.status === 404) return undefined;
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    // Never include the token here — only the URL (which never carries it) and the response body.
    throw new GithubApiError(
      `GitHub API request failed (${res.status}): ${body}`,
      res.status,
      url,
    );
  }
  return res.json();
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
  const { fetchImpl, baseUrl } = resolve(options);
  const url = `${baseUrl}/repos/${encodeURIComponent(org)}/${encodeURIComponent(repo)}/contents/${encodePath(path)}?ref=${encodeURIComponent(ref)}`;

  const json = await githubGet(url, token, fetchImpl);
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
  const { fetchImpl, baseUrl } = resolve(options);
  const url = `${baseUrl}/repos/${encodeURIComponent(org)}/${encodeURIComponent(repo)}/branches/${encodeURIComponent(branch)}`;

  const json = await githubGet(url, token, fetchImpl);
  if (json === undefined) return undefined;

  const { commit } = json as { commit: { sha: string } };
  return { sha: commit.sha };
}
