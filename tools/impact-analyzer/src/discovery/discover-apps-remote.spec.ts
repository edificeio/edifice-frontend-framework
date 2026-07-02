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

  it('silently skips a branch listed in app.branches but absent on GitHub', async () => {
    process.env.IMPACT_ANALYZER_GITHUB_TOKEN = 'tok';
    const fetchImpl = vi.fn(async () => new Response(null, { status: 404 }));

    const { discovered, scanErrors } = await discoverAppsRemote(
      [makeApp({ branches: ['develop'] })],
      {
        githubClientOptions: { fetchImpl },
      },
    );

    expect(discovered).toEqual([]);
    expect(scanErrors).toEqual([]);
  });

  it('never queries a branch that is not listed in app.branches, even if it is a V1 branch', async () => {
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
      v1Branches: ['develop', 'develop-enabling'],
      githubClientOptions: { fetchImpl },
    });

    expect(
      fetchImpl.mock.calls.some(([url]) =>
        (url as string).includes('develop-enabling'),
      ),
    ).toBe(false);
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
      { githubClientOptions: { fetchImpl } },
    );

    expect(scanErrors).toHaveLength(1);
    expect(scanErrors[0].app).toBe('bad-app');
    expect(discovered).toHaveLength(1);
    expect(discovered[0].app.name).toBe('good-app');
  });
});
