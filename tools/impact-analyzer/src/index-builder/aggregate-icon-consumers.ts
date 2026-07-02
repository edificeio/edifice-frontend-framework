import type { SymbolEntry } from '../types/index-schema.js';

/**
 * For icon subpaths, symbol-extractor + icons-aggregator already produce
 * one SymbolEntry per icon PLUS a synthetic aggregate entry — but only the
 * individual entries get consumers attached during the main pass (each
 * usage resolves to a specific icon name). This rolls per-app usage of the
 * individual icons up into the aggregate, so the viewer's default grouped
 * view isn't silently empty. Shared by buildLocalIndex and buildCiIndex.
 */
export function aggregateIconConsumers(symbols: SymbolEntry[]): void {
  const aggregatesByKey = new Map<string, SymbolEntry>();
  for (const s of symbols) {
    if (s.isAggregate) aggregatesByKey.set(`${s.package}|${s.entry}`, s);
  }
  if (aggregatesByKey.size === 0) return;

  for (const s of symbols) {
    if (s.isAggregate) continue;
    const aggregate = aggregatesByKey.get(`${s.package}|${s.entry}`);
    if (!aggregate) continue;

    for (const consumer of s.consumers) {
      const existing = aggregate.consumers.find(
        (c) => c.app === consumer.app && c.appBranch === consumer.appBranch,
      );
      if (existing) {
        existing.usageSites += consumer.usageSites;
        existing.files = [...new Set([...existing.files, ...consumer.files])];
      } else {
        aggregate.consumers.push({ ...consumer, files: [...consumer.files] });
      }
    }
  }
}
