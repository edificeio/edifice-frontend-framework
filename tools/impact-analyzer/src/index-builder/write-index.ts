import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ImpactIndex } from '../types/index-schema.js';

export const DEFAULT_DATA_DIR = fileURLToPath(
  new URL('../../data', import.meta.url),
);

function sanitizeBranchForFilename(branch: string): string {
  return branch.replace(/[^a-zA-Z0-9._-]/g, '-');
}

/** Writes one index file per FF branch scanned: data/index.<branch>.json (plan §7). */
export function writeIndex(
  index: ImpactIndex,
  dataDir: string = DEFAULT_DATA_DIR,
): string {
  mkdirSync(dataDir, { recursive: true });
  const filePath = join(
    dataDir,
    `index.${sanitizeBranchForFilename(index.ffBranch)}.json`,
  );
  writeFileSync(filePath, JSON.stringify(index, null, 2));
  return filePath;
}
