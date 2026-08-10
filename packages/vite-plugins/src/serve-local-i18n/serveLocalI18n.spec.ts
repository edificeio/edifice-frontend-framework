import type { Plugin } from 'vite';
import { describe, expect, it, vi } from 'vitest';

import { serveLocalI18n } from './serveLocalI18n';

vi.mock('node:fs', () => ({
  readFileSync: vi.fn(),
}));

const { readFileSync } = await import('node:fs');

type ConnectMiddleware = (
  req: any,
  res: any,
  next: (err?: Error) => void,
) => void;

function createServer(root = '/root') {
  let middleware: ConnectMiddleware = () => {};
  const middlewares = {
    use: vi.fn((fn: ConnectMiddleware) => (middleware = fn)),
  };
  const server = { config: { root }, middlewares };
  return { server, getMiddleware: () => middleware };
}

function callConfigureServer(plugin: Plugin, server: unknown) {
  (plugin.configureServer as ((server: unknown) => void) | undefined)?.(server);
}

describe('serveLocalI18n', () => {
  it('serves the matching route file with the right content type', () => {
    vi.mocked(readFileSync).mockReturnValue('{"hello":"world"}');

    const plugin = serveLocalI18n({
      routes: [{ routePath: '/timeline/i18n', filePath: 'i18n/fr.json' }],
      rootDir: '/app',
    });

    const { server, getMiddleware } = createServer();
    callConfigureServer(plugin, server);

    const res = { setHeader: vi.fn(), end: vi.fn() };
    const next = vi.fn();
    getMiddleware()({ url: '/timeline/i18n?foo=bar' }, res, next);

    expect(readFileSync).toHaveBeenCalledWith('/app/i18n/fr.json', 'utf-8');
    expect(res.setHeader).toHaveBeenCalledWith(
      'Content-Type',
      'application/json; charset=utf-8',
    );
    expect(res.end).toHaveBeenCalledWith('{"hello":"world"}');
    expect(next).not.toHaveBeenCalled();
  });

  it('falls through to next() when no route matches', () => {
    const plugin = serveLocalI18n({
      routes: [{ routePath: '/timeline/i18n', filePath: 'i18n/fr.json' }],
      rootDir: '/app',
    });

    const { server, getMiddleware } = createServer();
    callConfigureServer(plugin, server);

    const res = { setHeader: vi.fn(), end: vi.fn() };
    const next = vi.fn();
    getMiddleware()({ url: '/other' }, res, next);

    expect(res.end).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith();
  });

  it('forwards read errors to next()', () => {
    const error = new Error('ENOENT');
    vi.mocked(readFileSync).mockImplementation(() => {
      throw error;
    });

    const plugin = serveLocalI18n({
      routes: [{ routePath: '/timeline/i18n', filePath: 'i18n/fr.json' }],
      rootDir: '/app',
    });

    const { server, getMiddleware } = createServer();
    callConfigureServer(plugin, server);

    const next = vi.fn();
    getMiddleware()(
      { url: '/timeline/i18n' },
      { setHeader: vi.fn(), end: vi.fn() },
      next,
    );

    expect(next).toHaveBeenCalledWith(error);
  });

  it('resolves file paths against the server root when rootDir is not provided', () => {
    vi.mocked(readFileSync).mockReturnValue('{}');

    const plugin = serveLocalI18n({
      routes: [{ routePath: '/i18n', filePath: 'fr.json' }],
    });

    const { server, getMiddleware } = createServer('/server-root');
    callConfigureServer(plugin, server);

    getMiddleware()(
      { url: '/i18n' },
      { setHeader: vi.fn(), end: vi.fn() },
      vi.fn(),
    );

    expect(readFileSync).toHaveBeenCalledWith('/server-root/fr.json', 'utf-8');
  });
});
