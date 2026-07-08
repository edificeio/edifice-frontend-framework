import { Fragment, useEffect, useMemo, useState } from 'react';
import type { ImpactIndex } from '@edifice.io/impact-analyzer';
import { FileGridPanel } from '../components/FileGridPanel.js';
import { FileToggle } from '../components/FileToggle.js';
import { UsageBadge } from '../components/UsageBadge.js';
import { formatEntry, symbolKey } from '../lib/symbol-display.js';

const MAX_ROWS = 200;

export function AppConsumes({
  appName,
  index,
}: {
  appName: string | null;
  index: ImpactIndex;
}) {
  // Hooks must run unconditionally — computed even without a selection
  // (cheap on an empty/no-op appName) rather than gating with an early
  // return above these useMemo calls.
  const allRows = useMemo(() => {
    if (!appName) return [];
    return index.symbols
      .filter((s) => !s.isAggregate)
      .flatMap((s) =>
        s.consumers
          .filter((c) => c.app === appName)
          .map((c) => ({ symbol: s, consumer: c })),
      )
      .sort((a, b) => b.consumer.usageSites - a.consumer.usageSites);
  }, [index, appName]);

  const allCssRows = useMemo(() => {
    if (!appName) return [];
    return index.cssComponents
      .flatMap((c) =>
        c.consumers
          .filter((cc) => cc.app === appName)
          .map((cc) => ({ component: c, consumer: cc })),
      )
      .sort((a, b) => b.consumer.matchCount - a.consumer.matchCount);
  }, [index, appName]);

  // An app can be scanned on several of its own branches (apps.json) — a
  // symbol consumed on both shows up as two rows that otherwise look
  // identical, hence the filter below rather than only the Branche column.
  const branches = useMemo(() => {
    const set = new Set<string>();
    for (const r of allRows) set.add(r.consumer.appBranch);
    for (const r of allCssRows) set.add(r.consumer.appBranch);
    return [...set].sort();
  }, [allRows, allCssRows]);

  const [branchFilter, setBranchFilter] = useState<string>('all');
  useEffect(() => setBranchFilter('all'), [appName]);

  const rows = useMemo(
    () =>
      branchFilter === 'all'
        ? allRows
        : allRows.filter((r) => r.consumer.appBranch === branchFilter),
    [allRows, branchFilter],
  );

  const cssRows = useMemo(
    () =>
      branchFilter === 'all'
        ? allCssRows
        : allCssRows.filter((r) => r.consumer.appBranch === branchFilter),
    [allCssRows, branchFilter],
  );

  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  useEffect(() => setExpanded(new Set()), [appName, index]);

  function toggle(key: string): void {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  if (!appName) {
    return (
      <div className="panel">
        <p className="hint">
          Sélectionnez une app pour voir ce qu'elle consomme.
        </p>
      </div>
    );
  }

  return (
    <div className="panel">
      <h2>{appName}</h2>
      {branches.length > 1 && (
        <select
          className="diff-select"
          aria-label="Filtrer par branche de l'app"
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
        >
          <option value="all">Toutes les branches ({branches.length})</option>
          {branches.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      )}
      <p className="hint">
        {rows.length} symbole(s) JS/TS consommé(s) — {cssRows.length}{' '}
        composant(s) CSS potentiellement concerné(s)
      </p>

      <h3>Symboles JS/TS</h3>
      {rows.length === 0 ? (
        <p className="hint">Aucun usage détecté.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Symbole</th>
              <th>Package</th>
              <th>Branche</th>
              <th>Sites d'usage</th>
              <th>Fichiers</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, MAX_ROWS).map(({ symbol, consumer }) => {
              const key = `js|${symbolKey(symbol)}|${consumer.appBranch}`;
              const isOpen = expanded.has(key);
              return (
                <Fragment key={key}>
                  <tr>
                    <td>{symbol.name}</td>
                    <td>
                      {symbol.package}
                      {formatEntry(symbol.entry)}
                    </td>
                    <td>{consumer.appBranch}</td>
                    <td>{consumer.usageSites}</td>
                    <td>
                      {consumer.files.length === 0 ? (
                        '0'
                      ) : (
                        <FileToggle
                          expanded={isOpen}
                          onToggle={() => toggle(key)}
                          label={`${consumer.files.length} fichier${consumer.files.length > 1 ? 's' : ''}`}
                        />
                      )}
                    </td>
                    <td>
                      {consumer.viaNamespace && (
                        <UsageBadge label="namespace" tone="info" />
                      )}
                    </td>
                  </tr>
                  {isOpen && (
                    <tr className="files-row">
                      <td colSpan={6}>
                        <FileGridPanel
                          fileRef={consumer}
                          files={consumer.files}
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      )}
      {rows.length > MAX_ROWS && (
        <p className="hint">
          {rows.length} résultats, {MAX_ROWS} affichés (triés par sites
          d'usage).
        </p>
      )}

      {cssRows.length > 0 && (
        <>
          <h3>Classes CSS (bootstrap)</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Composant scss</th>
                <th>Pair React</th>
                <th>Branche</th>
                <th>Classes matchées</th>
                <th>Fichiers</th>
                <th>Confiance</th>
              </tr>
            </thead>
            <tbody>
              {cssRows.slice(0, MAX_ROWS).map(({ component, consumer }) => {
                const key = `css|${component.file}|${consumer.appBranch}`;
                const isOpen = expanded.has(key);
                return (
                  <Fragment key={key}>
                    <tr>
                      <td>{component.file}</td>
                      <td>{component.reactPeer ?? '—'}</td>
                      <td>{consumer.appBranch}</td>
                      <td>{consumer.matchedSelectors.join(', ')}</td>
                      <td>
                        {consumer.files.length === 0 ? (
                          '0'
                        ) : (
                          <FileToggle
                            expanded={isOpen}
                            onToggle={() => toggle(key)}
                            label={`${consumer.files.length} fichier${consumer.files.length > 1 ? 's' : ''}`}
                          />
                        )}
                      </td>
                      <td>
                        <UsageBadge
                          label={component.confidence}
                          tone={
                            component.confidence === 'low' ? 'warn' : 'neutral'
                          }
                        />
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="files-row">
                        <td colSpan={6}>
                          <FileGridPanel
                            fileRef={consumer}
                            files={consumer.files}
                          />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
          {cssRows.length > MAX_ROWS && (
            <p className="hint">
              {cssRows.length} résultats, {MAX_ROWS} affichés (triés par classes
              matchées).
            </p>
          )}
        </>
      )}
    </div>
  );
}
