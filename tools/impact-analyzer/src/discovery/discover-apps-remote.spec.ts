import { afterEach, describe, expect, it, vi } from 'vitest';
import type { RegisteredApp } from '../registry/apps-registry.js';
import { discoverAppsRemote } from './discover-apps-remote.js';

function b64(content: unknown): string {
  return Buffer.from(JSON.stringify(content)).toString('base64');
}

function makeApp(overrides: Partial<RegisteredApp> = {}): RegisteredApp {
  return {
    name: 'demo',
    org: 'edificeio',
    repo: 'demo',
    branches: ['develop', 'develop-enabling'],
    ...overrides,
  };
}

describe('discoverAppsRemote', () => {
  const originalToken = process.env.IMPACT_ANALYZER_GITHUB_TOKEN;

  afterEach(() => {
    if (originalToken === undefined)
      delete process.env.IMPACT_ANALYZER_GITHUB_TOKEN;
    else process.env.IMPACT_ANALYZER_GITHUB_TOKEN = originalToken;
  });

  it('discovers an app via frontend/package.json and captures the branch head sha', async () => {
    process.env.IMPACT_ANALYZER_GITHUB_TOKEN = 'tok';
    const fetchImpl = vi.fn(async (url: string) => {
      if (url.includes('/branches/develop-enabling'))
        return new Response(null, { status: 404 });
      if (url.includes('/branches/develop'))
        return new Response(JSON.stringify({ commit: { sha: 'sha-develop' } }));
      if (url.includes('/contents/frontend/package.json')) {
        return new Response(
          JSON.stringify({
            content: b64({ dependencies: { '@edifice.io/react': 'develop' } }),
          }),
        );
      }
      return new Response(null, { status: 404 });
    });

    const { discovered, scanErrors } = await discoverAppsRemote([makeApp()], {
      githubClientOptions: { fetchImpl },
    });

    expect(scanErrors).toEqual([]);
    expect(discovered).toHaveLength(1);
    expect(discovered[0]).toMatchObject({
      branch: 'develop',
      commit: 'sha-develop',
      layout: {
        packageJsonRelPath: 'frontend/package.json',
        srcRelPath: 'frontend/src',
      },
      pins: [{ package: '@edifice.io/react', raw: 'develop', type: 'branch' }],
    });
  });

  it('falls back to the root package.json when frontend/package.json is missing', async () => {
    process.env.IMPACT_ANALYZER_GITHUB_TOKEN = 'tok';
    const fetchImpl = vi.fn(async (url: string) => {
      if (url.includes('/branches/'))
        return new Response(JSON.stringify({ commit: { sha: 'sha' } }));
      if (url.includes('/contents/frontend/package.json'))
        return new Response(null, { status: 404 });
      if (url.includes('/contents/package.json')) {
        return new Response(
          JSON.stringify({ content: b64({ dependencies: {} }) }),
        );
      }
      return new Response(null, { status: 404 });
    });

    const { discovered } = await discoverAppsRemote(
      [makeApp({ branches: ['develop'] })],
      {
        githubClientOptions: { fetchImpl },
      },
    );

    expect(discovered[0].layout).toEqual({
      packageJsonRelPath: 'package.json',
      srcRelPath: 'src',
    });
  });

  it('silently skips one absent branch when at least one other branch of the app is found', async () => {
    process.env.IMPACT_ANALYZER_GITHUB_TOKEN = 'tok';
    const fetchImpl = vi.fn(async (url: string) => {
      if (url.includes('/branches/develop-enabling'))
        return new Response(null, { status: 404 });
      if (url.includes('/branches/develop'))
        return new Response(JSON.stringify({ commit: { sha: 'sha-develop' } }));
      if (url.includes('/contents/frontend/package.json')) {
        return new Response(
          JSON.stringify({ content: b64({ dependencies: {} }) }),
        );
      }
      return new Response(null, { status: 404 });
    });

    const { discovered, scanErrors } = await discoverAppsRemote([makeApp()], {
      githubClientOptions: { fetchImpl },
    });

    expect(discovered).toHaveLength(1);
    expect(scanErrors).toEqual([]);
  });

  it('reports an informational scanError when every configured branch is absent for an app (no partial signal lost)', async () => {
    process.env.IMPACT_ANALYZER_GITHUB_TOKEN = 'tok';
    const fetchImpl = vi.fn(async () => new Response(null, { status: 404 }));

    const { discovered, scanErrors } = await discoverAppsRemote(
      [makeApp({ branches: ['develop', 'develop-enabling'] })],
      {
        githubClientOptions: { fetchImpl },
      },
    );

    expect(discovered).toEqual([]);
    expect(scanErrors).toHaveLength(1);
    expect(scanErrors[0].app).toBe('demo');
    expect(scanErrors[0].error).toContain('No branch found on GitHub');
  });

  it('never queries a branch that is not listed in app.branches', async () => {
    process.env.IMPACT_ANALYZER_GITHUB_TOKEN = 'tok';
    const fetchImpl = vi.fn(async (url: string) => {
      if (url.includes('/branches/develop-enabling')) {
        throw new Error(
          'should never be called for an app without this branch',
        );
      }
      return new Response(JSON.stringify({ commit: { sha: 'x' } }));
    });

    await discoverAppsRemote([makeApp({ branches: ['develop'] })], {
      githubClientOptions: { fetchImpl },
    });

    expect(
      fetchImpl.mock.calls.some(([url]) =>
        (url as string).includes('develop-enabling'),
      ),
    ).toBe(false);
  });

  it('checks the literal branch name declared per app, even when it does not match the "develop" convention', async () => {
    // Real bug this guards against: apps.json correctly declares "dev" for
    // some repos (branch naming isn't uniform), but a previous version of
    // this function cross-filtered app.branches against a generic
    // "develop"/"develop-enabling" list, silently dropping "dev" and making
    // the whole app vanish from discovery with 0 scanErrors.
    process.env.IMPACT_ANALYZER_GITHUB_TOKEN = 'tok';
    const fetchImpl = vi.fn(async (url: string) => {
      if (url.includes('/branches/dev'))
        return new Response(JSON.stringify({ commit: { sha: 'sha-dev' } }));
      if (url.includes('/contents/frontend/package.json'))
        return new Response(
          JSON.stringify({ content: b64({ dependencies: {} }) }),
        );
      return new Response(null, { status: 404 });
    });

    const { discovered, scanErrors } = await discoverAppsRemote(
      [makeApp({ branches: ['dev'] })],
      { githubClientOptions: { fetchImpl } },
    );

    expect(scanErrors).toEqual([]);
    expect(discovered).toHaveLength(1);
    expect(discovered[0].branch).toBe('dev');
  });

  it('reports a scanError, without crashing, when no token is configured for the org', async () => {
    delete process.env.IMPACT_ANALYZER_GITHUB_TOKEN;
    const fetchImpl = vi.fn();

    const { discovered, scanErrors } = await discoverAppsRemote(
      [makeApp({ branches: ['develop'] })],
      {
        githubClientOptions: { fetchImpl },
      },
    );

    expect(discovered).toEqual([]);
    expect(scanErrors).toHaveLength(1);
    expect(scanErrors[0].error).toContain('No GitHub token found');
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('reports a scanError when neither package.json exists on a branch that does exist', async () => {
    process.env.IMPACT_ANALYZER_GITHUB_TOKEN = 'tok';
    const fetchImpl = vi.fn(async (url: string) => {
      if (url.includes('/branches/'))
        return new Response(JSON.stringify({ commit: { sha: 'sha' } }));
      return new Response(null, { status: 404 });
    });

    const { discovered, scanErrors } = await discoverAppsRemote(
      [makeApp({ branches: ['develop'] })],
      {
        githubClientOptions: { fetchImpl },
      },
    );

    expect(discovered).toEqual([]);
    expect(scanErrors).toHaveLength(1);
    expect(scanErrors[0].error).toContain(
      'Neither frontend/package.json nor package.json',
    );
  });

  it('reports a scanError with the status but never the token on a 403/500', async () => {
    process.env.IMPACT_ANALYZER_GITHUB_TOKEN = 'super-secret-token';
    const fetchImpl = vi.fn(
      async () => new Response('rate limited', { status: 403 }),
    );

    const { scanErrors } = await discoverAppsRemote(
      [makeApp({ branches: ['develop'] })],
      {
        githubClientOptions: { fetchImpl },
      },
    );

    expect(scanErrors).toHaveLength(1);
    expect(scanErrors[0].error).toContain('403');
    expect(scanErrors[0].error).not.toContain('super-secret-token');
  });

  it('keeps processing other apps when one app fails', async () => {
    process.env.IMPACT_ANALYZER_GITHUB_TOKEN = 'tok';
    const fetchImpl = vi.fn(async (url: string) => {
      if (url.includes('/repos/edificeio/bad-app/'))
        return new Response('boom', { status: 500 });
      if (url.includes('/branches/'))
        return new Response(JSON.stringify({ commit: { sha: 'sha' } }));
      if (url.includes('/contents/frontend/package.json')) {
        return new Response(
          JSON.stringify({ content: b64({ dependencies: {} }) }),
        );
      }
      return new Response(null, { status: 404 });
    });

    const { discovered, scanErrors } = await discoverAppsRemote(
      [
        makeApp({ name: 'bad-app', repo: 'bad-app', branches: ['develop'] }),
        makeApp({ name: 'good-app', repo: 'good-app', branches: ['develop'] }),
      ],
      {
        // 500 is retried (github-client.ts) — a no-op sleep keeps this test
        // fast, the retry/backoff behavior itself has its own dedicated tests.
        githubClientOptions: { fetchImpl, sleepImpl: async () => {} },
      },
    );

    expect(scanErrors).toHaveLength(1);
    expect(scanErrors[0].app).toBe('bad-app');
    expect(discovered).toHaveLength(1);
    expect(discovered[0].app.name).toBe('good-app');
  });
});
