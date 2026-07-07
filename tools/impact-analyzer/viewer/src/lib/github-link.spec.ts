// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { githubBlobUrl, githubPrFileAnchorUrl } from './github-link.js';

describe('githubBlobUrl', () => {
  const ref = {
    app: 'blog',
    org: 'edificeio',
    repo: 'blog',
    appCommit: 'ea8985b099661bba108948f1d6e62aee99f0fc1a',
  };

  it('builds a SHA-pinned blob URL from a repo-relative path', () => {
    expect(githubBlobUrl(ref, 'frontend/src/features/Post/PostDate.tsx')).toBe(
      'https://github.com/edificeio/blog/blob/ea8985b099661bba108948f1d6e62aee99f0fc1a/frontend/src/features/Post/PostDate.tsx',
    );
  });

  it('falls back to the app name when repo is absent', () => {
    expect(githubBlobUrl({ ...ref, repo: undefined }, 'src/a.tsx')).toContain(
      '/edificeio/blog/blob/',
    );
  });

  it('returns null for pre-normalization absolute paths', () => {
    expect(githubBlobUrl(ref, '/tmp/clone-x/frontend/src/a.tsx')).toBeNull();
  });

  it('returns null when org or commit is missing (carried-forward entry)', () => {
    expect(githubBlobUrl({ app: 'blog' }, 'src/a.tsx')).toBeNull();
    expect(
      githubBlobUrl({ ...ref, appCommit: undefined }, 'src/a.tsx'),
    ).toBeNull();
  });

  it('URL-encodes unusual path segments without encoding the separators', () => {
    expect(githubBlobUrl(ref, 'src/dossier avec espace/a.tsx')).toBe(
      `https://github.com/edificeio/blog/blob/${ref.appCommit}/src/dossier%20avec%20espace/a.tsx`,
    );
  });
});

describe('githubPrFileAnchorUrl', () => {
  it('anchors the PR Files tab at sha256 of the repo-relative path', async () => {
    // Known vector, verified against the live HTML of a real PR files page:
    // sha256('tools/impact-analyzer/src/cli.ts').
    await expect(
      githubPrFileAnchorUrl(
        'https://github.com/edificeio/edifice-frontend-framework/pull/526',
        'tools/impact-analyzer/src/cli.ts',
      ),
    ).resolves.toBe(
      'https://github.com/edificeio/edifice-frontend-framework/pull/526/files#diff-f8ff221dda84bc04e9522a1d0de9c80b6a86be87c7dc55e9934c035f60f548f0',
    );
  });

  it('returns null for pre-normalization absolute paths', async () => {
    await expect(
      githubPrFileAnchorUrl('https://github.com/o/r/pull/1', '/tmp/x.ts'),
    ).resolves.toBeNull();
  });
});
