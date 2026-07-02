import { useEffect, useState } from 'react';
import type { DiffReport } from '@edifice.io/impact-analyzer';
import { SeverityBadge } from '../components/SeverityBadge.js';
import type { DiffManifestEntry } from '../data/loadIndex.js';
import { loadDiffReport } from '../data/loadIndex.js';

export interface DiffViewProps {
  diffs: DiffManifestEntry[];
}

export function DiffView({ diffs }: DiffViewProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [report, setReport] = useState<DiffReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedFile((current) => current ?? diffs[0]?.file ?? null);
  }, [diffs]);

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
          onChange={(e) => setSelectedFile(e.target.value)}
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
                      {report.symbolDiffs.map((d) => {
                        const apps = [
                          ...new Set(d.consumers.map((c) => c.app)),
                        ];
                        return (
                          <tr key={`${d.package}|${d.entry}|${d.name}`}>
                            <td>
                              <SeverityBadge severity={d.severity} />
                            </td>
                            <td>
                              {d.package}
                              {d.entry !== '.' ? d.entry.slice(1) : ''} ::{' '}
                              {d.name}
                            </td>
                            <td>{d.changeKind}</td>
                            <td>{d.riskScore}</td>
                            <td>{apps.join(', ') || '—'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
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
                      {report.cssDiffs.map((d) => (
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
