import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ImpactIndex } from '../types/index-schema.js';
import { runSymbol } from './symbol-command.js';

function makeIndex(): ImpactIndex {
  return {
    schemaVersion: 1,
    generatedAt: '2026-01-01T00:00:00.000Z',
    mode: 'local',
    ffBranch: 'develop',
    ffCommit: 'abc',
    ffDirty: false,
    packages: ['@edifice.io/react'],
    scanErrors: [],
    symbols: [
      {
        package: '@edifice.io/react',
        entry: '.',
        name: 'Dropdown',
        kind: 'const',
        sourceFiles: [],
        consumers: [
          {
            app: 'communities',
            org: 'edificeio',
            appBranch: 'develop',
            pins: 'develop',
            appCommit: 'x',
            appDirty: false,
            usageSites: 12,
            files: ['a.tsx'],
          },
          {
            app: 'blog',
            org: 'edificeio',
            appBranch: 'develop',
            pins: 'develop',
            appCommit: 'y',
            appDirty: false,
            usageSites: 3,
            files: ['b.tsx', 'c.tsx', 'd.tsx', 'e.tsx'],
          },
        ],
      },
      {
        package: '@edifice.io/react',
        entry: '.',
        name: 'Flex',
        kind: 'const',
        sourceFiles: [],
        consumers: [],
      },
    ],
    outOfContractImports: [],
    cssComponents: [],
    cssGlobalRisks: [],
    appStates: [],
  };
}

describe('runSymbol', () => {
  let logs: string[];
  let errors: string[];

  beforeEach(() => {
    logs = [];
    errors = [];
    vi.spyOn(console, 'log').mockImplementation((msg: string) => {
      logs.push(msg);
    });
    vi.spyOn(console, 'error').mockImplementation((msg: string) => {
      errors.push(msg);
    });
    process.exitCode = undefined;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.exitCode = undefined;
  });

  it('matches case-insensitively by substring', () => {
    runSymbol('dropdown', { cached: false }, makeIndex());
    expect(logs.some((l) => l.includes('Dropdown'))).toBe(true);
    expect(process.exitCode).toBeUndefined();
  });

  it('sorts consumers by usage sites descending and truncates long file lists', () => {
    runSymbol('Dropdown', { cached: false }, makeIndex());
    const table = logs.find((l) => l.includes('App'));
    const lines = table!.split('\n');
    expect(lines.findIndex((l) => l.includes('communities'))).toBeLessThan(
      lines.findIndex((l) => l.includes('blog')),
    );
    expect(table).toContain('4 files (see index for detail)');
  });

  it('reports no known consumer for a symbol with none', () => {
    runSymbol('Flex', { cached: false }, makeIndex());
    expect(logs.some((l) => l.includes('no known consumer'))).toBe(true);
  });

  it('exits 1 with a message when nothing matches', () => {
    runSymbol('DoesNotExist', { cached: false }, makeIndex());
    expect(process.exitCode).toBe(1);
    expect(logs.some((l) => l.includes('No symbol matching'))).toBe(true);
  });

  it('exits 1 on an empty query without touching the index', () => {
    runSymbol('   ', { cached: false }, makeIndex());
    expect(process.exitCode).toBe(1);
    expect(errors.some((l) => l.includes('Usage:'))).toBe(true);
  });
});
