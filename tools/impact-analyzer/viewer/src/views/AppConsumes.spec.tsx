import type { ImpactIndex } from '@edifice.io/impact-analyzer';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppConsumes } from './AppConsumes.js';

function makeIndex(overrides: Partial<ImpactIndex> = {}): ImpactIndex {
  return {
    schemaVersion: 1,
    generatedAt: '2026-01-01T00:00:00.000Z',
    mode: 'local',
    ffBranch: 'develop',
    ffCommit: 'abc',
    ffDirty: false,
    packages: ['@edifice.io/react'],
    scanErrors: [],
    symbols: [],
    outOfContractImports: [],
    cssComponents: [],
    cssGlobalRisks: [],
    appStates: [],
    ...overrides,
  };
}

function consumer(app: string, appBranch: string, usageSites: number) {
  return {
    app,
    org: 'edificeio',
    appBranch,
    pins: appBranch,
    appCommit: 'x',
    appDirty: false,
    usageSites,
    files: [],
  };
}

describe('AppConsumes', () => {
  it('shows a hint when no app is selected', () => {
    render(
      <AppConsumes appName={null} index={makeIndex()} branchFilter="all" />,
    );
    expect(screen.getByText(/sélectionnez une app/i)).toBeTruthy();
  });

  it('lists the symbols an app consumes', () => {
    const index = makeIndex({
      symbols: [
        {
          package: '@edifice.io/react',
          entry: '.',
          name: 'Dropdown',
          kind: 'component',
          sourceFiles: [],
          consumers: [consumer('communities', 'develop', 3)],
        },
      ],
    });

    render(
      <AppConsumes appName="communities" index={index} branchFilter="all" />,
    );

    expect(screen.getByText('communities')).toBeTruthy();
    expect(screen.getByText('Dropdown')).toBeTruthy();
    expect(screen.queryByText('Aucun usage détecté.')).toBeNull();
  });

  it('reports no usage for an app that consumes nothing', () => {
    render(
      <AppConsumes appName="blog" index={makeIndex()} branchFilter="all" />,
    );
    expect(screen.getByText('Aucun usage détecté.')).toBeTruthy();
  });

  it('filters rows by the mainline group (develop/dev), excluding squad branches', () => {
    const index = makeIndex({
      symbols: [
        {
          package: '@edifice.io/react',
          entry: '.',
          name: 'Dropdown',
          kind: 'component',
          sourceFiles: [],
          // homeworks uses "dev" as its mainline branch, unlike most apps.
          consumers: [
            consumer('homeworks', 'dev', 3),
            consumer('homeworks', 'develop-pedago', 7),
          ],
        },
      ],
    });

    // The filter is owned by App.tsx (not AppConsumes) precisely so
    // switching apps never resets it — AppConsumes only needs to honor
    // whatever value it's handed, "dev" folding into the "develop" group.
    render(
      <AppConsumes appName="homeworks" index={index} branchFilter="develop" />,
    );

    const rows = screen.getAllByRole('row').slice(1);
    expect(rows).toHaveLength(1);
    expect(rows[0].textContent).toContain('dev');
    expect(
      rows.some((row) => row.textContent?.includes('develop-pedago')),
    ).toBe(false);
  });

  it('keeps filtering correctly across an app switch', () => {
    const index = makeIndex({
      symbols: [
        {
          package: '@edifice.io/react',
          entry: '.',
          name: 'Dropdown',
          kind: 'component',
          sourceFiles: [],
          consumers: [
            consumer('blog', 'develop', 2),
            consumer('blog', 'develop-pedago', 5),
            consumer('communities', 'develop', 1),
            consumer('communities', 'develop-pedago', 4),
          ],
        },
      ],
    });

    const { rerender } = render(
      <AppConsumes
        appName="blog"
        index={index}
        branchFilter="develop-pedago"
      />,
    );
    expect(screen.getAllByRole('row').slice(1)).toHaveLength(1);

    rerender(
      <AppConsumes
        appName="communities"
        index={index}
        branchFilter="develop-pedago"
      />,
    );

    const rows = screen.getAllByRole('row').slice(1);
    expect(rows).toHaveLength(1);
    expect(rows[0].textContent).toContain('develop-pedago');
  });
});
