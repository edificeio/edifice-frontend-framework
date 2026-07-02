import { describe, expect, it, vi } from 'vitest';
import {
  fetchBranchHead,
  fetchFileContent,
  GithubApiError,
} from './github-client.js';

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status });
}

describe('fetchFileContent', () => {
  it('decodes base64 content on 200', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse(200, {
        content: Buffer.from('hello world').toString('base64'),
      }),
    );

    const content = await fetchFileContent(
      'org',
      'repo',
      'a/b.json',
      'develop',
      'tok',
      {
        fetchImpl,
      },
    );
    expect(content).toBe('hello world');
  });

  it('returns undefined on 404', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 404 }));
    const content = await fetchFileContent(
      'org',
      'repo',
      'missing.json',
      'develop',
      'tok',
      {
        fetchImpl,
      },
    );
    expect(content).toBeUndefined();
  });

  it('throws GithubApiError on a non-2xx, non-404 status, without leaking the token', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(new Response('rate limit exceeded', { status: 403 }));

    await expect(
      fetchFileContent('org', 'repo', 'a.json', 'develop', 'secret-token-xyz', {
        fetchImpl,
      }),
    ).rejects.toSatisfy((error: unknown) => {
      expect(error).toBeInstanceOf(GithubApiError);
      const apiError = error as GithubApiError;
      expect(apiError.status).toBe(403);
      expect(apiError.message).not.toContain('secret-token-xyz');
      expect(apiError.message).toContain('rate limit exceeded');
      return true;
    });
  });

  it('builds the URL with org/repo/path encoded and the ref as a query param', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(
        jsonResponse(200, { content: Buffer.from('x').toString('base64') }),
      );

    await fetchFileContent(
      'my-org',
      'my-repo',
      'frontend/package.json',
      'develop-enabling',
      'tok',
      {
        fetchImpl,
      },
    );

    const [url] = fetchImpl.mock.calls[0];
    expect(url).toBe(
      'https://api.github.com/repos/my-org/my-repo/contents/frontend/package.json?ref=develop-enabling',
    );
  });

  it('sends the Authorization header with the bearer token', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(
        jsonResponse(200, { content: Buffer.from('x').toString('base64') }),
      );

    await fetchFileContent('org', 'repo', 'a.json', 'develop', 'my-token', {
      fetchImpl,
    });

    const [, init] = fetchImpl.mock.calls[0];
    expect((init as RequestInit).headers).toMatchObject({
      Authorization: 'Bearer my-token',
    });
  });
});

describe('fetchBranchHead', () => {
  it('returns the commit sha on 200', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(jsonResponse(200, { commit: { sha: 'abc123' } }));
    const head = await fetchBranchHead('org', 'repo', 'develop', 'tok', {
      fetchImpl,
    });
    expect(head).toEqual({ sha: 'abc123' });
  });

  it('returns undefined when the branch does not exist', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 404 }));
    const head = await fetchBranchHead('org', 'repo', 'ghost-branch', 'tok', {
      fetchImpl,
    });
    expect(head).toBeUndefined();
  });
});
