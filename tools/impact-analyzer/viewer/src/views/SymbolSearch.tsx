import { useMemo, useState } from 'react';
import type { SymbolEntry } from '@edifice.io/impact-analyzer';
import { PackageFilter } from '../components/PackageFilter.js';
import { UsageBadge } from '../components/UsageBadge.js';

export interface SymbolSearchProps {
  symbols: SymbolEntry[];
  selected: SymbolEntry | null;
  onSelect: (symbol: SymbolEntry) => void;
}

function totalUsage(symbol: SymbolEntry): number {
  return symbol.consumers.reduce((sum, c) => sum + c.usageSites, 0);
}

export function SymbolSearch({
  symbols,
  selected,
  onSelect,
}: SymbolSearchProps) {
  const [query, setQuery] = useState('');
  const [packageFilter, setPackageFilter] = useState('all');

  const packages = useMemo(
    () => [...new Set(symbols.map((s) => s.package))].sort(),
    [symbols],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const byPackage =
      packageFilter === 'all'
        ? symbols
        : symbols.filter((s) => s.package === packageFilter);
    const matches = q
      ? byPackage.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.package.toLowerCase().includes(q),
        )
      : byPackage;

    return [...matches].sort((a, b) => totalUsage(b) - totalUsage(a));
  }, [symbols, query, packageFilter]);

  return (
    <div className="panel">
      <h2>Symboles ({symbols.length})</h2>
      <div className="filter-row">
        <input
          className="search-input"
          placeholder="Rechercher un symbole ou un package..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <PackageFilter
          packages={packages}
          value={packageFilter}
          onChange={setPackageFilter}
        />
      </div>
      <ul className="result-list">
        {filtered.slice(0, 200).map((s) => {
          const key = `${s.package}|${s.entry}|${s.name}`;
          const isSelected =
            selected &&
            `${selected.package}|${selected.entry}|${selected.name}` === key;
          return (
            <li key={key}>
              <button
                className={`result-item${isSelected ? ' result-item-selected' : ''}`}
                onClick={() => onSelect(s)}
              >
                <span className="result-name">{s.name}</span>
                <span className="result-meta">
                  {s.package}
                  {s.entry !== '.' ? s.entry.slice(1) : ''}
                </span>
                <UsageBadge label={s.kind} />
                {s.isAggregate && (
                  <UsageBadge
                    label={`${s.aggregateCount} icônes`}
                    tone="info"
                  />
                )}
                <span className="result-count">{totalUsage(s)} usages</span>
              </button>
            </li>
          );
        })}
      </ul>
      {filtered.length > 200 && (
        <p className="hint">
          Affinez la recherche — {filtered.length} résultats, 200 affichés.
        </p>
      )}
    </div>
  );
}
