import type { ImpactIndex } from '@edifice.io/impact-analyzer';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
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
      <AppConsumes
        appName={null}
        index={makeIndex()}
        branchFilter={null}
        onBranchFilterChange={vi.fn()}
      />,
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
      <AppConsumes
        appName="communities"
        index={index}
        branchFilter="all"
        onBranchFilterChange={vi.fn()}
      />,
    );

    expect(screen.getByText('communities')).toBeTruthy();
    expect(screen.getByText('Dropdown')).toBeTruthy();
    expect(screen.queryByText('Aucun usage détecté.')).toBeNull();
  });

  it('reports no usage for an app that consumes nothing', () => {
    render(
      <AppConsumes
        appName="blog"
        index={makeIndex()}
        branchFilter="all"
        onBranchFilterChange={vi.fn()}
      />,
    );
    expect(screen.getByText('Aucun usage détecté.')).toBeTruthy();
  });

  it("requests the app's own mainline branch when no filter is set yet", () => {
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
    const onBranchFilterChange = vi.fn();

    render(
      <AppConsumes
        appName="homeworks"
        index={index}
        branchFilter={null}
        onBranchFilterChange={onBranchFilterChange}
      />,
    );

    expect(onBranchFilterChange).toHaveBeenCalledWith('dev');
  });

  it('keeps an explicit branch selection when switching to an app that still has it', () => {
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
    const onBranchFilterChange = vi.fn();

    const { rerender } = render(
      <AppConsumes
        appName="blog"
        index={index}
        branchFilter="develop-pedago"
        onBranchFilterChange={onBranchFilterChange}
      />,
    );
    expect(onBranchFilterChange).not.toHaveBeenCalled();

    rerender(
      <AppConsumes
        appName="communities"
        index={index}
        branchFilter="develop-pedago"
        onBranchFilterChange={onBranchFilterChange}
      />,
    );

    // Still valid for communities too — the switch alone must not reset it.
    expect(onBranchFilterChange).not.toHaveBeenCalled();
    const rows = screen.getAllByRole('row').slice(1);
    expect(rows).toHaveLength(1);
    expect(rows[0].textContent).toContain('develop-pedago');
  });

  it("falls back to the new app's mainline when the kept branch doesn't exist there", () => {
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
            consumer('homeworks', 'dev', 1),
          ],
        },
      ],
    });
    const onBranchFilterChange = vi.fn();

    const { rerender } = render(
      <AppConsumes
        appName="blog"
        index={index}
        branchFilter="develop-pedago"
        onBranchFilterChange={onBranchFilterChange}
      />,
    );
    expect(onBranchFilterChange).not.toHaveBeenCalled();

    // homeworks never had develop-pedago — falls back to its own mainline.
    rerender(
      <AppConsumes
        appName="homeworks"
        index={index}
        branchFilter="develop-pedago"
        onBranchFilterChange={onBranchFilterChange}
      />,
    );

    expect(onBranchFilterChange).toHaveBeenCalledWith('dev');
  });
});
