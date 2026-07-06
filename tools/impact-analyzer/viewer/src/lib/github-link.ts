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
