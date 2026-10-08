import { describe, expect, it, vi } from 'vitest';

import { createDevProxyConfig } from './createDevProxyConfig';

vi.mock('vite', () => ({
  loadEnv: vi.fn(),
}));

const { loadEnv } = await import('vite');

describe('createDevProxyConfig', () => {
  it('falls back to the default target when no env file is found', () => {
    vi.mocked(loadEnv).mockReturnValue({});

    const { headers, proxyObj, proxy } = createDevProxyConfig({
      mode: 'development',
      routes: ['/foo', '/bar'],
    });

    expect(headers).toEqual({});
    expect(proxyObj).toEqual({
      target: 'http://localhost:8090',
      changeOrigin: false,
    });
    expect(proxy).toEqual({ '/foo': proxyObj, '/bar': proxyObj });
  });

  it('proxies to VITE_RECETTE with session cookies when an env file is found', () => {
    vi.mocked(loadEnv).mockReturnValue({
      VITE_RECETTE: 'https://recette.example.com',
      VITE_ONE_SESSION_ID: 'session-42',
      VITE_XSRF_TOKEN: 'xsrf-42',
    });

    const { headers, proxyObj, proxy } = createDevProxyConfig({
      mode: 'development',
      routes: ['/foo'],
    });

    expect(headers['set-cookie']).toEqual([
      'oneSessionId=session-42',
      'XSRF-TOKEN=xsrf-42',
      'authenticated=true',
    ]);
    expect(headers['Cache-Control']).toBe('public, max-age=300');
    expect(proxyObj.target).toBe('https://recette.example.com');
    expect(proxyObj.changeOrigin).toBe(true);
    expect(proxy['/foo']).toBe(proxyObj);
  });

  it('forces the X-XSRF-TOKEN header on proxied requests', () => {
    vi.mocked(loadEnv).mockReturnValue({
      VITE_RECETTE: 'https://recette.example.com',
      VITE_XSRF_TOKEN: 'xsrf-42',
    });

    const { proxyObj } = createDevProxyConfig({
      mode: 'development',
      routes: ['/foo'],
    });

    const proxyReq = { setHeader: vi.fn() };
    type ProxyReqHandler = (req: typeof proxyReq) => void;
    const handlers: Record<string, ProxyReqHandler> = {};
    const proxy = {
      on: vi.fn((event: string, handler: ProxyReqHandler) => {
        handlers[event] = handler;
      }),
    };

    proxyObj.configure?.(proxy as never, {} as never);
    handlers.proxyReq(proxyReq);

    expect(proxyReq.setHeader).toHaveBeenCalledWith('X-XSRF-TOKEN', 'xsrf-42');
  });
});
