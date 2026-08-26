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

  it("reads a diff file's own generatedAt into the manifest, without a second request", async () => {
    const diffReport = JSON.stringify({
      schemaVersion: 1,
      generatedAt: '2026-08-20T10:00:00.000Z',
      base: { ref: 'develop', commit: 'abc' },
      head: { ref: 'feat-x', commit: 'def' },
    });
    const fetchMock = vi.fn(async (url, options) => {
      if (url.includes('/contents?')) {
        return {
          ok: true,
          json: async () => [
            { type: 'file', name: 'diff.develop..feat-x.json' },
          ],
        };
      }
      expect(options.headers.Accept).toBe('application/vnd.github.raw');
      return { ok: true, text: async () => diffReport };
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await refreshOnce({
      owner: 'edificeio',
      repo: 'impact-analyzer-data',
      ref: 'main',
      token: 'test-token',
      dataDir,
    });

    // One request for the directory listing, one for the diff file's
    // content — no extra round trip to learn its date.
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ indexCount: 0, diffCount: 1 });
    expect(
      JSON.parse(readFileSync(join(dataDir, 'manifest.json'), 'utf-8')),
    ).toEqual({
      branches: [],
      diffs: [
        {
          base: 'develop',
          head: 'feat-x',
          file: 'diff.develop..feat-x.json',
          generatedAt: '2026-08-20T10:00:00.000Z',
        },
      ],
    });
  });

  it('keeps generatedAt null for a diff file whose content is unparsable, without failing the whole refresh', async () => {
    const fetchMock = vi.fn(async (url) => {
      if (url.includes('/contents?')) {
        return {
          ok: true,
          json: async () => [
            { type: 'file', name: 'diff.develop..feat-x.json' },
          ],
        };
      }
      return { ok: true, text: async () => 'not json' };
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await refreshOnce({
      owner: 'edificeio',
      repo: 'impact-analyzer-data',
      ref: 'main',
      token: 'test-token',
      dataDir,
    });

    expect(result).toEqual({ indexCount: 0, diffCount: 1 });
    const manifest = JSON.parse(
      readFileSync(join(dataDir, 'manifest.json'), 'utf-8'),
    );
    expect(manifest.diffs[0].generatedAt).toBeNull();
  });
});
