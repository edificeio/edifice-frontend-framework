import type { SymbolEntry } from '@edifice.io/impact-analyzer';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WhoUses } from './WhoUses.js';

describe('WhoUses', () => {
  it('shows a hint when no symbol is selected', () => {
    render(<WhoUses symbol={null} branchFilter="all" />);
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

    render(<WhoUses symbol={symbol} branchFilter="all" />);

    const rows = screen.getAllByRole('row').slice(1); // skip header row
    expect(rows[0].textContent).toContain('communities');
    expect(rows[1].textContent).toContain('blog');
  });

  it('filters consumers by the mainline group (develop/dev), excluding squad branches', () => {
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
          app: 'homeworks',
          org: 'edificeio',
          appBranch: 'dev',
          pins: 'dev',
          appCommit: 'y',
          appDirty: false,
          usageSites: 1,
          files: [],
        },
        {
          app: 'blog',
          org: 'edificeio',
          appBranch: 'develop-enabling',
          pins: 'develop-enabling',
          appCommit: 'z',
          appDirty: false,
          usageSites: 5,
          files: [],
        },
      ],
    };

    // The filter is owned by App.tsx (not WhoUses) precisely so switching
    // symbols never resets it — WhoUses only needs to honor whatever value
    // it's handed, "dev" and "develop" folding into the same "develop" group.
    render(<WhoUses symbol={symbol} branchFilter="develop" />);

    const rows = screen.getAllByRole('row').slice(1);
    expect(rows).toHaveLength(2);
    expect(
      rows.some((row) => row.textContent?.includes('develop-enabling')),
    ).toBe(false);
  });

  it('caps the rendered rows and hints at the total when there are many consumers', () => {
    const symbol: SymbolEntry = {
      package: '@edifice.io/react',
      entry: '.',
      name: 'Dropdown',
      kind: 'component',
      sourceFiles: ['a.tsx'],
      consumers: Array.from({ length: 205 }, (_, i) => ({
        app: `app-${i}`,
        org: 'edificeio',
        appBranch: 'develop',
        pins: 'develop',
        appCommit: 'x',
        appDirty: false,
        usageSites: 1,
        files: [],
      })),
    };

    render(<WhoUses symbol={symbol} branchFilter="all" />);

    const rows = screen.getAllByRole('row').slice(1); // skip header row
    expect(rows).toHaveLength(200);
    expect(screen.getByText(/205 résultats, 200 affichés/i)).toBeTruthy();
  });

  it('shows the dirty legend only when at least one consumer is dirty', () => {
    const base = {
      package: '@edifice.io/react',
      entry: '.',
      name: 'Dropdown',
      kind: 'component' as const,
      sourceFiles: ['a.tsx'],
    };
    const consumer = {
      app: 'blog',
      org: 'edificeio',
      appBranch: 'develop',
      pins: 'develop',
      appCommit: 'x',
      usageSites: 2,
      files: [],
    };

    const { rerender } = render(
      <WhoUses
        symbol={{ ...base, consumers: [{ ...consumer, appDirty: false }] }}
        branchFilter="all"
      />,
    );
    expect(screen.queryByText(/modifications non commitées/i)).toBeNull();

    rerender(
      <WhoUses
        symbol={{ ...base, consumers: [{ ...consumer, appDirty: true }] }}
        branchFilter="all"
      />,
    );
    expect(screen.getByText(/modifications non commitées/i)).toBeTruthy();
  });
});
