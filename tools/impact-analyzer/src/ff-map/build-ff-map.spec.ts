import { cpSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { buildFfMap } from './build-ff-map.js';

const fixtureDir = fileURLToPath(
  new URL('../../test/fixtures/ff-fixture', import.meta.url),
);

describe('buildFfMap', () => {
  let repoRoot: string;

  beforeEach(() => {
    repoRoot = mkdtempSync(join(tmpdir(), 'impact-analyzer-ffmap-'));
    mkdirSync(join(repoRoot, 'packages'), { recursive: true });
    cpSync(fixtureDir, join(repoRoot, 'packages', 'fixture-pkg'), {
      recursive: true,
    });
  });

  afterEach(() => {
    rmSync(repoRoot, { recursive: true, force: true });
  });

  it('builds symbol entries for a package, aggregating its icons subpath', () => {
    const entryMap = {
      '@edifice.io/fixture': {
        '.': 'src/index.ts',
        './icons': 'src/icons/index.ts',
      },
    };

    const symbols = buildFfMap(
      repoRoot,
      [{ packageDirName: 'fixture-pkg' }],
      entryMap,
    );

    const rootSymbols = symbols.filter((s) => s.entry === '.');
    expect(rootSymbols.map((s) => s.name).sort()).toEqual([
      'Button',
      'RenamedThing',
      'useToggle',
    ]);
    expect(rootSymbols.every((s) => s.consumers.length === 0)).toBe(true);

    const iconSymbols = symbols.filter((s) => s.entry === './icons');
    // 3 individual icons + 1 synthetic aggregate.
    expect(iconSymbols).toHaveLength(4);
    const aggregate = iconSymbols.find((s) => s.isAggregate);
    expect(aggregate?.aggregateCount).toBe(3);
  });
});
