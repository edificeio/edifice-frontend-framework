// @vitest-environment node
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { refreshOnce } from './refresh-data.mjs';

// A ~3 MB payload, like the real indexes — over the 1 MB threshold past
// which the Contents API JSON media type returns an empty `content`.
const BIG_INDEX = JSON.stringify({
  schemaVersion: 1,
  padding: 'x'.repeat(3_000_000),
});

function mockGithubFetch() {
  return vi.fn(async (url, options) => {
    const accept = options.headers.Accept;
    if (url.includes('/contents?')) {
      // Directory listing — always requested as JSON.
      expect(accept).toBe('application/vnd.github+json');
      return {
        ok: true,
        json: async () => [
          { type: 'file', name: 'index.develop.json' },
          { type: 'file', name: 'README.md' },
        ],
      };
    }
    // File download — must use the raw media type: the JSON media type
    // would answer { content: '', encoding: 'none' } for a file this big.
    expect(url).toContain('index.develop.json');
    expect(accept).toBe('application/vnd.github.raw');
    return { ok: true, text: async () => BIG_INDEX };
  });
}

describe('refreshOnce', () => {
  let dataDir;

  beforeEach(() => {
    dataDir = mkdtempSync(join(tmpdir(), 'refresh-data-spec-'));
  });

  afterEach(() => {
    rmSync(dataDir, { recursive: true, force: true });
    vi.unstubAllGlobals();
  });

  it('downloads file contents via the raw media type and writes them fully', async () => {
    vi.stubGlobal('fetch', mockGithubFetch());

    const result = await refreshOnce({
      owner: 'edificeio',
      repo: 'impact-analyzer-data',
      ref: 'main',
      token: 'test-token',
      dataDir,
    });

    expect(result).toEqual({ indexCount: 1, diffCount: 0 });
    const written = readFileSync(join(dataDir, 'index.develop.json'), 'utf-8');
    expect(written).toBe(BIG_INDEX);
    expect(written.length).toBeGreaterThan(1_000_000);
    expect(
      JSON.parse(readFileSync(join(dataDir, 'manifest.json'), 'utf-8')),
    ).toEqual({ branches: ['develop'], diffs: [] });
  });
});
