import type { SymbolEntry } from '../types/index-schema.js';
import {
  type FfEntryMap,
  ffPackageDirFromRepoRoot,
  loadFfEntryMap,
  resolveEntrySourceFiles,
} from './entry-points.js';
import { buildIconSymbolEntries, isIconsEntry } from './icons-aggregator.js';
import {
  createFfProject,
  extractSymbolsFromEntry,
} from './symbol-extractor.js';

export interface FfPackageSpec {
  /** Directory name under packages/, e.g. "react", "extensions". */
  packageDirName: string;
  /**
   * Some packages (react) ship a "solution style" tsconfig.json (`files: []`
   * + `references` only) purely for the TS build graph — it carries no
   * compilerOptions of its own, so pointing ts-morph at it silently loses
   * `jsx`/`moduleResolution` and breaks cross-file export resolution.
   * Defaults to "tsconfig.json"; override per package as needed.
   */
  tsconfigFileName?: string;
}

/** The FF packages in scope for Jalon 1 (plan §10 — JS-import packages). */
export const FF_PACKAGES: FfPackageSpec[] = [
  { packageDirName: 'react', tsconfigFileName: 'tsconfig.lib.json' },
  { packageDirName: 'client' },
  { packageDirName: 'utilities' },
  { packageDirName: 'extensions' },
  { packageDirName: 'rest-client-base' },
];

/**
 * Builds the FF-side symbol table (② in the plan) for every declared
 * `exports` subpath of the given FF packages: export name -> source
 * files, with icon subpaths aggregated (icons-aggregator.ts).
 */
export function buildFfMap(
  repoRoot: string,
  packages: FfPackageSpec[] = FF_PACKAGES,
  entryMap: FfEntryMap = loadFfEntryMap(),
): SymbolEntry[] {
  const symbolEntries: SymbolEntry[] = [];

  for (const {
    packageDirName,
    tsconfigFileName = 'tsconfig.json',
  } of packages) {
    const ffPackageDir = ffPackageDirFromRepoRoot(repoRoot, packageDirName);
    const entries = resolveEntrySourceFiles(ffPackageDir, entryMap);
    const project = createFfProject(`${ffPackageDir}/${tsconfigFileName}`);

    for (const { package: packageName, entry, sourceFile } of entries) {
      const symbols = extractSymbolsFromEntry(project, sourceFile);

      if (isIconsEntry(entry)) {
        symbolEntries.push(
          ...buildIconSymbolEntries(packageName, entry, symbols),
        );
        continue;
      }

      for (const s of symbols) {
        symbolEntries.push({
          package: packageName,
          entry,
          name: s.name,
          kind: s.kind,
          sourceFiles: s.sourceFiles,
          consumers: [],
        });
      }
    }
  }

  return symbolEntries;
}
