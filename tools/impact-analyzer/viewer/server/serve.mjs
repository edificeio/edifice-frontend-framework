import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import client from 'prom-client';
import { startRefreshLoop } from './refresh-data.mjs';
import { serveStaticFile } from './static-file.mjs';

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
      serveStaticFile(
        req,
        res,
        DATA_DIR,
        pathname.slice('/data/'.length),
        DIST_DIR,
      );
      return;
    }

    serveStaticFile(
      req,
      res,
      DIST_DIR,
      pathname === '/' ? 'index.html' : pathname,
      DIST_DIR,
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
