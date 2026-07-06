import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, isAbsolute, relative, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
import client from 'prom-client';
import { startRefreshLoop } from './refresh-data.mjs';

const PORT = Number(process.env.PORT ?? 8080);
const DATA_DIR = resolve(process.env.DATA_DIR ?? '/app/data');
const DIST_DIR = resolve(
  process.env.DIST_DIR ?? new URL('../dist', import.meta.url).pathname,
);
const REFRESH_INTERVAL_SECONDS = Number(
  process.env.REFRESH_INTERVAL_SECONDS ?? 300,
);
const DATA_REPO_OWNER = process.env.DATA_REPO_OWNER ?? 'edificeio';
const DATA_REPO_NAME = process.env.DATA_REPO_NAME ?? 'impact-analyzer-data';
const DATA_REPO_REF = process.env.DATA_REPO_REF ?? 'main';
const DATA_REPO_GITHUB_TOKEN = process.env.DATA_REPO_GITHUB_TOKEN ?? '';

function log(level, message, extra = {}) {
  console[level === 'error' ? 'error' : 'log'](
    JSON.stringify({
      '@timestamp': new Date().toISOString(),
      'log.level': level,
      message,
      ...extra,
    }),
  );
}

if (!DATA_REPO_GITHUB_TOKEN) {
  log(
    'error',
    'DATA_REPO_GITHUB_TOKEN is not set — every refresh cycle will fail until it is provided',
  );
}

const register = new client.Registry();
client.collectDefaultMetrics({ register });
// successCount/failureCount only ever grow — real Counters, not Gauges (the
// `_total` suffix is a Prometheus convention reserved for Counter metrics).
const refreshSuccessCounter = new client.Counter({
  name: 'impact_analyzer_viewer_refresh_success_total',
  help: 'Total successful data refresh cycles since startup',
  registers: [register],
});
const refreshFailureCounter = new client.Counter({
  name: 'impact_analyzer_viewer_refresh_failure_total',
  help: 'Total failed data refresh cycles since startup',
  registers: [register],
});
const lastRefreshGauge = new client.Gauge({
  name: 'impact_analyzer_viewer_last_successful_refresh_timestamp_seconds',
  help: 'Unix timestamp of the last successful data refresh, 0 if none yet',
  registers: [register],
});
// The counters above mirror refresher's own running totals (owned by
// refresh-data.mjs, which knows nothing about Prometheus) — track what's
// already been reported so each scrape only .inc()s by the delta.
let reportedSuccessCount = 0;
let reportedFailureCount = 0;

const refresher = startRefreshLoop({
  owner: DATA_REPO_OWNER,
  repo: DATA_REPO_NAME,
  ref: DATA_REPO_REF,
  token: DATA_REPO_GITHUB_TOKEN,
  dataDir: DATA_DIR,
  intervalSeconds: REFRESH_INTERVAL_SECONDS,
});

const MIME_TYPES = {
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
 * revalidate — the ETag below still avoids re-sending an unchanged body.
 */
function cacheControlFor(rootDir, sanitizedRelPath) {
  if (rootDir === DIST_DIR && sanitizedRelPath.startsWith('assets/')) {
    return 'public, max-age=31536000, immutable';
  }
  return 'no-cache';
}

/**
 * Resolves relativePath under rootDir, refusing any path that escapes it
 * (e.g. `../../etc/passwd`). A leading slash is stripped first — otherwise
 * `path.resolve` would treat it as absolute and silently discard `rootDir`.
 */
function serveStaticFile(req, res, rootDir, relativePath) {
  const sanitizedRelPath = decodeURIComponent(relativePath).replace(/^\/+/, '');
  const target = resolve(rootDir, sanitizedRelPath);
  const rel = relative(rootDir, target);
  if (rel.startsWith('..') || isAbsolute(rel)) {
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
  const cacheControl = cacheControlFor(rootDir, sanitizedRelPath);

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

const server = createServer(async (req, res) => {
  try {
    if (req.method !== 'GET') {
      res.writeHead(405);
      res.end('Method not allowed');
      return;
    }

    const { pathname } = new URL(req.url, 'http://localhost');

    if (pathname === '/health/live') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('ok');
      return;
    }

    if (pathname === '/health/ready') {
      // Not just "a cycle was attempted" — a token that's broken from the
      // start would otherwise report ready forever with zero real data.
      // Data already on disk (e.g. surviving a restart) also counts.
      const state = refresher.getState();
      const ready =
        state.lastSuccessAt !== null ||
        existsSync(resolve(DATA_DIR, 'manifest.json'));
      res.writeHead(ready ? 200 : 503, { 'Content-Type': 'text/plain' });
      res.end(ready ? 'ok' : 'not ready');
      return;
    }

    if (pathname === '/health/metrics') {
      const state = refresher.getState();
      refreshSuccessCounter.inc(state.successCount - reportedSuccessCount);
      reportedSuccessCount = state.successCount;
      refreshFailureCounter.inc(state.failureCount - reportedFailureCount);
      reportedFailureCount = state.failureCount;
      lastRefreshGauge.set(
        state.lastSuccessAt
          ? Math.floor(new Date(state.lastSuccessAt).getTime() / 1000)
          : 0,
      );
      res.writeHead(200, { 'Content-Type': register.contentType });
      res.end(await register.metrics());
      return;
    }

    if (pathname.startsWith('/data/')) {
      serveStaticFile(req, res, DATA_DIR, pathname.slice('/data/'.length));
      return;
    }

    serveStaticFile(
      req,
      res,
      DIST_DIR,
      pathname === '/' ? 'index.html' : pathname,
    );
  } catch (error) {
    log('error', 'Unhandled request error', {
      'error.message': error instanceof Error ? error.message : String(error),
    });
    res.writeHead(500);
    res.end('Internal server error');
  }
});

server.listen(PORT, () => {
  log('info', `impact-analyzer-viewer listening on port ${PORT}`);
});

for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => {
    log('info', `Received ${signal}, shutting down`);
    refresher.stop();
    server.close(() => process.exit(0));
  });
}
