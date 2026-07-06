import { useMemo, useState } from 'react';

export interface AppSearchProps {
  appNames: string[];
  selected: string | null;
  onSelect: (appName: string) => void;
}

export function AppSearch({ appNames, selected, onSelect }: AppSearchProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? appNames.filter((a) => a.toLowerCase().includes(q)) : appNames;
  }, [appNames, query]);

  return (
    <div className="panel">
      <h2>Apps ({appNames.length})</h2>
      <label htmlFor="app-search-input" className="visually-hidden">
        Rechercher une app
      </label>
      <input
        id="app-search-input"
        className="search-input"
        placeholder="Rechercher une app..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul className="result-list">
        {filtered.map((app) => (
          <li key={app}>
            <button
              className={`result-item${selected === app ? ' result-item-selected' : ''}`}
              onClick={() => onSelect(app)}
            >
              <span className="result-name">{app}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
