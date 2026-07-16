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

describe('retry/backoff', () => {
  it('retries a 500 and succeeds once the API recovers', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(new Response('boom', { status: 500 }))
      .mockResolvedValueOnce(
        jsonResponse(200, { content: Buffer.from('ok').toString('base64') }),
      );
    const sleepImpl = vi.fn().mockResolvedValue(undefined);

    const content = await fetchFileContent(
      'org',
      'repo',
      'a.json',
      'develop',
      'tok',
      { fetchImpl, sleepImpl },
    );

    expect(content).toBe('ok');
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(sleepImpl).toHaveBeenCalledTimes(1);
  });

  it('honors the Retry-After header instead of the default backoff', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(
        new Response('rate limited', {
          status: 429,
          headers: { 'retry-after': '7' },
        }),
      )
      .mockResolvedValueOnce(
        jsonResponse(200, { content: Buffer.from('ok').toString('base64') }),
      );
    const sleepImpl = vi.fn().mockResolvedValue(undefined);

    await fetchFileContent('org', 'repo', 'a.json', 'develop', 'tok', {
      fetchImpl,
      sleepImpl,
    });

    expect(sleepImpl).toHaveBeenCalledWith(7000);
  });

  it('gives up after the max attempts and reports rate-limited on a secondary-limit 403', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response('secondary rate limit', {
        status: 403,
        headers: { 'x-ratelimit-remaining': '0' },
      }),
    );
    const sleepImpl = vi.fn().mockResolvedValue(undefined);

    await expect(
      fetchFileContent('org', 'repo', 'a.json', 'develop', 'tok', {
        fetchImpl,
        sleepImpl,
      }),
    ).rejects.toSatisfy((error: unknown) => {
      expect(error).toBeInstanceOf(GithubApiError);
      const apiError = error as GithubApiError;
      expect(apiError.status).toBe(403);
      expect(apiError.rateLimited).toBe(true);
      expect(apiError.message).toContain('rate limited');
      return true;
    });
    expect(fetchImpl).toHaveBeenCalledTimes(4); // 1 initial + 3 retries
  });

  it('does not retry a plain 403 forbidden (no rate-limit signal)', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(new Response('nope', { status: 403 }));
    const sleepImpl = vi.fn().mockResolvedValue(undefined);

    await expect(
      fetchFileContent('org', 'repo', 'a.json', 'develop', 'tok', {
        fetchImpl,
        sleepImpl,
      }),
    ).rejects.toSatisfy((error: unknown) => {
      const apiError = error as GithubApiError;
      expect(apiError.rateLimited).toBe(false);
      return true;
    });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(sleepImpl).not.toHaveBeenCalled();
  });

  it('does not retry a 404', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 404 }));
    const sleepImpl = vi.fn().mockResolvedValue(undefined);

    const content = await fetchFileContent(
      'org',
      'repo',
      'missing.json',
      'develop',
      'tok',
      { fetchImpl, sleepImpl },
    );

    expect(content).toBeUndefined();
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(sleepImpl).not.toHaveBeenCalled();
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
