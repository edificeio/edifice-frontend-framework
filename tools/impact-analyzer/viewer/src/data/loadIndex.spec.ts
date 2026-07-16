// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  DataUnavailableError,
  loadDiffReport,
  loadIndexForBranch,
  loadManifest,
} from './loadIndex.js';

function stubFetch(response: {
  status?: number;
  contentType?: string;
  body?: string;
}) {
  const {
    status = 200,
    contentType = 'application/json',
    body = '{}',
  } = response;
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({
      ok: status >= 200 && status < 300,
      status,
      headers: { get: () => contentType },
      json: async () => JSON.parse(body) as unknown,
    })),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('loadManifest', () => {
  it('treats a missing manifest (404) as the empty state, not an error', async () => {
    stubFetch({ status: 404 });
    await expect(loadManifest()).resolves.toEqual({ branches: [], diffs: [] });
  });

  it('treats an HTML response (dev SPA fallback for a missing file) as the empty state', async () => {
    stubFetch({ contentType: 'text/html', body: '<!doctype html>' });
    await expect(loadManifest()).resolves.toEqual({ branches: [], diffs: [] });
  });

  it('still throws on a real server error (500)', async () => {
    stubFetch({ status: 500 });
    await expect(loadManifest()).rejects.toThrow('500');
  });
});

describe('loadIndexForBranch / loadDiffReport', () => {
  it('throws DataUnavailableError on 404 so callers can show a calm hint', async () => {
    stubFetch({ status: 404 });
    await expect(loadIndexForBranch('develop')).rejects.toBeInstanceOf(
      DataUnavailableError,
    );
    await expect(loadDiffReport('diff.a..b.json')).rejects.toBeInstanceOf(
      DataUnavailableError,
    );
  });

  it('throws DataUnavailableError on an unparsable body (file mid-sync)', async () => {
    stubFetch({ body: '{"truncated": ' });
    await expect(loadIndexForBranch('develop')).rejects.toBeInstanceOf(
      DataUnavailableError,
    );
  });
});
