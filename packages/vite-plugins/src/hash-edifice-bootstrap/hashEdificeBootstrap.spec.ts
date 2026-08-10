import { describe, expect, it } from 'vitest';

import { hashEdificeBootstrap, queryHashVersion } from './hashEdificeBootstrap';

describe('queryHashVersion', () => {
  it('is an 8 hex-char version string', () => {
    expect(queryHashVersion).toMatch(/^v=[0-9a-f]{8}$/);
  });
});

describe('hashEdificeBootstrap', () => {
  it('is a build-only plugin', () => {
    const plugin = hashEdificeBootstrap({ hash: 'abc123' });

    expect(plugin.name).toBe('vite-plugin-edifice');
    expect(plugin.apply).toBe('build');
  });

  it('appends the hash as a query string to the bootstrap CSS link', () => {
    const plugin = hashEdificeBootstrap({ hash: 'abc123' });
    const html =
      '<link rel="stylesheet" href="/assets/themes/edifice-bootstrap/index.css">';

    const transformed = (plugin.transformIndexHtml as (html: string) => string)(
      html,
    );

    expect(transformed).toBe(
      '<link rel="stylesheet" href="/assets/themes/edifice-bootstrap/index.css?abc123">',
    );
  });

  it('leaves unrelated HTML untouched', () => {
    const plugin = hashEdificeBootstrap({ hash: 'abc123' });
    const html = '<link rel="stylesheet" href="/assets/other.css">';

    const transformed = (plugin.transformIndexHtml as (html: string) => string)(
      html,
    );

    expect(transformed).toBe(html);
  });
});
