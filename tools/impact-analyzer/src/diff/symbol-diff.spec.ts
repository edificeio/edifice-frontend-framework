import { mkdtempSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Project } from 'ts-morph';
import { afterEach, describe, expect, it } from 'vitest';
import { extractSymbolsWithDeclarations } from '../ff-map/symbol-extractor.js';
import type { ImpactIndex, SymbolEntry } from '../types/index-schema.js';
import { diffSymbols } from './symbol-diff.js';

function makeSymbols(
  dir: string,
  source: string,
): ReturnType<typeof extractSymbolsWithDeclarations> {
  writeFileSync(join(dir, 'a.ts'), source);
  const project = new Project({ compilerOptions: { jsx: 4, strict: false } });
  return extractSymbolsWithDeclarations(project, join(dir, 'a.ts'));
}

function toDeclaredSymbols(
  extracted: ReturnType<typeof extractSymbolsWithDeclarations>,
  packageName = '@edifice.io/fixture',
  entry = '.',
) {
  return extracted.map((s) => ({ package: packageName, entry, ...s }));
}

function makeHeadIndex(symbols: Partial<SymbolEntry>[] = []): ImpactIndex {
  return {
    schemaVersion: 1,
    generatedAt: '2026-01-01T00:00:00.000Z',
    mode: 'local',
    ffBranch: 'develop',
    ffCommit: 'abc',
    ffDirty: false,
    packages: ['@edifice.io/fixture'],
    scanErrors: [],
    symbols: symbols as SymbolEntry[],
    outOfContractImports: [],
    cssComponents: [],
    cssGlobalRisks: [],
    appStates: [],
  };
}

