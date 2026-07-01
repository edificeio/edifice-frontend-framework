import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  createFfProject,
  extractSymbolsFromEntry,
  inferSymbolKind,
} from './symbol-extractor.js';

const fixtureDir = fileURLToPath(
  new URL('../../test/fixtures/ff-fixture', import.meta.url),
);
const fixtureTsconfig = `${fixtureDir}/tsconfig.json`;

describe('extractSymbolsFromEntry', () => {
  it('resolves symbols through multi-level barrels and export renames', () => {
    const project = createFfProject(fixtureTsconfig);
    const symbols = extractSymbolsFromEntry(
      project,
      `${fixtureDir}/src/index.ts`,
    );
    const byName = Object.fromEntries(symbols.map((s) => [s.name, s]));

    expect(Object.keys(byName).sort()).toEqual([
      'Button',
      'RenamedThing',
      'useToggle',
    ]);

    // Barrel: index.ts -> components/index.ts -> Button.tsx
    expect(byName.Button.sourceFiles).toEqual([
      `${fixtureDir}/src/components/Button.tsx`,
    ]);
    expect(byName.Button.kind).toBe('component');

    expect(byName.useToggle.kind).toBe('hook');

    // export { Thing as RenamedThing } from './thing' — renamed at the barrel.
    expect(byName.RenamedThing.sourceFiles).toEqual([
      `${fixtureDir}/src/thing.ts`,
    ]);
    expect(byName.RenamedThing.kind).toBe('const');
  });

  it('resolves the icons subpath to its individual icon components', () => {
    const project = createFfProject(fixtureTsconfig);
    const symbols = extractSymbolsFromEntry(
      project,
      `${fixtureDir}/src/icons/index.ts`,
    );
    const names = symbols.map((s) => s.name).sort();
    expect(names).toEqual(['IconOne', 'IconThree', 'IconTwo']);
    expect(symbols.every((s) => s.kind === 'component')).toBe(true);
  });
});

describe('inferSymbolKind', () => {
  it('classifies use-prefixed names as hooks regardless of declaration shape', () => {
    expect(inferSymbolKind('useSomething', [])).toBe('hook');
  });

  it('falls back to util for lower-case, non-hook names', () => {
    expect(inferSymbolKind('formatDate', [])).toBe('util');
  });
});
