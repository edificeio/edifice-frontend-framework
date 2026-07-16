import { Fragment, useEffect, useMemo, useState } from 'react';
import type { SymbolEntry } from '@edifice.io/impact-analyzer';
import { FileGridPanel } from '../components/FileGridPanel.js';
import { FileToggle } from '../components/FileToggle.js';
import { UsageBadge } from '../components/UsageBadge.js';
import { formatEntry } from '../lib/symbol-display.js';
import { branchGroupKey, branchGroupLabel } from '../lib/branch-group.js';

export function WhoUses({ symbol }: { symbol: SymbolEntry | null }) {
  // Hooks must run unconditionally, before the early return below.
  const sortedConsumers = useMemo(
    () =>
      [...(symbol?.consumers ?? [])].sort(
        (a, b) => b.usageSites - a.usageSites,
      ),
    [symbol],
  );

  // Grouped by role (develop/dev vs develop-enabling), not by raw branch
  // name — spans every consuming app, unlike the per-app Apps tab, so the
  // naming mismatch across repos (apps.json) actually shows up here.
  const branchGroups = useMemo(() => {
    const set = new Set<string>();
    for (const c of sortedConsumers) set.add(branchGroupKey(c.appBranch));
    return [...set].sort();
  }, [sortedConsumers]);

  const [branchFilter, setBranchFilter] = useState<string>('all');
  useEffect(() => setBranchFilter('all'), [symbol]);

  const filteredConsumers = useMemo(
    () =>
      branchFilter === 'all'
        ? sortedConsumers
        : sortedConsumers.filter(
            (c) => branchGroupKey(c.appBranch) === branchFilter,
          ),
    [sortedConsumers, branchFilter],
  );

  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  useEffect(() => setExpanded(new Set()), [symbol]);

  function toggle(key: string): void {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  if (!symbol) {
    return (
      <div className="panel">
        <p className="hint">Sélectionnez un symbole pour voir qui l'utilise.</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <h2>
        {symbol.name} <UsageBadge label={symbol.kind} />
      </h2>
      {branchGroups.length > 1 && (
        <select
          className="diff-select"
          aria-label="Filtrer par branche"
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
        >
          <option value="all">
            Toutes les branches ({branchGroups.length})
          </option>
          {branchGroups.map((g) => (
            <option key={g} value={g}>
              {branchGroupLabel(g)}
            </option>
          ))}
        </select>
      )}
      <p className="hint">
        {symbol.package}
        {formatEntry(symbol.entry)} — {symbol.sourceFiles.length} fichier(s)
        source
      </p>

      {filteredConsumers.length === 0 ? (
        <p className="hint">Aucune app connue n'utilise ce symbole.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>App</th>
              <th>Branche</th>
              <th>Pin FF</th>
              <th>Sites d'usage</th>
              <th>Fichiers</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredConsumers.map((c) => {
              const key = `${c.app}-${c.appBranch}`;
              const isOpen = expanded.has(key);
              return (
                <Fragment key={key}>
                  <tr>
                    <td>{c.app}</td>
                    <td>{c.appBranch}</td>
                    <td>{c.pins}</td>
                    <td>{c.usageSites}</td>
                    <td>
                      {c.files.length === 0 ? (
                        '0'
                      ) : (
                        <FileToggle
                          expanded={isOpen}
                          onToggle={() => toggle(key)}
                          label={`${c.files.length} fichier${c.files.length > 1 ? 's' : ''}`}
                        />
                      )}
                    </td>
                    <td>
                      {c.appDirty && <UsageBadge label="dirty" tone="warn" />}
                      {c.viaNamespace && (
                        <UsageBadge label="namespace" tone="info" />
                      )}
                    </td>
                  </tr>
                  {isOpen && (
                    <tr className="files-row">
                      <td colSpan={6}>
                        <FileGridPanel fileRef={c} files={c.files} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Contextual legend — only when at least one row carries the badge. */}
      {filteredConsumers.some((c) => c.appDirty) && (
        <p className="hint legend">
          <UsageBadge label="dirty" tone="warn" /> : le repo de cette app avait
          des modifications non commitées au moment du scan (index généré en
          local) — les chiffres reflètent l'état du disque, pas exactement le
          commit enregistré, et les liens GitHub peuvent être décalés. Jamais le
          cas sur l'index publié par la CI (clones frais).
        </p>
      )}
    </div>
  );
}
