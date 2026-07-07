import { useEffect, useState } from 'react';
import type { DiffReport } from '@edifice.io/impact-analyzer';
import { AppImpactList } from '../components/AppImpactList.js';
import { SeverityBadge } from '../components/SeverityBadge.js';
import type { DiffManifestEntry } from '../data/loadIndex.js';
import { DataUnavailableError, loadDiffReport } from '../data/loadIndex.js';
import { githubPrFileAnchorUrl } from '../lib/github-link.js';
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
  // "Not there yet" (fresh deploy, file mid-sync) — a calm hint, not an error.
  const [unavailable, setUnavailable] = useState(false);
  // symbol key -> deep link into the source PR's "Files changed" tab, for
  // the FF file behind the symbol. Async because the anchor is a
  // crypto.subtle sha256 of the file path.
  const [prAnchors, setPrAnchors] = useState<Map<string, string>>(new Map());

  // Falls back to the first available report when nothing is selected OR
  // when the (deep-linked) selection no longer exists in the manifest —
  // e.g. a URL kept open across a data cleanup. Without this, a stale URL
  // param would strand the user on "report unavailable" forever.
  useEffect(() => {
    if (diffs.length === 0) return;
    const selectionExists =
      selectedFile !== null && diffs.some((d) => d.file === selectedFile);
    if (!selectionExists) onSelectFile(diffs[0].file);
  }, [diffs, selectedFile, onSelectFile]);

  useEffect(() => {
    setPrAnchors(new Map());
    const prUrl = report?.source?.url;
    if (!report || !prUrl) return;
    let cancelled = false;
    Promise.all(
      report.symbolDiffs.map(async (d) => {
        const file = d.sourceFilesHead[0] ?? d.sourceFilesBase[0];
        if (!file) return null;
        const url = await githubPrFileAnchorUrl(prUrl, file);
        return url ? ([symbolKey(d), url] as const) : null;
      }),
    ).then((pairs) => {
      if (!cancelled)
        setPrAnchors(
          new Map(pairs.filter((p): p is NonNullable<typeof p> => p !== null)),
        );
    });
    return () => {
      cancelled = true;
    };
  }, [report]);

  useEffect(() => {
    if (!selectedFile) return;
    setReport(null);
    setError(null);
    setUnavailable(false);
    loadDiffReport(selectedFile)
      .then(setReport)
      .catch((e) => {
        if (e instanceof DataUnavailableError) setUnavailable(true);
        else setError(String(e));
      });
  }, [selectedFile]);

  if (diffs.length === 0) {
    return (
      <p className="hint">
        Pas encore de rapport de diff à afficher. En local :{' '}
        <code>tsx src/cli.ts diff --base=develop</code> à la racine du package,
        puis rechargez cette page.
      </p>
    );
  }

  return (
    <div>
      {/* Always rendered (even when the current report failed to load):
          it's the only way to reach the other reports. */}
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

      {error ? (
        <p className="error">{error}</p>
      ) : unavailable ? (
        <p className="hint">
          Ce rapport n'est pas (ou plus) disponible — les données sont peut-être
          en cours de synchronisation. Rechargez la page dans quelques instants.
        </p>
      ) : !report ? (
        <p className="hint">Chargement du diff...</p>
      ) : (
        <>
          <p className="index-meta">
            {report.base.ref}@{report.base.commit.slice(0, 7)} ..{' '}
            {report.head.ref}@{report.head.commit.slice(0, 7)} — généré le{' '}
            {new Date(report.generatedAt).toLocaleString()}
            {report.source && (
              <>
                {' — '}
                <a href={report.source.url} target="_blank" rel="noreferrer">
                  PR{report.source.number ? ` #${report.source.number}` : ''}
                  {report.source.title ? ` : ${report.source.title}` : ''} ⇗
                </a>
              </>
            )}
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
                      {report.symbolDiffs.slice(0, MAX_ROWS).map((d) => (
                        <tr key={symbolKey(d)}>
                          <td>
                            <SeverityBadge severity={d.severity} />
                          </td>
                          <td>
                            {d.package}
                            {formatEntry(d.entry)} :: {d.name}
                            {prAnchors.has(symbolKey(d)) && (
                              <>
                                {' '}
                                <a
                                  className="pr-anchor"
                                  href={prAnchors.get(symbolKey(d))}
                                  target="_blank"
                                  rel="noreferrer"
                                  title="Voir ce fichier dans les changements de la PR"
                                >
                                  ↗
                                </a>
                              </>
                            )}
                          </td>
                          <td>{d.changeKind}</td>
                          <td>{d.riskScore}</td>
                          <td>
                            <AppImpactList impacts={d.consumers} />
                          </td>
                        </tr>
                      ))}
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
                          <td>
                            {d.consumers ? (
                              <AppImpactList impacts={d.consumers} />
                            ) : (
                              d.affectedApps.join(', ') || '—'
                            )}
                          </td>
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
