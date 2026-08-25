import { cpSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { buildFfDeclarationsMap } from './build-ff-declarations-map.js';

const fixtureDir = fileURLToPath(
  new URL('../../test/fixtures/ff-fixture', import.meta.url),
);

describe('buildFfDeclarationsMap', () => {
  let repoRoot: string;

  beforeEach(() => {
    repoRoot = mkdtempSync(join(tmpdir(), 'impact-analyzer-ffdecl-'));
    mkdirSync(join(repoRoot, 'packages'), { recursive: true });
    cpSync(fixtureDir, join(repoRoot, 'packages', 'fixture-pkg'), {
      recursive: true,
    });
  });

  afterEach(() => {
    rmSync(repoRoot, { recursive: true, force: true });
  });

  it('carries the live ts-morph declaration nodes buildFfMap discards', () => {
    const entryMap = {
      '@edifice.io/fixture': {
        '.': 'src/index.ts',
        './icons': 'src/icons/index.ts',
      },
    };

    const symbols = buildFfDeclarationsMap(
      repoRoot,
      [{ packageDirName: 'fixture-pkg' }],
      entryMap,
    );

    const byName = Object.fromEntries(
      symbols.filter((s) => s.entry === '.').map((s) => [s.name, s]),
    );
    expect(Object.keys(byName).sort()).toEqual([
      'Button',
      'RenamedThing',
      'useToggle',
    ]);
    expect(byName.Button.declarations.length).toBeGreaterThan(0);
    expect(byName.Button.declarations[0].getSourceFile).toBeTypeOf('function');
    // Absolute paths — unlike buildFfMap, this function never relativizes
    // them (the diff module reads these files directly off disk).
    expect(byName.Button.sourceFiles).toEqual([
      join(repoRoot, 'packages', 'fixture-pkg', 'src', 'components/Button.tsx'),
    ]);
  });

  it('does not aggregate icon subpaths (unlike buildFfMap) — every icon is a plain symbol', () => {
    const entryMap = {
      '@edifice.io/fixture': {
        '.': 'src/index.ts',
        './icons': 'src/icons/index.ts',
      },
    };

    const symbols = buildFfDeclarationsMap(
      repoRoot,
      [{ packageDirName: 'fixture-pkg' }],
      entryMap,
    );

    const iconSymbols = symbols.filter((s) => s.entry === './icons');
    expect(iconSymbols.map((s) => s.name).sort()).toEqual([
      'IconOne',
      'IconThree',
      'IconTwo',
    ]);
    // No synthetic "icons (...)" aggregate entry, and no isAggregate field —
    // DeclaredSymbol doesn't even have that concept.
    expect(iconSymbols.some((s) => s.name.startsWith('icons ('))).toBe(false);
  });
});