describe('diffSymbols', () => {
  let baseDir: string;
  let headDir: string;

  afterEach(() => {
    rmSync(baseDir, { recursive: true, force: true });
    rmSync(headDir, { recursive: true, force: true });
  });

  it('reports a removed export as breaking', () => {
    baseDir = mkdtempSync(join(tmpdir(), 'diff-base-'));
    headDir = mkdtempSync(join(tmpdir(), 'diff-head-'));

    const baseSymbols = toDeclaredSymbols(
      makeSymbols(
        baseDir,
        'export function foo() {}\nexport function bar() {}',
      ),
    );
    const headSymbols = toDeclaredSymbols(
      makeSymbols(headDir, 'export function bar() {}'),
    );

    const [entry] = diffSymbols({
      baseSymbols,
      headSymbols,
      headIndex: makeHeadIndex(),
    });
    expect(entry).toMatchObject({
      name: 'foo',
      changeKind: 'removed',
      severity: 'breaking',
    });
    expect(entry.sourceFilesHead).toEqual([]);
  });

  it('reports an added parameter as signature-changed / likely-breaking, with riskScore from consumers', () => {
    baseDir = mkdtempSync(join(tmpdir(), 'diff-base-'));
    headDir = mkdtempSync(join(tmpdir(), 'diff-head-'));

    const baseSymbols = toDeclaredSymbols(
      makeSymbols(baseDir, 'export function foo(a: string) {}'),
    );
    const headSymbols = toDeclaredSymbols(
      makeSymbols(headDir, 'export function foo(a: string, b: number) {}'),
    );

    const headIndex = makeHeadIndex([
      {
        package: '@edifice.io/fixture',
        entry: '.',
        name: 'foo',
        kind: 'util',
        sourceFiles: [],
        consumers: [
          {
            app: 'communities',
            org: 'edificeio',
            appBranch: 'develop',
            pins: 'develop',
            appCommit: 'x',
            appDirty: false,
            usageSites: 5,
            files: [],
          },
        ],
      },
    ]);

    const [entry] = diffSymbols({ baseSymbols, headSymbols, headIndex });
    expect(entry).toMatchObject({
      name: 'foo',
      changeKind: 'signature-changed',
      severity: 'likely-breaking',
    });
    // Linking fields (org/repo/appCommit/files) are denormalized from the
    // head index so the viewer can build GitHub permalinks.
    expect(entry.consumers).toEqual([
      expect.objectContaining({
        app: 'communities',
        appBranch: 'develop',
        usageSites: 5,
        org: 'edificeio',
        appCommit: 'x',
        files: [],
      }),
    ]);
    expect(entry.riskScore).toBe(10 * (5 + 1) * (1 + 1));
  });

  it('produces no entry for a cosmetic-only change (comment added)', () => {
    baseDir = mkdtempSync(join(tmpdir(), 'diff-base-'));
    headDir = mkdtempSync(join(tmpdir(), 'diff-head-'));

    const baseSymbols = toDeclaredSymbols(
      makeSymbols(baseDir, 'export function foo(x: number) { return x + 1; }'),
    );
    const headSymbols = toDeclaredSymbols(
      makeSymbols(
        headDir,
        'export function foo(x: number) { /* c */ return x + 1; }',
      ),
    );

    expect(
      diffSymbols({ baseSymbols, headSymbols, headIndex: makeHeadIndex() }),
    ).toEqual([]);
  });

  it('reports a real body-only change as needs-review', () => {
    baseDir = mkdtempSync(join(tmpdir(), 'diff-base-'));
    headDir = mkdtempSync(join(tmpdir(), 'diff-head-'));

    const baseSymbols = toDeclaredSymbols(
      makeSymbols(baseDir, 'export function foo(x: number) { return x + 1; }'),
    );
    const headSymbols = toDeclaredSymbols(
      makeSymbols(headDir, 'export function foo(x: number) { return x + 2; }'),
    );

    const [entry] = diffSymbols({
      baseSymbols,
      headSymbols,
      headIndex: makeHeadIndex(),
    });
    expect(entry).toMatchObject({
      name: 'foo',
      changeKind: 'body-changed',
      severity: 'needs-review',
    });
  });

  it('reports needs-review instead of crashing when a base source file is missing on disk', () => {
    baseDir = mkdtempSync(join(tmpdir(), 'diff-base-'));
    headDir = mkdtempSync(join(tmpdir(), 'diff-head-'));

    const baseSymbols = toDeclaredSymbols(
      makeSymbols(baseDir, 'export function foo(x: number) { return x + 1; }'),
    );
    const headSymbols = toDeclaredSymbols(
      makeSymbols(headDir, 'export function foo(x: number) { return x + 1; }'),
    );
    // Simulate the base worktree snapshot disappearing mid-read (race, cleanup).
    unlinkSync(join(baseDir, 'a.ts'));

    const [entry] = diffSymbols({
      baseSymbols,
      headSymbols,
      headIndex: makeHeadIndex(),
    });
    expect(entry).toMatchObject({
      name: 'foo',
      changeKind: 'body-changed',
      severity: 'needs-review',
    });
  });

  it('skips the body compare entirely when changedFiles says nothing touched this symbol', () => {
    baseDir = mkdtempSync(join(tmpdir(), 'diff-base-'));
    headDir = mkdtempSync(join(tmpdir(), 'diff-head-'));

    const baseSymbols = toDeclaredSymbols(
      makeSymbols(baseDir, 'export function foo(x: number) { return x + 1; }'),
    );
    const headSymbols = toDeclaredSymbols(
      makeSymbols(headDir, 'export function foo(x: number) { return x + 2; }'),
    );

    const entries = diffSymbols({
      baseSymbols,
      headSymbols,
      headIndex: makeHeadIndex(),
      changedFiles: new Set(), // git reports nothing changed at all
      repoRoot: headDir,
    });
    expect(entries).toEqual([]);
  });

  it('still reports the change when changedFiles includes the touched file', () => {
    baseDir = mkdtempSync(join(tmpdir(), 'diff-base-'));
    headDir = mkdtempSync(join(tmpdir(), 'diff-head-'));

    const baseSymbols = toDeclaredSymbols(
      makeSymbols(baseDir, 'export function foo(x: number) { return x + 1; }'),
    );
    const headSymbols = toDeclaredSymbols(
      makeSymbols(headDir, 'export function foo(x: number) { return x + 2; }'),
    );

    const [entry] = diffSymbols({
      baseSymbols,
      headSymbols,
      headIndex: makeHeadIndex(),
      changedFiles: new Set(['a.ts']),
      repoRoot: headDir,
    });
    expect(entry).toMatchObject({
      name: 'foo',
      changeKind: 'body-changed',
      severity: 'needs-review',
    });
  });

  it('classifies a changed compound component (non-comparable shape) as body-changed only', () => {
    baseDir = mkdtempSync(join(tmpdir(), 'diff-base-'));
    headDir = mkdtempSync(join(tmpdir(), 'diff-head-'));

    const source = (variant: string) => `
      function Root() { return null; }
      function Trigger() { return null; }
      export const Dropdown = Object.assign(Root, { Trigger, variant: '${variant}' });
    `;
    const baseSymbols = toDeclaredSymbols(makeSymbols(baseDir, source('a')));
    const headSymbols = toDeclaredSymbols(makeSymbols(headDir, source('b')));

    const [entry] = diffSymbols({
      baseSymbols,
      headSymbols,
      headIndex: makeHeadIndex(),
    });
    expect(entry).toMatchObject({
      name: 'Dropdown',
      changeKind: 'body-changed',
      severity: 'needs-review',
    });
  });

  it('does not report a new export present only at head', () => {
    baseDir = mkdtempSync(join(tmpdir(), 'diff-base-'));
    headDir = mkdtempSync(join(tmpdir(), 'diff-head-'));

    const baseSymbols = toDeclaredSymbols(
      makeSymbols(baseDir, 'export function foo() {}'),
    );
    const headSymbols = toDeclaredSymbols(
      makeSymbols(
        headDir,
        'export function foo() {}\nexport function newOne() {}',
      ),
    );

    const entries = diffSymbols({
      baseSymbols,
      headSymbols,
      headIndex: makeHeadIndex(),
    });
    expect(entries.some((e) => e.name === 'newOne')).toBe(false);
  });

  it('sorts entries by riskScore descending', () => {
    baseDir = mkdtempSync(join(tmpdir(), 'diff-base-'));
    headDir = mkdtempSync(join(tmpdir(), 'diff-head-'));

    const baseSymbols = toDeclaredSymbols(
      makeSymbols(
        baseDir,
        'export function low(x: number) { return x + 1; }\nexport function high() {}',
      ),
    );
    const headSymbols = toDeclaredSymbols(
      makeSymbols(headDir, 'export function low(x: number) { return x + 2; }'),
    );

    const entries = diffSymbols({
      baseSymbols,
      headSymbols,
      headIndex: makeHeadIndex(),
    });
    expect(entries.map((e) => e.name)).toEqual(['high', 'low']); // removed (breaking) before body-changed (needs-review)
  });
});
