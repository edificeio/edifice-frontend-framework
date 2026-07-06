import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, isAbsolute, relative, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

export const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

// Text-ish formats worth gzipping — the data/JS payloads this server exists
// to serve, not the small binary icons.
const COMPRESSIBLE_EXTENSIONS = new Set([
  '.html',
  '.js',
  '.mjs',
  '.css',
  '.json',
  '.svg',
]);

/**
 * Vite content-hashes every filename under dist/assets/ (a build always
 * produces new names), so those can be cached forever; everything else
 * (index.html, and the periodically-refreshed /data/*.json) must always
 * revalidate — the ETag in serveStaticFile still avoids re-sending an
 * unchanged body.
 */
export function cacheControlFor(rootDir, distDir, sanitizedRelPath) {
  if (rootDir === distDir && sanitizedRelPath.startsWith('assets/')) {
    return 'public, max-age=31536000, immutable';
  }
  return 'no-cache';
}

/**
 * Resolves relativePath under rootDir, refusing any path that escapes it
 * (e.g. `../../etc/passwd`). A leading slash is stripped first — otherwise
 * `path.resolve` would treat it as absolute and silently discard `rootDir`.
 * Split out from serveStaticFile so the traversal check is testable without
 * needing fake req/res objects.
 */
export function resolveSafePath(rootDir, relativePath) {
  const sanitizedRelPath = decodeURIComponent(relativePath).replace(/^\/+/, '');
  const target = resolve(rootDir, sanitizedRelPath);
  const rel = relative(rootDir, target);
  const safe = !rel.startsWith('..') && !isAbsolute(rel);
  return { target, sanitizedRelPath, safe };
}

/** Serves one file from disk with an ETag/Cache-Control/gzip, or 403/404 on a bad or missing path. */
export function serveStaticFile(req, res, rootDir, relativePath, distDir) {
  const { target, sanitizedRelPath, safe } = resolveSafePath(
    rootDir,
    relativePath,
  );
  if (!safe) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  if (!existsSync(target) || !statSync(target).isFile()) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const content = readFileSync(target);
  const etag = `"${createHash('sha1').update(content).digest('hex')}"`;
  const cacheControl = cacheControlFor(rootDir, distDir, sanitizedRelPath);

  if (req.headers['if-none-match'] === etag) {
    res.writeHead(304, { 'ETag': etag, 'Cache-Control': cacheControl });
    res.end();
    return;
  }

  const ext = extname(target);
  const headers = {
    'Content-Type': MIME_TYPES[ext] ?? 'application/octet-stream',
    'ETag': etag,
    'Cache-Control': cacheControl,
  };

  const acceptsGzip = (req.headers['accept-encoding'] ?? '').includes('gzip');
  if (acceptsGzip && COMPRESSIBLE_EXTENSIONS.has(ext)) {
    headers['Content-Encoding'] = 'gzip';
    headers['Vary'] = 'Accept-Encoding';
    res.writeHead(200, headers);
    res.end(gzipSync(content));
    return;
  }

  res.writeHead(200, headers);
  res.end(content);
}
