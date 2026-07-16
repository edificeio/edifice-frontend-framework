import { describe, expect, it } from 'vitest';
import type {
  AppBranchState,
  CssComponentEntry,
  ImpactIndex,
  OutOfContractImport,
  SymbolEntry,
} from '../types/index-schema.js';
import {
  carryForwardCssConsumers,
  carryForwardOutOfContract,
  carryForwardSymbolConsumers,
  findAppState,
} from './carry-forward.js';

function makeSymbol(overrides: Partial<SymbolEntry> = {}): SymbolEntry {
  return {
    package: '@edifice.io/react',
    entry: '.',
    name: 'Button',
    kind: 'component',
    sourceFiles: [],
    consumers: [],
    ...overrides,
  };
}

function makeIndex(overrides: Partial<ImpactIndex> = {}): ImpactIndex {
  return {
    schemaVersion: 1,
    generatedAt: '2026-06-30T02:00:00.000Z',
    mode: 'ci',
    ffBranch: 'develop',
    ffCommit: 'abc',
    ffDirty: false,
    packages: [],
    scanErrors: [],
    symbols: [],
    outOfContractImports: [],
    cssComponents: [],
    cssGlobalRisks: [],
    appStates: [],
    ...overrides,
  };
}

describe('findAppState', () => {
  const states: AppBranchState[] = [
    { app: 'blog', branch: 'develop', commit: 'sha-blog' },
    { app: 'blog', branch: 'develop-enabling', commit: 'sha-blog-enabling' },
  ];

  it('finds the matching (app, branch) state', () => {
    const state = findAppState(
      makeIndex({ appStates: states }),
      'blog',
      'develop',
    );
    expect(state).toEqual({
      app: 'blog',
      branch: 'develop',
      commit: 'sha-blog',
    });
  });

  it('returns undefined when no state matches', () => {
    expect(
      findAppState(makeIndex({ appStates: states }), 'rack', 'develop'),
    ).toBeUndefined();
  });

  it('returns undefined when there is no previous index at all', () => {
    expect(findAppState(undefined, 'blog', 'develop')).toBeUndefined();
  });
});

describe('carryForwardSymbolConsumers', () => {
  it('re-attaches a previous consumer onto the matching current symbol', () => {
    const symbols = [makeSymbol({ consumers: [] })];
    const previousSymbols = [
      makeSymbol({
        consumers: [
          {
            app: 'blog',
            org: 'edificeio',
            appBranch: 'develop',
            pins: 'develop',
            appCommit: 'sha-blog',
            appDirty: false,
            usageSites: 3,
            files: ['a.tsx'],
          },
        ],
      }),
    ];

    carryForwardSymbolConsumers(symbols, previousSymbols, 'blog', 'develop');

    expect(symbols[0].consumers).toHaveLength(1);
    expect(symbols[0].consumers[0]).toMatchObject({
      app: 'blog',
      appBranch: 'develop',
      usageSites: 3,
    });
  });

  it('drops the consumer silently when the symbol no longer exists in the current FF', () => {
    const symbols: SymbolEntry[] = []; // Button was removed/renamed
    const previousSymbols = [
      makeSymbol({
        consumers: [
          {
            app: 'blog',
            org: 'edificeio',
            appBranch: 'develop',
            pins: 'develop',
            appCommit: 'sha-blog',
            appDirty: false,
            usageSites: 3,
            files: ['a.tsx'],
          },
        ],
      }),
    ];

    expect(() =>
      carryForwardSymbolConsumers(symbols, previousSymbols, 'blog', 'develop'),
    ).not.toThrow();
    expect(symbols).toEqual([]);
  });

  it('does not clobber an existing consumer already on the symbol for another app', () => {
    const existingConsumer = {
      app: 'rack',
      org: 'edificeio',
      appBranch: 'develop',
      pins: 'develop',
      appCommit: 'sha-rack',
      appDirty: false,
      usageSites: 5,
      files: ['b.tsx'],
    };
    const symbols = [makeSymbol({ consumers: [existingConsumer] })];
    const previousSymbols = [
      makeSymbol({
        consumers: [
          {
            app: 'blog',
            org: 'edificeio',
            appBranch: 'develop',
            pins: 'develop',
            appCommit: 'sha-blog',
            appDirty: false,
            usageSites: 3,
            files: ['a.tsx'],
          },
        ],
      }),
    ];

    carryForwardSymbolConsumers(symbols, previousSymbols, 'blog', 'develop');

    expect(symbols[0].consumers).toHaveLength(2);
    expect(symbols[0].consumers.map((c) => c.app).sort()).toEqual([
      'blog',
      'rack',
    ]);
  });

  it('ignores consumers belonging to a different (app, branch)', () => {
    const symbols = [makeSymbol()];
    const previousSymbols = [
      makeSymbol({
        consumers: [
          {
            app: 'blog',
            org: 'edificeio',
            appBranch: 'develop-enabling',
            pins: 'develop-enabling',
            appCommit: 'sha-x',
            appDirty: false,
            usageSites: 1,
            files: ['a.tsx'],
          },
        ],
      }),
    ];

    carryForwardSymbolConsumers(symbols, previousSymbols, 'blog', 'develop');

    expect(symbols[0].consumers).toEqual([]);
  });
});

