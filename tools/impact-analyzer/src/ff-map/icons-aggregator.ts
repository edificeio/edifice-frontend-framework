import type { SymbolEntry } from '../types/index-schema.js';
import type { ExtractedSymbol } from './symbol-extractor.js';

export function isIconsEntry(entry: string): boolean {
  return entry === './icons' || entry.startsWith('./icons/');
}

/**
 * Icon subpaths expose ~200 generated components (plan §5.1). Rather than
 * choosing between "searchable by exact icon name" and "not drowning the
 * report", produce both: one SymbolEntry per icon (search still works),
 * plus one synthetic aggregate entry the viewer can show by default.
 */
export function buildIconSymbolEntries(
  packageName: string,
  entry: string,
  symbols: ExtractedSymbol[],
): SymbolEntry[] {
  const individual: SymbolEntry[] = symbols.map((s) => ({
    package: packageName,
    entry,
    name: s.name,
    kind: s.kind,
    sourceFiles: s.sourceFiles,
    consumers: [],
  }));

  const aggregate: SymbolEntry = {
    package: packageName,
    entry,
    name: `icons (${entry})`,
    kind: 'component',
    sourceFiles: [...new Set(symbols.flatMap((s) => s.sourceFiles))],
    isAggregate: true,
    aggregateCount: symbols.length,
    consumers: [],
  };

  return [...individual, aggregate];
}
