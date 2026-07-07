import { Fragment, useEffect, useState, type ReactNode } from 'react';
import type { DiffReport } from '@edifice.io/impact-analyzer';
import { FileGridPanel } from '../components/FileGridPanel.js';
import { FileToggle } from '../components/FileToggle.js';
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

interface ImpactConsumer {
  app: string;
  appBranch: string;
  org?: string;
  repo?: string;
  appCommit?: string;
  files?: string[];
}

/**
 * "Apps touchées" cell: one toggle per (app, branch) controlling a
 * full-width FileGridPanel sub-row — reports without denormalized files
 * (written before that field existed) fall back to the compact app list.
 */
function AppToggleCell({
  consumers,
  keyPrefix,
  expanded,
  onToggle,
}: {
  consumers: ImpactConsumer[];
  keyPrefix: string;
  expanded: Set<string>;
  onToggle: (key: string) => void;
}) {
  if (consumers.length === 0) return <>—</>;
  if (consumers.every((c) => !c.files || c.files.length === 0)) {
    return <>{[...new Set(consumers.map((c) => c.app))].join(', ')}</>;
  }
  return (
    <ul className="app-impacts">
      {consumers.map((c) => {
        const key = `${keyPrefix}|${c.app}|${c.appBranch}`;
        const label = (
          <>
            <span className="app-impact-name">{c.app}</span>
            <span className="app-impact-meta">
              {' '}
              ({c.appBranch})
              {c.files && c.files.length > 0
                ? ` · ${c.files.length} fichier${c.files.length > 1 ? 's' : ''}`
                : ''}
            </span>
          </>
        );
        return (
          <li key={key}>
            {c.files && c.files.length > 0 ? (
              <FileToggle
                expanded={expanded.has(key)}
                onToggle={() => onToggle(key)}
                label={label}
              />
            ) : (
              <span>{label}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** Full-width sub-rows for every expanded app of one table row. */
function expandedFileRows(
  consumers: ImpactConsumer[],
  keyPrefix: string,
  expanded: Set<string>,
  colSpan: number,
): ReactNode[] {
  return consumers
    .filter((c) => {
      const key = `${keyPrefix}|${c.app}|${c.appBranch}`;
      return expanded.has(key) && c.files && c.files.length > 0;
    })
    .map((c) => (
      <tr
        className="files-row"
        key={`${keyPrefix}|${c.app}|${c.appBranch}|files`}
      >
        <td colSpan={colSpan}>
          <FileGridPanel
            fileRef={c}
            files={c.files ?? []}
            title={`${c.app} (${c.appBranch})`}
          />
        </td>
      </tr>
    ));
}

export function DiffView({ diffs, selectedFile, onSelectFile }: DiffViewProps) {
  const [report, setReport] = useState<DiffReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  // "Not there yet" (fresh deploy, file mid-sync) — a calm hint, not an error.
  const [unavailable, setUnavailable] = useState(false);
  // symbol key -> deep link into the source PR's "Files changed" tab, for
  // the FF file behind the symbol. Async because the anchor is a
  // crypto.subtle sha256 of the file path.
  const [prAnchors, setPrAnchors] = useState<Map<string, string>>(new Map());
  // (row key)|(app)|(branch) -> the app's files sub-row is open.
  const [expandedApps, setExpandedApps] = useState<Set<string>>(new Set());

  useEffect(() => setExpandedApps(new Set()), [report]);

  function toggleApp(key: string): void {
    setExpandedApps((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

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
              {d.base} → {d.head}
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
          {/* base → head as chips: the arrow reads as "what changed between
              the released base and this head", where ".." read as nothing. */}
          <div className="diff-meta">
            <span className="ref-chip">
              {report.base.ref}
              <span className="ref-chip-commit">
                @{report.base.commit.slice(0, 7)}
              </span>
            </span>
            <span className="diff-arrow" aria-label="vers">
              →
            </span>
            <span className="ref-chip">
              {report.head.ref}
              <span className="ref-chip-commit">
                @{report.head.commit.slice(0, 7)}
              </span>
            </span>
            {report.source && (
              <a
                className="pr-chip"
                href={report.source.url}
                target="_blank"
                rel="noreferrer"
                title={report.source.title ?? undefined}
              >
                PR{report.source.number ? ` #${report.source.number}` : ''}
                {report.source.title && (
                  <span className="pr-chip-title">{report.source.title}</span>
                )}
                <span aria-hidden="true"> ⤴</span>
              </a>
            )}
            <span className="diff-date">
              généré le {new Date(report.generatedAt).toLocaleString()}
            </span>
          </div>

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
                        <Fragment key={symbolKey(d)}>
                          <tr>
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
                              <AppToggleCell
                                consumers={d.consumers}
                                keyPrefix={symbolKey(d)}
                                expanded={expandedApps}
                                onToggle={toggleApp}
                              />
                            </td>
                          </tr>
                          {expandedFileRows(
                            d.consumers,
                            symbolKey(d),
                            expandedApps,
                            5,
                          )}
                        </Fragment>
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
                        <Fragment key={d.file}>
                          <tr>
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
                                <AppToggleCell
                                  consumers={d.consumers}
                                  keyPrefix={`css|${d.file}`}
                                  expanded={expandedApps}
                                  onToggle={toggleApp}
                                />
                              ) : (
                                d.affectedApps.join(', ') || '—'
                              )}
                            </td>
                          </tr>
                          {d.consumers
                            ? expandedFileRows(
                                d.consumers,
                                `css|${d.file}`,
                                expandedApps,
                                5,
                              )
                            : null}
                        </Fragment>
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
