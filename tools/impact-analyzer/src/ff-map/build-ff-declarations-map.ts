import type { ExportedDeclarations } from 'ts-morph';
import type { SymbolKind } from '../types/index-schema.js';
import {
  type FfEntryMap,
  ffPackageDirFromRepoRoot,
  loadFfEntryMap,
  resolveEntrySourceFiles,
} from './entry-points.js';
import { FF_PACKAGES, type FfPackageSpec } from './build-ff-map.js';
import {
  createFfProject,
  extractSymbolsWithDeclarations,
} from './symbol-extractor.js';

export interface DeclaredSymbol {
  package: string;
  entry: string;
  name: string;
  kind: SymbolKind;
  sourceFiles: string[];
  declarations: ExportedDeclarations[];
}

/**
 * Same traversal as buildFfMap() (② in the plan), but keeps the live
 * ts-morph declaration nodes instead of discarding them — needed by the
 * diff module (src/diff/) to compute a syntactic signature shape. Not used
 * by the index/CSS pipeline, which only needs the flat SymbolEntry shape;
 * kept as a separate function rather than changing buildFfMap's return type,
 * to avoid touching the already-tested Jalon 1 code path.
 *
 * Icons are NOT special-cased here (no aggregation, unlike buildFfMap):
 * for diffing, each icon is just another real exported symbol.
 */
export function buildFfDeclarationsMap(
  repoRoot: string,
  packages: FfPackageSpec[] = FF_PACKAGES,
  entryMap: FfEntryMap = loadFfEntryMap(),
): DeclaredSymbol[] {
  const declaredSymbols: DeclaredSymbol[] = [];

  for (const {
    packageDirName,
    tsconfigFileName = 'tsconfig.json',
  } of packages) {
    const ffPackageDir = ffPackageDirFromRepoRoot(repoRoot, packageDirName);
    const entries = resolveEntrySourceFiles(ffPackageDir, entryMap);
    const project = createFfProject(`${ffPackageDir}/${tsconfigFileName}`);

    for (const { package: packageName, entry, sourceFile } of entries) {
      for (const s of extractSymbolsWithDeclarations(project, sourceFile)) {
        declaredSymbols.push({
          package: packageName,
          entry,
          name: s.name,
          kind: s.kind,
          sourceFiles: s.sourceFiles,
          declarations: s.declarations,
        });
      }
    }
  }

  return declaredSymbols;
}