describe('carryForwardOutOfContract', () => {
  const imports: OutOfContractImport[] = [
    {
      app: 'blog',
      appBranch: 'develop',
      package: '@edifice.io/react',
      importPath: '@edifice.io/react/dist/internal',
      files: ['a.tsx'],
    },
    {
      app: 'rack',
      appBranch: 'develop',
      package: '@edifice.io/react',
      importPath: '@edifice.io/react/dist/internal',
      files: ['b.tsx'],
    },
  ];

  it('keeps only entries matching the given (app, branch)', () => {
    const result = carryForwardOutOfContract(imports, 'blog', 'develop');
    expect(result).toHaveLength(1);
    expect(result[0].app).toBe('blog');
  });

  it('returns an empty array when nothing matches', () => {
    expect(
      carryForwardOutOfContract(imports, 'communities', 'develop'),
    ).toEqual([]);
  });
});

describe('carryForwardCssConsumers', () => {
  function makeCssComponent(
    overrides: Partial<CssComponentEntry> = {},
  ): CssComponentEntry {
    return {
      file: '_dropdown.scss',
      selectors: ['.dropdown'],
      consumers: [],
      confidence: 'high',
      ...overrides,
    };
  }

  it('re-attaches a previous CSS consumer onto the matching current component, by file', () => {
    const cssComponents = [makeCssComponent({ consumers: [] })];
    const previousCssComponents = [
      makeCssComponent({
        consumers: [
          {
            app: 'blog',
            appBranch: 'develop',
            matchedSelectors: ['.dropdown'],
            files: ['a.tsx'],
            matchCount: 2,
          },
        ],
      }),
    ];

    carryForwardCssConsumers(
      cssComponents,
      previousCssComponents,
      'blog',
      'develop',
    );

    expect(cssComponents[0].consumers).toHaveLength(1);
    expect(cssComponents[0].consumers[0]).toMatchObject({
      app: 'blog',
      matchCount: 2,
    });
  });

  it('drops the CSS consumer silently when the component file no longer exists', () => {
    const cssComponents: CssComponentEntry[] = []; // _dropdown.scss renamed/removed
    const previousCssComponents = [
      makeCssComponent({
        consumers: [
          {
            app: 'blog',
            appBranch: 'develop',
            matchedSelectors: ['.dropdown'],
            files: ['a.tsx'],
            matchCount: 2,
          },
        ],
      }),
    ];

    expect(() =>
      carryForwardCssConsumers(
        cssComponents,
        previousCssComponents,
        'blog',
        'develop',
      ),
    ).not.toThrow();
    expect(cssComponents).toEqual([]);
  });
});
