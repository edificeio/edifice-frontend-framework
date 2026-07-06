import type { SymbolEntry } from '@edifice.io/impact-analyzer';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WhoUses } from './WhoUses.js';

describe('WhoUses', () => {
  it('shows a hint when no symbol is selected', () => {
    render(<WhoUses symbol={null} />);
    expect(screen.getByText(/sélectionnez un symbole/i)).toBeTruthy();
  });

  it('lists consumers sorted by usage sites descending', () => {
    const symbol: SymbolEntry = {
      package: '@edifice.io/react',
      entry: '.',
      name: 'Dropdown',
      kind: 'component',
      sourceFiles: ['a.tsx'],
      consumers: [
        {
          app: 'blog',
          org: 'edificeio',
          appBranch: 'develop',
          pins: 'develop',
          appCommit: 'x',
          appDirty: false,
          usageSites: 2,
          files: [],
        },
        {
          app: 'communities',
          org: 'edificeio',
          appBranch: 'develop',
          pins: 'develop',
          appCommit: 'y',
          appDirty: false,
          usageSites: 9,
          files: [],
        },
      ],
    };

    render(<WhoUses symbol={symbol} />);

    const rows = screen.getAllByRole('row').slice(1); // skip header row
    expect(rows[0].textContent).toContain('communities');
    expect(rows[1].textContent).toContain('blog');
  });
});
