import { useMemo } from 'react';
import type { ImpactIndex } from '@edifice.io/impact-analyzer';
import { UsageBadge } from '../components/UsageBadge.js';

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
  const rows = useMemo(() => {
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

  const cssRows = useMemo(() => {
    if (!appName) return [];
    return index.cssComponents
      .flatMap((c) =>
        c.consumers
          .filter((cc) => cc.app === appName)
          .map((cc) => ({ component: c, consumer: cc })),
      )
      .sort((a, b) => b.consumer.matchCount - a.consumer.matchCount);
  }, [index, appName]);

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
              <th>Sites d'usage</th>
              <th>Fichiers</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, MAX_ROWS).map(({ symbol, consumer }) => (
              <tr key={`${symbol.package}-${symbol.entry}-${symbol.name}`}>
                <td>{symbol.name}</td>
                <td>
                  {symbol.package}
                  {symbol.entry !== '.' ? symbol.entry.slice(1) : ''}
                </td>
                <td>{consumer.usageSites}</td>
                <td>{consumer.files.length}</td>
                <td>
                  {consumer.viaNamespace && (
                    <UsageBadge label="namespace" tone="info" />
                  )}
                </td>
              </tr>
            ))}
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
                <th>Classes matchées</th>
                <th>Confiance</th>
              </tr>
            </thead>
            <tbody>
              {cssRows.slice(0, MAX_ROWS).map(({ component, consumer }) => (
                <tr key={component.file}>
                  <td>{component.file}</td>
                  <td>{component.reactPeer ?? '—'}</td>
                  <td>{consumer.matchedSelectors.join(', ')}</td>
                  <td>
                    <UsageBadge
                      label={component.confidence}
                      tone={component.confidence === 'low' ? 'warn' : 'neutral'}
                    />
                  </td>
                </tr>
              ))}
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
