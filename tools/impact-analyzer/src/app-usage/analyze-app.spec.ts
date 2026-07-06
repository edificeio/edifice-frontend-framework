import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { analyzeAppUsage } from './analyze-app.js';

const appDir = fileURLToPath(
  new URL('../../test/fixtures/app-fixture/frontend', import.meta.url),
);

describe('analyzeAppUsage', () => {
  const ffEntries = [
    { package: '@edifice.io/fixture', entry: '.' },
    { package: '@edifice.io/fixture', entry: './icons' },
  ];

  it('resolves named, aliased and namespace usages with real usage-site counts', () => {
    const { usages } = analyzeAppUsage(
      `${appDir}/src`,
      `${appDir}/tsconfig.json`,
      ffEntries,
    );

    // NamedImport.tsx: <Button /> twice.
    // AliasImport.tsx: <MyButton /> once (aliased from Button).
    // -> both attributed to the real exported name "Button", merged together.
    const namedButtonUsage = usages.find(
      (u) => u.importedName === 'Button' && !u.viaNamespace,
    );
    expect(namedButtonUsage?.usageSites).toBe(3);
    expect(namedButtonUsage?.files.slice().sort()).toEqual(
      [`${appDir}/src/AliasImport.tsx`, `${appDir}/src/NamedImport.tsx`].sort(),
    );

    // NamespaceImport.tsx: Fixture.Button used once, Fixture.useToggle used once.
    const namespaceButtonUsage = usages.find(
      (u) => u.importedName === 'Button' && u.viaNamespace,
    );
    expect(namespaceButtonUsage?.usageSites).toBe(1);
    expect(namespaceButtonUsage?.files).toEqual([
      `${appDir}/src/NamespaceImport.tsx`,
    ]);

    const useToggleUsage = usages.find((u) => u.importedName === 'useToggle');
    expect(useToggleUsage?.usageSites).toBe(1);
    expect(useToggleUsage?.viaNamespace).toBe(true);
  });

  it('flags deep imports outside the declared exports contract, without counting them as usage', () => {
    const { usages, outOfContractImports } = analyzeAppUsage(
      `${appDir}/src`,
      `${appDir}/tsconfig.json`,
      ffEntries,
    );

    expect(outOfContractImports).toEqual(
      expect.arrayContaining([
        {
          package: '@edifice.io/fixture',
          importPath: '@edifice.io/fixture/dist/internal/Internal',
          files: [`${appDir}/src/OutOfContract.tsx`],
        },
      ]),
    );

    expect(usages.some((u) => u.importedName === 'Internal')).toBe(false);
  });

  it('flags a side-effect-only import outside the contract, even with no named/namespace binding', () => {
    const { outOfContractImports } = analyzeAppUsage(
      `${appDir}/src`,
      `${appDir}/tsconfig.json`,
      ffEntries,
    );

    expect(outOfContractImports).toEqual(
      expect.arrayContaining([
        {
          package: '@edifice.io/fixture',
          importPath: '@edifice.io/fixture/dist/internal/side-effect.css',
          files: [`${appDir}/src/SideEffectImport.tsx`],
        },
      ]),
    );
  });

  it('silently ignores @edifice.io/* imports from packages outside the tracked set', () => {
    const { usages, outOfContractImports } = analyzeAppUsage(
      `${appDir}/src`,
      `${appDir}/tsconfig.json`,
      ffEntries,
    );

    expect(usages.some((u) => u.importedName === 'SomethingElse')).toBe(false);
    expect(
      outOfContractImports.some((o) => o.package === '@edifice.io/other-app'),
    ).toBe(false);
  });
});
