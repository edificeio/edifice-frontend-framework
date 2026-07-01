import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  currentFfRepoRoot,
  FfEntryMapMismatchError,
  ffPackageDirFromRepoRoot,
  loadFfEntryMap,
  readPackageExportKeys,
  resolveEntrySourceFiles,
} from './entry-points.js';

const fixtureDir = fileURLToPath(
  new URL('../../test/fixtures/ff-fixture', import.meta.url),
);

describe('readPackageExportKeys', () => {
  it('reads the exports subpaths of the fixture package', () => {
    const { name, exportKeys } = readPackageExportKeys(fixtureDir);
    expect(name).toBe('@edifice.io/fixture');
    expect(exportKeys).toEqual(['.', './icons']);
  });
});

describe('resolveEntrySourceFiles', () => {
  const entryMap = {
    '@edifice.io/fixture': {
      '.': 'src/index.ts',
      './icons': 'src/icons/index.ts',
    },
  };

  it('resolves each declared export to its source file', () => {
    const resolved = resolveEntrySourceFiles(fixtureDir, entryMap);
    expect(resolved).toEqual([
      {
        package: '@edifice.io/fixture',
        entry: '.',
        sourceFile: `${fixtureDir}/src/index.ts`,
      },
      {
        package: '@edifice.io/fixture',
        entry: './icons',
        sourceFile: `${fixtureDir}/src/icons/index.ts`,
      },
    ]);
  });

  it('falls back to a __convention__ template for subpaths with no explicit entry', () => {
    const conventionMap = {
      '@edifice.io/fixture': {
        '.': 'src/index.ts',
        '__convention__': 'src/<subpath>/index.ts',
      },
    };
    const resolved = resolveEntrySourceFiles(fixtureDir, conventionMap);
    expect(resolved[0].sourceFile).toBe(`${fixtureDir}/src/index.ts`);
    expect(resolved[1].sourceFile).toBe(`${fixtureDir}/src/icons/index.ts`);
  });

  it('throws when the package has no entry in the map at all', () => {
    expect(() => resolveEntrySourceFiles(fixtureDir, {})).toThrow(
      FfEntryMapMismatchError,
    );
  });

  it('throws when an export subpath is missing from an explicit (non-convention) map', () => {
    const partialMap = {
      '@edifice.io/fixture': { '.': 'src/index.ts' },
    };
    expect(() => resolveEntrySourceFiles(fixtureDir, partialMap)).toThrow(
      FfEntryMapMismatchError,
    );
  });
});

describe('ff-entry-map.json coherence with the real repo', () => {
  it('has a matching source file entry for every subpath declared by each real FF package', () => {
    const repoRoot = currentFfRepoRoot();
    const entryMap = loadFfEntryMap();
    const ffPackageDirNames = [
      'react',
      'client',
      'utilities',
      'extensions',
      'rest-client-base',
    ];

    for (const dirName of ffPackageDirNames) {
      const ffPackageDir = ffPackageDirFromRepoRoot(repoRoot, dirName);
      expect(() =>
        resolveEntrySourceFiles(ffPackageDir, entryMap),
      ).not.toThrow();
    }
  });
});
