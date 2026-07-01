export interface KnownFfEntry {
  package: string;
  entry: string;
}

/** Builds the set of (package, entry) pairs actually declared by the FF's `exports` fields. */
export function buildKnownEntrySet(entries: KnownFfEntry[]): Set<string> {
  return new Set(entries.map((e) => `${e.package}|${e.entry}`));
}

/**
 * An import is "out of contract" when its normalized (package, entry) isn't
 * one of the FF's declared `exports` subpaths — e.g. a deep import into
 * `@edifice.io/react/dist/internal/...`. Such imports depend on an
 * implementation detail the FF never promised to keep stable (plan §5.1).
 */
export function isEntryInContract(
  knownEntries: Set<string>,
  packageName: string,
  entry: string,
): boolean {
  return knownEntries.has(`${packageName}|${entry}`);
}

/** Reconstructs a human-readable import path from a normalized (package, entry) pair. */
export function toImportPath(packageName: string, entry: string): string {
  return entry === '.' ? packageName : `${packageName}${entry.slice(1)}`;
}
