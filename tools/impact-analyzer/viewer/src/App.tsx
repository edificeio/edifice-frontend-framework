import { useEffect, useMemo, useState } from 'react';
import type { ImpactIndex, SymbolEntry } from '@edifice.io/impact-analyzer';
import {
  type DiffManifestEntry,
  loadIndexForBranch,
  loadManifest,
} from './data/loadIndex.js';
import { SymbolSearch } from './views/SymbolSearch.js';
import { WhoUses } from './views/WhoUses.js';
import { AppSearch } from './views/AppSearch.js';
import { AppConsumes } from './views/AppConsumes.js';
import { DiffView } from './views/DiffView.js';
import './styles.css';

type Tab = 'symbols' | 'apps' | 'diff';

export function App() {
  const [branches, setBranches] = useState<string[]>([]);
  const [diffs, setDiffs] = useState<DiffManifestEntry[]>([]);
  const [branch, setBranch] = useState<string | null>(null);
  const [index, setIndex] = useState<ImpactIndex | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('diff');
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolEntry | null>(
    null,
  );
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  useEffect(() => {
    loadManifest()
      .then((manifest) => {
        setBranches(manifest.branches);
        setDiffs(manifest.diffs);
        if (manifest.branches.length > 0) setBranch(manifest.branches[0]);
      })
      .catch((e) => setError(String(e)));
  }, []);

  useEffect(() => {
    if (!branch) return;
    setIndex(null);
    setSelectedSymbol(null);
    setSelectedApp(null);
    loadIndexForBranch(branch)
      .then(setIndex)
      .catch((e) => setError(String(e)));
  }, [branch]);

  const appNames = useMemo(() => {
    if (!index) return [];
    const names = new Set<string>();
    for (const s of index.symbols)
      for (const c of s.consumers) names.add(c.app);
    for (const c of index.cssComponents)
      for (const cc of c.consumers) names.add(cc.app);
    return [...names].sort();
  }, [index]);

  if (error) {
    return (
      <div className="app-shell">
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Impact Analyzer</h1>
        {branches.length > 0 && (
          <select
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
        <nav className="tabs">
          <button
            className={tab === 'symbols' ? 'tab-active' : ''}
            onClick={() => setTab('symbols')}
          >
            Symboles
          </button>
          <button
            className={tab === 'apps' ? 'tab-active' : ''}
            onClick={() => setTab('apps')}
          >
            Apps
          </button>
          <button
            className={tab === 'diff' ? 'tab-active' : ''}
            onClick={() => setTab('diff')}
          >
            Diff
          </button>
        </nav>
      </header>

      {tab === 'diff' ? (
        <DiffView diffs={diffs} />
      ) : branches.length === 0 ? (
        <p className="hint">
          Aucun index trouvé — lancez "pnpm --filter @edifice.io/impact-analyzer
          generate:local".
        </p>
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
  );
}
