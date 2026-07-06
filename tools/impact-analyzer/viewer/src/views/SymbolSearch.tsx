import { useCallback, useMemo, useState } from 'react';
import type { SymbolEntry } from '@edifice.io/impact-analyzer';
import { PackageFilter } from '../components/PackageFilter.js';
import { SearchList } from '../components/SearchList.js';
import { UsageBadge } from '../components/UsageBadge.js';
import { formatEntry, symbolKey } from '../lib/symbol-display.js';

export interface SymbolSearchProps {
  symbols: SymbolEntry[];
  selected: SymbolEntry | null;
  onSelect: (symbol: SymbolEntry) => void;
}

const MAX_RESULTS = 200;

function totalUsage(symbol: SymbolEntry): number {
  return symbol.consumers.reduce((sum, c) => sum + c.usageSites, 0);
}

export function SymbolSearch({
  symbols,
  selected,
  onSelect,
}: SymbolSearchProps) {
  const [packageFilter, setPackageFilter] = useState('all');

  const packages = useMemo(
    () => [...new Set(symbols.map((s) => s.package))].sort(),
    [symbols],
  );

  // Sorted once up front — SearchList only filters/caps, it never reorders,
  // so "top 200 by usage among the matches" falls out for free.
  const sorted = useMemo(
    () => [...symbols].sort((a, b) => totalUsage(b) - totalUsage(a)),
    [symbols],
  );
  const byPackage = useMemo(
    () =>
      packageFilter === 'all'
        ? sorted
        : sorted.filter((s) => s.package === packageFilter),
    [sorted, packageFilter],
  );

  const matches = useCallback(
    (s: SymbolEntry, q: string) =>
      s.name.toLowerCase().includes(q) || s.package.toLowerCase().includes(q),
    [],
  );

  return (
    <div className="panel">
      <h2>Symboles ({symbols.length})</h2>
      <SearchList
        items={byPackage}
        getKey={symbolKey}
        isSelected={(s) =>
          selected !== null && symbolKey(s) === symbolKey(selected)
        }
        onSelect={onSelect}
        matches={matches}
        renderItem={(s) => (
          <>
            <span className="result-name">{s.name}</span>
            <span className="result-meta">
              {s.package}
              {formatEntry(s.entry)}
            </span>
            <UsageBadge label={s.kind} />
            {s.isAggregate && (
              <UsageBadge label={`${s.aggregateCount} icônes`} tone="info" />
            )}
            <span className="result-count">{totalUsage(s)} usages</span>
          </>
        )}
        placeholder="Rechercher un symbole ou un package..."
        inputId="symbol-search-input"
        maxItems={MAX_RESULTS}
        debounceMs={150}
        extraControl={
          <PackageFilter
            packages={packages}
            value={packageFilter}
            onChange={setPackageFilter}
          />
        }
      />
    </div>
  );
}
