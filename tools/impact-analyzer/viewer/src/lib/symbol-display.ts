import type { SymbolEntry } from '@edifice.io/impact-analyzer';

/** Canonical identity key for a symbol — was reconstructed ad hoc (with an inconsistent separator in one place) across App.tsx, SymbolSearch, DiffView and AppConsumes. */
export function symbolKey(
  s: Pick<SymbolEntry, 'package' | 'entry' | 'name'>,
): string {
  return `${s.package}|${s.entry}|${s.name}`;
}

/** Renders an exports subpath for display: "." (the package root) shows as nothing, "./icons/nav" as "/icons/nav". */
export function formatEntry(entry: string): string {
  return entry === '.' ? '' : entry.slice(1);
}
