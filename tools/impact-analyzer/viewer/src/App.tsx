import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ImpactIndex, SymbolEntry } from '@edifice.io/impact-analyzer';
import { ErrorBoundary } from './components/ErrorBoundary.js';
import {
  DataUnavailableError,
  type DiffManifestEntry,
  loadIndexForBranch,
  loadManifest,
} from './data/loadIndex.js';
import { useUrlParam } from './hooks/useUrlParam.js';
import { symbolKey } from './lib/symbol-display.js';
import { SymbolSearch } from './views/SymbolSearch.js';
import { WhoUses } from './views/WhoUses.js';
import { AppSearch } from './views/AppSearch.js';
import { AppConsumes } from './views/AppConsumes.js';
import { DiffView } from './views/DiffView.js';
import './styles.css';

type Tab = 'symbols' | 'apps' | 'diff';

function AppContent() {
  const [branches, setBranches] = useState<string[]>([]);
  const [diffs, setDiffs] = useState<DiffManifestEntry[]>([]);
  const [manifestError, setManifestError] = useState<string | null>(null);
  const [branch, setBranchState] = useState<string | null>(null);
  const [index, setIndex] = useState<ImpactIndex | null>(null);
  const [indexError, setIndexError] = useState<string | null>(null);
  const [selectedSymbol, setSelectedSymbolState] = useState<SymbolEntry | null>(
    null,
  );
  const [selectedApp, setSelectedAppState] = useState<string | null>(null);

  // Deep-linking: the current tab/branch/selection is mirrored in the URL
  // query string, so a link to "who uses Dropdown on develop-enabling" can
  // be pasted straight into a PR/Slack — the whole point of a tool meant to
  // be shown dev <-> QA, not just consulted by its own author.
  const [tabParam, setTabParam] = useUrlParam('tab');
  const [branchParam, setBranchParam] = useUrlParam('branch');
  const [symbolParam, setSymbolParam] = useUrlParam('symbol');
  const [appParam, setAppParam] = useUrlParam('app');
  const [diffParam, setDiffParam] = useUrlParam('diff');

  // Captured once at mount — only used to hydrate initial state once the
  // corresponding data (branches/index) finishes loading, never re-read
  // afterwards (a later user selection must not be overridden by a stale ref).
  const initialBranchFromUrl = useRef(branchParam);
  const initialSymbolFromUrl = useRef(symbolParam);
  const initialAppFromUrl = useRef(appParam);

  const tab: Tab =
    tabParam === 'symbols' || tabParam === 'apps' ? tabParam : 'diff';

  function setTab(next: Tab): void {
    setTabParam(next);
  }

  function setBranch(next: string): void {
    setBranchState(next);
    setBranchParam(next);
  }

  function setSelectedSymbol(next: SymbolEntry | null): void {
    setSelectedSymbolState(next);
    setSymbolParam(next ? symbolKey(next) : null);
  }

  function setSelectedApp(next: string | null): void {
    setSelectedAppState(next);
    setAppParam(next);
  }

  const fetchManifest = useCallback(() => {
    setManifestError(null);
    loadManifest()
      .then((manifest) => {
        setBranches(manifest.branches);
        setDiffs(manifest.diffs);
      })
      .catch((e) => setManifestError(String(e)));
  }, []);

  useEffect(fetchManifest, [fetchManifest]);

  // Resolves the initial branch once the manifest loads: prefer the URL's
  // branch if it's actually valid, otherwise the first one — never
  // force-writes the URL, so a fresh visit stays a clean default URL.
  useEffect(() => {
    if (branches.length === 0 || branch !== null) return;
    const fromUrl = initialBranchFromUrl.current;
    setBranchState(
      fromUrl && branches.includes(fromUrl) ? fromUrl : branches[0],
    );
  }, [branches, branch]);

  const fetchIndex = useCallback(() => {
    if (!branch) return;
    setIndex(null);
    setIndexError(null);
    // Raw setters, not the URL-syncing wrappers — clearing a stale selection
    // must not erase a not-yet-hydrated symbol/app URL param.
    setSelectedSymbolState(null);
    setSelectedAppState(null);
    loadIndexForBranch(branch)
      .then(setIndex)
      .catch((e) =>
        setIndexError(
          e instanceof DataUnavailableError
            ? `Pas encore d'index disponible pour la branche « ${branch} » — les données sont peut-être en cours de synchronisation.`
            : String(e),
        ),
      );
  }, [branch]);

  useEffect(fetchIndex, [fetchIndex]);

  // Resolves the initial symbol selection once the index for the (possibly
  // URL-provided) branch has loaded.
  useEffect(() => {
    if (!index) return;
    const fromUrl = initialSymbolFromUrl.current;
    initialSymbolFromUrl.current = null;
    if (!fromUrl) return;
    const match = index.symbols.find((s) => symbolKey(s) === fromUrl);
    if (match) setSelectedSymbolState(match);
  }, [index]);

  const appNames = useMemo(() => {
    if (!index) return [];
    const names = new Set<string>();
    for (const s of index.symbols)
      for (const c of s.consumers) names.add(c.app);
    for (const c of index.cssComponents)
      for (const cc of c.consumers) names.add(cc.app);
    return [...names].sort();
  }, [index]);

  useEffect(() => {
    // Same guard as the symbol hydration above: the first render has an
    // empty appNames (index not loaded yet) — consuming the ref there would
    // silently drop the deep link.
    if (appNames.length === 0) return;
    const fromUrl = initialAppFromUrl.current;
    initialAppFromUrl.current = null;
    if (fromUrl && appNames.includes(fromUrl)) setSelectedAppState(fromUrl);
  }, [appNames]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Impact Analyzer</h1>
        {/* Selects which branch's INDEX feeds the Symboles/Apps tabs — it has
            no effect on the Diff tab (which has its own report selector), so
            it's hidden there rather than shown as a confusing dead control. */}
        {branches.length > 0 && tab !== 'diff' && (
          <select
            aria-label="Branche du framework"
            value={branch ?? ''}
            onChange={(e) => setBranch(e.target.value)}
          >
            {branches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        )}
        <nav className="tabs" role="tablist" aria-label="Vues">
          <button
            id="tab-symbols"
            role="tab"
            aria-selected={tab === 'symbols'}
            aria-controls="tabpanel"
            className={tab === 'symbols' ? 'tab-active' : ''}
            onClick={() => setTab('symbols')}
          >
            Symboles
          </button>
          <button
            id="tab-apps"
            role="tab"
            aria-selected={tab === 'apps'}
            aria-controls="tabpanel"
            className={tab === 'apps' ? 'tab-active' : ''}
            onClick={() => setTab('apps')}
          >
            Apps
          </button>
          <button
            id="tab-diff"
            role="tab"
            aria-selected={tab === 'diff'}
            aria-controls="tabpanel"
            className={tab === 'diff' ? 'tab-active' : ''}
            onClick={() => setTab('diff')}
          >
            Diff
          </button>
        </nav>
      </header>

      <div id="tabpanel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {manifestError ? (
          // Without a manifest there's neither a branch list nor a diff list —
          // unlike an index error, this genuinely blocks every tab.
          <div className="panel">
            <p className="error">{manifestError}</p>
            <button onClick={fetchManifest}>Réessayer</button>
          </div>
        ) : tab === 'diff' ? (
          // Independent of the index/branch below: diffs come entirely from
          // the manifest, so a broken index for the selected branch must never
          // take down this tab too.
          <DiffView
            diffs={diffs}
            selectedFile={diffParam}
            onSelectFile={setDiffParam}
          />
        ) : branches.length === 0 ? (
          <p className="hint">
            Pas encore de données à afficher — le premier index n'a pas encore
            été généré ou synchronisé. En local : "pnpm --filter
            @edifice.io/impact-analyzer generate:local".
          </p>
        ) : indexError ? (
          <div className="panel">
            <p className="error">{indexError}</p>
            <button onClick={fetchIndex}>Réessayer</button>
          </div>
        ) : !index ? (
          <p className="hint">Chargement de l'index...</p>
        ) : (
          <>
            <p className="index-meta">
              FF {index.ffBranch}@{index.ffCommit.slice(0, 7)}
              {index.ffDirty ? ' (dirty)' : ''} — généré le{' '}
              {new Date(index.generatedAt).toLocaleString()}
              {index.scanErrors.length > 0 &&
                ` — ${index.scanErrors.length} scanError(s)`}
            </p>

            <div className="layout">
              {tab === 'symbols' ? (
                <>
                  <SymbolSearch
                    symbols={index.symbols}
                    selected={selectedSymbol}
                    onSelect={setSelectedSymbol}
                  />
                  <WhoUses symbol={selectedSymbol} />
                </>
              ) : (
                <>
                  <AppSearch
                    appNames={appNames}
                    selected={selectedApp}
                    onSelect={setSelectedApp}
                  />
                  <AppConsumes appName={selectedApp} index={index} />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div className="app-shell">
          <p className="error">
            Une erreur inattendue est survenue : {error.message}
          </p>
          <button onClick={reset}>Réessayer</button>
        </div>
      )}
    >
      <AppContent />
    </ErrorBoundary>
  );
}
