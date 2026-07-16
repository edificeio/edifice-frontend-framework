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

describe('AppConsumes', () => {
  it('shows a hint when no app is selected', () => {
    render(<AppConsumes appName={null} index={makeIndex()} />);
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
          consumers: [
            {
              app: 'communities',
              org: 'edificeio',
              appBranch: 'develop',
              pins: 'develop',
              appCommit: 'x',
              appDirty: false,
              usageSites: 3,
              files: ['a.tsx'],
            },
          ],
        },
      ],
    });

    render(<AppConsumes appName="communities" index={index} />);

    expect(screen.getByText('communities')).toBeTruthy();
    expect(screen.getByText('Dropdown')).toBeTruthy();
    expect(screen.queryByText('Aucun usage détecté.')).toBeNull();
  });

  it('reports no usage for an app that consumes nothing', () => {
    render(<AppConsumes appName="blog" index={makeIndex()} />);
    expect(screen.getByText('Aucun usage détecté.')).toBeTruthy();
  });
});
