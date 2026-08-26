import type { ExportedDeclarations } from 'ts-morph';
import type { SymbolKind } from '../types/index-schema.js';
import {
  type FfEntryMap,
  ffPackageDirFromRepoRoot,
  loadFfEntryMap,
  resolveEntrySourceFiles,
} from './entry-points.js';
import { FF_PACKAGES, type FfPackageSpec } from './ff-packages.js';
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
 * The single ts-morph traversal (② in the plan) for the FF-side symbol
 * table: export name -> source files -> live declaration nodes. `buildFfMap`
 * (build-ff-map.ts) is a thin projection over this — repo-relative paths,
 * icon aggregation, declarations dropped — for the index/CSS pipeline,
 * which never needs live AST nodes. This function is the one the diff
 * module (src/diff/) calls directly, since it needs the declarations to
 * compute a syntactic signature shape.
 *
 * Icons are NOT special-cased here (no aggregation, unlike buildFfMap): for
 * diffing, each icon is just another real exported symbol.
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
