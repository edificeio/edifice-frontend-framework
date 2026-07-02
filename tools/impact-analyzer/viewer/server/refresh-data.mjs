import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildManifest } from './manifest.mjs';

const GITHUB_API_BASE = 'https://api.github.com';

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

async function githubContentsRequest(path, token) {
  const res = await fetch(`${GITHUB_API_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
  });
  if (!res.ok) {
    throw new Error(
      `GitHub API request failed (${res.status}) for ${path.split('?')[0]}`,
    );
  }
  return res.json();
}

/** Fetches every index.*.json/diff.*.json file at the repo root and writes them + manifest.json into dataDir. */
async function refreshOnce({ owner, repo, ref, token, dataDir }) {
  const entries = await githubContentsRequest(
    `/repos/${owner}/${repo}/contents?ref=${encodeURIComponent(ref)}`,
    token,
  );
  const fileNames = entries
    .filter((entry) => entry.type === 'file')
    .map((entry) => entry.name);

  const { branches, diffs, indexFiles, diffFiles } = buildManifest(fileNames);

  mkdirSync(dataDir, { recursive: true });

  for (const fileName of [...indexFiles, ...diffFiles]) {
    const file = await githubContentsRequest(
      `/repos/${owner}/${repo}/contents/${encodeURIComponent(fileName)}?ref=${encodeURIComponent(ref)}`,
      token,
    );
    const content = Buffer.from(file.content, 'base64').toString('utf-8');
    writeFileSync(join(dataDir, fileName), content);
  }

  writeFileSync(
    join(dataDir, 'manifest.json'),
    JSON.stringify({ branches, diffs }, null, 2),
  );

  return { indexCount: indexFiles.length, diffCount: diffFiles.length };
}

/**
 * Starts the periodic refresh loop (never throws out of the caller — every
 * failure is logged and retried next cycle, previous data stays served as
 * is). Returns a state object serve.mjs reads for readiness/metrics.
 */
export function startRefreshLoop({
  owner,
  repo,
  ref,
  token,
  dataDir,
  intervalSeconds,
}) {
  const state = {
    attempted: false,
    lastSuccessAt: null,
    lastFailureAt: null,
    successCount: 0,
    failureCount: 0,
  };

  async function cycle() {
    try {
      const result = await refreshOnce({ owner, repo, ref, token, dataDir });
      state.lastSuccessAt = new Date().toISOString();
      state.successCount++;
      log('info', 'Data refresh succeeded', result);
    } catch (error) {
      state.lastFailureAt = new Date().toISOString();
      state.failureCount++;
      log('error', 'Data refresh failed, keeping previous data', {
        'error.message': error instanceof Error ? error.message : String(error),
      });
    } finally {
      state.attempted = true;
    }
  }

  cycle();
  const timer = setInterval(cycle, intervalSeconds * 1000);

  return {
    getState: () => ({ ...state }),
    stop: () => clearInterval(timer),
  };
}
