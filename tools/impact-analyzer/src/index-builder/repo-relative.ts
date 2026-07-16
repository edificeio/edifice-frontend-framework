import { relative, sep } from 'node:path';

/**
 * Converts analyzer file paths (absolute, pointing into a sibling repo or a
 * disposable CI clone) to repo-root-relative POSIX paths — the only form
 * that is stable across runs (a clone's temp dir changes every night, which
 * used to make the published index differ even when nothing moved) and
 * usable to build GitHub blob permalinks.
 */
export function toRepoRelativeFiles(
  repoRoot: string,
  files: string[],
): string[] {
  return files.map((file) => relative(repoRoot, file).split(sep).join('/'));
}
