import { useEffect, useState } from 'react';
import type { DiffReport } from '@edifice.io/impact-analyzer';
import { SeverityBadge } from '../components/SeverityBadge.js';
import type { DiffManifestEntry } from '../data/loadIndex.js';
import { loadDiffReport } from '../data/loadIndex.js';
import { formatEntry, symbolKey } from '../lib/symbol-display.js';

export interface DiffViewProps {
  diffs: DiffManifestEntry[];
  /** Controlled, like SymbolSearch/AppSearch — lets App.tsx mirror it in the URL for shareable links. */
  selectedFile: string | null;
  onSelectFile: (file: string) => void;
}

const MAX_ROWS = 200;

export function DiffView({ diffs, selectedFile, onSelectFile }: DiffViewProps) {
  const [report, setReport] = useState<DiffReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedFile && diffs[0]) onSelectFile(diffs[0].file);
  }, [diffs, selectedFile, onSelectFile]);

  useEffect(() => {
    if (!selectedFile) return;
    setReport(null);
    setError(null);
    loadDiffReport(selectedFile)
      .then(setReport)
      .catch((e) => setError(String(e)));
  }, [selectedFile]);

  if (diffs.length === 0) {
    return (
      <p className="hint">
        Aucun diff généré — lancez{' '}
        <code>tsx src/cli.ts diff --base=develop</code> à la racine du package,
        puis rechargez cette page.
      </p>
    );
  }

  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      {diffs.length > 1 && (
        <select
          className="diff-select"
          value={selectedFile ?? ''}
          onChange={(e) => onSelectFile(e.target.value)}
        >
          {diffs.map((d) => (
            <option key={d.file} value={d.file}>
              {d.base} .. {d.head}
            </option>
          ))}
        </select>
      )}

      {!report ? (
        <p className="hint">Chargement du diff...</p>
      ) : (
        <>
          <p className="index-meta">
            {report.base.ref}@{report.base.commit.slice(0, 7)} ..{' '}
            {report.head.ref}@{report.head.commit.slice(0, 7)} — généré le{' '}
            {new Date(report.generatedAt).toLocaleString()}
          </p>

          {report.symbolDiffs.length === 0 && report.cssDiffs.length === 0 ? (
            <p className="hint">
              Aucun changement risqué détecté entre ces deux références.
            </p>
          ) : (
            <>
              {report.symbolDiffs.length > 0 && (
                <div className="panel">
                  <h2>Symboles ({report.symbolDiffs.length})</h2>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Symbole</th>
                        <th>Changement</th>
                        <th>Risque</th>
                        <th>Apps touchées</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.symbolDiffs.slice(0, MAX_ROWS).map((d) => {
                        const apps = [
                          ...new Set(d.consumers.map((c) => c.app)),
                        ];
                        return (
                          <tr key={symbolKey(d)}>
                            <td>
                              <SeverityBadge severity={d.severity} />
                            </td>
                            <td>
                              {d.package}
                              {formatEntry(d.entry)} :: {d.name}
                            </td>
                            <td>{d.changeKind}</td>
                            <td>{d.riskScore}</td>
                            <td>{apps.join(', ') || '—'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {report.symbolDiffs.length > MAX_ROWS && (
                    <p className="hint">
                      {report.symbolDiffs.length} résultats, {MAX_ROWS} affichés
                      (triés par risque).
                    </p>
                  )}
                </div>
              )}

              {report.cssDiffs.length > 0 && (
                <div className="panel">
                  <h2>CSS ({report.cssDiffs.length})</h2>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Fichier</th>
                        <th>Scope</th>
                        <th>Risque</th>
                        <th>Apps touchées</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.cssDiffs.slice(0, MAX_ROWS).map((d) => (
                        <tr key={d.file}>
                          <td>
                            <SeverityBadge severity={d.severity} />
                          </td>
                          <td>{d.file}</td>
                          <td>
                            {d.scope}
                            {d.globalScope ? ` (${d.globalScope})` : ''}
                          </td>
                          <td>{d.riskScore}</td>
                          <td>{d.affectedApps.join(', ') || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {report.cssDiffs.length > MAX_ROWS && (
                    <p className="hint">
                      {report.cssDiffs.length} résultats, {MAX_ROWS} affichés
                      (triés par risque).
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {report.scanErrors.length > 0 && (
            <p className="hint">
              {report.scanErrors.length} scanError(s) lors du calcul de l'état
              head — les données touchées peuvent être incomplètes.
            </p>
          )}
        </>
      )}
    </div>
  );
}
