import type { SymbolEntry } from '@edifice.io/impact-analyzer';
import { UsageBadge } from '../components/UsageBadge.js';

export function WhoUses({ symbol }: { symbol: SymbolEntry | null }) {
  if (!symbol) {
    return (
      <div className="panel">
        <p className="hint">Sélectionnez un symbole pour voir qui l'utilise.</p>
      </div>
    );
  }

  const sortedConsumers = [...symbol.consumers].sort(
    (a, b) => b.usageSites - a.usageSites,
  );

  return (
    <div className="panel">
      <h2>
        {symbol.name} <UsageBadge label={symbol.kind} />
      </h2>
      <p className="hint">
        {symbol.package}
        {symbol.entry !== '.' ? symbol.entry.slice(1) : ''} —{' '}
        {symbol.sourceFiles.length} fichier(s) source
      </p>

      {sortedConsumers.length === 0 ? (
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
            {sortedConsumers.map((c) => (
              <tr key={`${c.app}-${c.appBranch}`}>
                <td>{c.app}</td>
                <td>{c.appBranch}</td>
                <td>{c.pins}</td>
                <td>{c.usageSites}</td>
                <td>{c.files.length}</td>
                <td>
                  {c.appDirty && <UsageBadge label="dirty" tone="warn" />}
                  {c.viaNamespace && (
                    <UsageBadge label="namespace" tone="info" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
