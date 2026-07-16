import { useCallback } from 'react';
import { SearchList } from '../components/SearchList.js';

export interface AppSearchProps {
  appNames: string[];
  selected: string | null;
  onSelect: (appName: string) => void;
}

export function AppSearch({ appNames, selected, onSelect }: AppSearchProps) {
  const matches = useCallback(
    (app: string, q: string) => app.toLowerCase().includes(q),
    [],
  );

  return (
    <div className="panel">
      <h2>Apps ({appNames.length})</h2>
      <SearchList
        items={appNames}
        getKey={(app) => app}
        isSelected={(app) => selected === app}
        onSelect={onSelect}
        matches={matches}
        renderItem={(app) => <span className="result-name">{app}</span>}
        placeholder="Rechercher une app..."
        inputId="app-search-input"
      />
    </div>
  );
}
