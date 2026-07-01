import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ImpactIndex } from '../types/index-schema.js';

export const DEFAULT_DATA_DIR = fileURLToPath(
  new URL('../../data', import.meta.url),
);

export function sanitizeBranchForFilename(branch: string): string {
  return branch.replace(/[^a-zA-Z0-9._-]/g, '-');
}

/** Path an index for `branch` would be written to/read from — shared with the `symbol --cached` CLI command. */
export function indexFilePath(
  branch: string,
  dataDir: string = DEFAULT_DATA_DIR,
): string {
  return join(dataDir, `index.${sanitizeBranchForFilename(branch)}.json`);
}

/** Writes one index file per FF branch scanned: data/index.<branch>.json (plan §7). */
export function writeIndex(
  index: ImpactIndex,
  dataDir: string = DEFAULT_DATA_DIR,
): string {
  mkdirSync(dataDir, { recursive: true });
  const filePath = indexFilePath(index.ffBranch, dataDir);
  writeFileSync(filePath, JSON.stringify(index, null, 2));
  return filePath;
}
