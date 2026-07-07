/** The subset of consumer fields needed to build a GitHub permalink. */
export interface GithubFileRef {
  app: string;
  org?: string;
  repo?: string;
  appCommit?: string;
}

/**
 * Permalink to the exact code that was scanned: SHA-pinned blob URL, immune
 * to later commits on the app branch. Returns null when the entry can't be
 * linked — data carried forward from a pre-normalization index (absolute
 * path, or missing org/commit); callers then render plain text instead.
 */
export function githubBlobUrl(ref: GithubFileRef, file: string): string | null {
  if (!ref.org || !ref.appCommit) return null;
  if (file.startsWith('/')) return null;
  const repo = ref.repo ?? ref.app;
  const path = file.split('/').map(encodeURIComponent).join('/');
  return `https://github.com/${ref.org}/${repo}/blob/${ref.appCommit}/${path}`;
}

/** GitHub's "Files changed" tab anchors each file at #diff-<sha256 of its repo-relative path>. */
export async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(text),
  );
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Deep link to one file inside a PR's "Files changed" tab — the exact spot
 * that triggered a symbol's diff entry. `file` must be a repo-relative path
 * (pre-normalization absolute paths are not linkable).
 */
export async function githubPrFileAnchorUrl(
  prUrl: string,
  file: string,
): Promise<string | null> {
  if (file.startsWith('/')) return null;
  return `${prUrl}/files#diff-${await sha256Hex(file)}`;
}
