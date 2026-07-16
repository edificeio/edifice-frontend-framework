// @vitest-environment node
// A plain Node module test (no DOM involved) — jsdom's environment doesn't
// report a real file:// URL for import.meta.url, which fileURLToPath needs.
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { resolveSafePath, serveStaticFile } from './static-file.mjs';

const rootDir = fileURLToPath(new URL('./test-fixtures/root', import.meta.url));

function fakeReq(headers = {}) {
  return { headers };
}

function fakeRes() {
  return {
    statusCode: undefined,
    headers: undefined,
    body: undefined,
    writeHead(status, headers) {
      this.statusCode = status;
      this.headers = headers;
    },
    end(body) {
      this.body = body;
    },
  };
}

describe('resolveSafePath', () => {
  it('resolves a plain relative path under rootDir as safe', () => {
    const { target, safe } = resolveSafePath(rootDir, 'index.html');
    expect(safe).toBe(true);
    expect(target).toBe(resolve(rootDir, 'index.html'));
  });

  it('rejects a literal path-traversal attempt (../)', () => {
    expect(resolveSafePath(rootDir, '../secret.txt').safe).toBe(false);
    expect(resolveSafePath(rootDir, 'assets/../../secret.txt').safe).toBe(
      false,
    );
  });

  it('rejects a percent-encoded traversal attempt', () => {
    expect(resolveSafePath(rootDir, '..%2Fsecret.txt').safe).toBe(false);
  });

  it('strips a leading slash instead of treating the path as absolute', () => {
    // Without stripping, path.resolve would treat this as absolute and
    // discard rootDir entirely — the real bug this guards against.
    const { target, safe } = resolveSafePath(rootDir, '/index.html');
    expect(safe).toBe(true);
    expect(target).toBe(resolve(rootDir, 'index.html'));
  });
});

describe('serveStaticFile', () => {
  it('serves an existing file with a 200, content-type and ETag', () => {
    const res = fakeRes();
    serveStaticFile(fakeReq(), res, rootDir, 'index.html', rootDir);
    expect(res.statusCode).toBe(200);
    expect(res.headers['Content-Type']).toContain('text/html');
    expect(res.headers['ETag']).toMatch(/^".+"$/);
    expect(res.body.toString()).toContain('ok');
  });

  it('returns 403 on a path-traversal attempt, never touching the file', () => {
    const res = fakeRes();
    serveStaticFile(fakeReq(), res, rootDir, '../secret.txt', rootDir);
    expect(res.statusCode).toBe(403);
  });

  it('returns 404 for a missing file', () => {
    const res = fakeRes();
    serveStaticFile(fakeReq(), res, rootDir, 'does-not-exist.html', rootDir);
    expect(res.statusCode).toBe(404);
  });

  it('returns 304 with no body when If-None-Match matches the ETag', () => {
    const first = fakeRes();
    serveStaticFile(fakeReq(), first, rootDir, 'index.html', rootDir);
    const etag = first.headers['ETag'];

    const second = fakeRes();
    serveStaticFile(
      fakeReq({ 'if-none-match': etag }),
      second,
      rootDir,
      'index.html',
      rootDir,
    );
    expect(second.statusCode).toBe(304);
    expect(second.body).toBeUndefined();
  });

  it('gzips a compressible file when the client accepts it', () => {
    const res = fakeRes();
    serveStaticFile(
      fakeReq({ 'accept-encoding': 'gzip, deflate' }),
      res,
      rootDir,
      'index.html',
      rootDir,
    );
    expect(res.headers['Content-Encoding']).toBe('gzip');
    expect(gunzipSync(res.body).toString()).toContain('ok');
  });

  it('does not gzip when the client sends no Accept-Encoding', () => {
    const res = fakeRes();
    serveStaticFile(fakeReq(), res, rootDir, 'index.html', rootDir);
    expect(res.headers['Content-Encoding']).toBeUndefined();
  });

  it('caches assets/* forever, but index.html with no-cache', () => {
    const assetRes = fakeRes();
    serveStaticFile(fakeReq(), assetRes, rootDir, 'assets/app.css', rootDir);
    expect(assetRes.headers['Cache-Control']).toBe(
      'public, max-age=31536000, immutable',
    );

    const indexRes = fakeRes();
    serveStaticFile(fakeReq(), indexRes, rootDir, 'index.html', rootDir);
    expect(indexRes.headers['Cache-Control']).toBe('no-cache');
  });
});
