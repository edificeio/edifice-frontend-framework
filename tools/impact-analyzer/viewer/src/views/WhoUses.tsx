import { Fragment, useEffect, useMemo, useState } from 'react';
import type { SymbolEntry } from '@edifice.io/impact-analyzer';
import { FileGridPanel } from '../components/FileGridPanel.js';
import { FileToggle } from '../components/FileToggle.js';
import { UsageBadge } from '../components/UsageBadge.js';
import { formatEntry } from '../lib/symbol-display.js';
import { branchGroupKey } from '../lib/branch-group.js';

const MAX_ROWS = 200;

export function WhoUses({
  symbol,
  branchFilter,
}: {
  symbol: SymbolEntry | null;
  /**
   * Owned by App.tsx (spans every symbol, unlike the per-symbol data below)
   * so switching symbols never resets it — see the branch-filter select
   * next to the tab layout, not rendered in here.
   */
  branchFilter: string;
}) {
  // Hooks must run unconditionally, before the early return below.
  const sortedConsumers = useMemo(
    () =>
      [...(symbol?.consumers ?? [])].sort(
        (a, b) => b.usageSites - a.usageSites,
      ),
    [symbol],
  );

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
            {filteredConsumers.slice(0, MAX_ROWS).map((c) => {
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
      {filteredConsumers.length > MAX_ROWS && (
        <p className="hint">
          {filteredConsumers.length} résultats, {MAX_ROWS} affichés (triés par
          sites d'usage).
        </p>
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
