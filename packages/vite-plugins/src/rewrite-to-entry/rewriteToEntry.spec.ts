import { describe, expect, it, vi } from 'vitest';

import { rewriteToEntry } from './rewriteToEntry';

type ConnectMiddleware = (req: any, res: any, next: () => void) => void;

function getMiddleware(plugin: ReturnType<typeof rewriteToEntry>) {
  let middleware: ConnectMiddleware = () => {};
  const server = {
    middlewares: { use: vi.fn((fn: ConnectMiddleware) => (middleware = fn)) },
  };
  (plugin.configureServer as ((server: unknown) => void) | undefined)?.(server);
  return middleware;
}

describe('rewriteToEntry', () => {
  it('rewrites the default root route to the entry', () => {
    const plugin = rewriteToEntry({ entry: '/homepage.html' });
    const middleware = getMiddleware(plugin);

    const req = { url: '/' };
    const next = vi.fn();
    middleware(req, {}, next);

    expect(req.url).toBe('/homepage.html');
    expect(next).toHaveBeenCalled();
  });

  it('rewrites a matching prefix to the entry', () => {
    const plugin = rewriteToEntry({
      entry: '/wayfv2.html',
      prefixes: ['/saml/wayf'],
    });
    const middleware = getMiddleware(plugin);

    const req = { url: '/saml/wayf/response' };
    middleware(req, {}, vi.fn());

    expect(req.url).toBe('/wayfv2.html');
  });

  it('leaves non-matching routes untouched', () => {
    const plugin = rewriteToEntry({ entry: '/homepage.html' });
    const middleware = getMiddleware(plugin);

    const req = { url: '/assets/app.js' };
    const next = vi.fn();
    middleware(req, {}, next);

    expect(req.url).toBe('/assets/app.js');
    expect(next).toHaveBeenCalled();
  });

  it('supports custom exact-match routes in addition to the default', () => {
    const plugin = rewriteToEntry({
      entry: '/homepage.html',
      routes: ['/', '/home'],
    });
    const middleware = getMiddleware(plugin);

    const req = { url: '/home' };
    middleware(req, {}, vi.fn());

    expect(req.url).toBe('/homepage.html');
  });
});
