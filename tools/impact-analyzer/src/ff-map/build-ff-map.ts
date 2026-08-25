import { toRepoRelativeFiles } from '../index-builder/repo-relative.js';
import type { SymbolEntry } from '../types/index-schema.js';
import {
  buildFfDeclarationsMap,
  type DeclaredSymbol,
} from './build-ff-declarations-map.js';
import { type FfEntryMap, loadFfEntryMap } from './entry-points.js';
import { FF_PACKAGES, type FfPackageSpec } from './ff-packages.js';
import { buildIconSymbolEntries, isIconsEntry } from './icons-aggregator.js';

export { FF_PACKAGES, type FfPackageSpec } from './ff-packages.js';

/**
 * Groups declared symbols by (package, entry), preserving the order in
 * which each group is first encountered — `declaredSymbols` is produced by
 * iterating packages then entries then symbols, so this reproduces the same
 * per-entry grouping buildFfMap used to do inline, without re-running the
 * ts-morph traversal that produced it.
 */
function groupByPackageEntry(
  declaredSymbols: DeclaredSymbol[],
): Map<string, { package: string; entry: string; symbols: DeclaredSymbol[] }> {
  const groups = new Map<
    string,
    { package: string; entry: string; symbols: DeclaredSymbol[] }
  >();
  for (const s of declaredSymbols) {
    const key = `${s.package}|${s.entry}`;
    const group = groups.get(key);
    if (group) group.symbols.push(s);
    else groups.set(key, { package: s.package, entry: s.entry, symbols: [s] });
  }
  return groups;
}

/**
 * Builds the FF-side symbol table (② in the plan) for every declared
 * `exports` subpath of the given FF packages: export name -> source
 * files, with icon subpaths aggregated (icons-aggregator.ts). A projection
 * over buildFfDeclarationsMap's single traversal (P4.4,
 * REVIEW-impact-analyzer.md — buildFfMap and buildFfDeclarationsMap used to
 * independently re-run the exact same traversal, risking the two silently
 * diverging): repo-relative paths (stable across machines/runs, and the
 * form GitHub links are built from), icon aggregation, declarations
 * dropped (not part of the serialized index).
 */
export function buildFfMap(
  repoRoot: string,
  packages: FfPackageSpec[] = FF_PACKAGES,
  entryMap: FfEntryMap = loadFfEntryMap(),
): SymbolEntry[] {
  const declaredSymbols = buildFfDeclarationsMap(repoRoot, packages, entryMap);
  const symbolEntries: SymbolEntry[] = [];

  for (const { package: packageName, entry, symbols } of groupByPackageEntry(
    declaredSymbols,
  ).values()) {
    const relativized = symbols.map((s) => ({
      ...s,
      sourceFiles: toRepoRelativeFiles(repoRoot, s.sourceFiles),
    }));

    if (isIconsEntry(entry)) {
      symbolEntries.push(
        ...buildIconSymbolEntries(packageName, entry, relativized),
      );
      continue;
    }

    for (const s of relativized) {
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

  return symbolEntries;
}
