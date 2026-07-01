import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export type FfEntryMap = Record<string, Record<string, string>>;

const DEFAULT_ENTRY_MAP_PATH = fileURLToPath(
  new URL('../../config/ff-entry-map.json', import.meta.url),
);

export function loadFfEntryMap(
  path: string = DEFAULT_ENTRY_MAP_PATH,
): FfEntryMap {
  return JSON.parse(readFileSync(path, 'utf-8'));
}

export class FfEntryMapMismatchError extends Error {}

/** Reads the `exports` field of a FF package's package.json (subpath keys only). */
export function readPackageExportKeys(ffPackageDir: string): {
  name: string;
  exportKeys: string[];
} {
  const pkg = JSON.parse(
    readFileSync(join(ffPackageDir, 'package.json'), 'utf-8'),
  );
  const exportKeys = Object.keys(pkg.exports ?? {}).filter(
    (key) => key !== './package.json',
  );
  return { name: pkg.name, exportKeys };
}

export interface FfEntrySourceFile {
  package: string;
  entry: string;
  sourceFile: string; // absolute path
}

/**
 * Resolves each declared `exports` subpath of a FF package to its source
 * file, using the statically maintained config/ff-entry-map.json (the
 * dist->src convention differs per package and isn't safe to derive
 * generically — see PLAN-impact-analyzer.md and the implementation plan).
 */
export function resolveEntrySourceFiles(
  ffPackageDir: string,
  entryMap: FfEntryMap = loadFfEntryMap(),
): FfEntrySourceFile[] {
  const { name, exportKeys } = readPackageExportKeys(ffPackageDir);
  const packageMap = entryMap[name];
  if (!packageMap) {
    throw new FfEntryMapMismatchError(
      `No ff-entry-map.json entry for package "${name}" — add one before mapping its exports.`,
    );
  }

  const convention = packageMap.__convention__;

  return exportKeys.map((entry) => {
    let relativeSourceFile = packageMap[entry];
    if (!relativeSourceFile && convention) {
      const subpath = entry === '.' ? '' : entry.replace(/^\.\//, '');
      relativeSourceFile = convention.replace('<subpath>', subpath);
    }
    if (!relativeSourceFile) {
      throw new FfEntryMapMismatchError(
        `"${name}" declares export "${entry}" in package.json but ff-entry-map.json has no ` +
          `matching entry (and no __convention__ fallback) — update config/ff-entry-map.json.`,
      );
    }
    return {
      package: name,
      entry,
      sourceFile: join(ffPackageDir, relativeSourceFile),
    };
  });
}

export function ffPackageDirFromRepoRoot(
  repoRoot: string,
  packageDirName: string,
): string {
  return join(repoRoot, 'packages', packageDirName);
}

/** Absolute path to the FF monorepo root (this tool always lives inside it, under tools/impact-analyzer). */
export function currentFfRepoRoot(): string {
  const thisFile = fileURLToPath(import.meta.url); // .../tools/impact-analyzer/src/ff-map/entry-points.ts
  const ffMapDir = dirname(thisFile); // .../src/ff-map
  const srcDir = dirname(ffMapDir); // .../src
  const packageDir = dirname(srcDir); // .../tools/impact-analyzer
  const toolsDir = dirname(packageDir); // .../tools
  return dirname(toolsDir); // repo root
}
