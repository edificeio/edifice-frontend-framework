import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { AppsRegistryError, loadAppsRegistry } from './apps-registry.js';

const fixture = (name: string) =>
  fileURLToPath(
    new URL(`../../test/fixtures/registry/${name}`, import.meta.url),
  );

describe('loadAppsRegistry', () => {
  it('loads a well-formed apps.json', () => {
    const apps = loadAppsRegistry(fixture('valid-apps.json'));
    expect(apps).toEqual([
      { name: 'foo', org: 'edificeio', repo: 'foo', branches: ['develop'] },
      {
        name: 'bar',
        org: 'OPEN-ENT-NG',
        repo: 'bar',
        branches: ['develop', 'develop-enabling'],
      },
    ]);
  });

  it('rejects duplicate app names', () => {
    expect(() => loadAppsRegistry(fixture('duplicate-apps.json'))).toThrow(
      AppsRegistryError,
    );
  });

  it('rejects an entry with an empty branches array', () => {
    expect(() => loadAppsRegistry(fixture('malformed-apps.json'))).toThrow(
      AppsRegistryError,
    );
  });

  it('loads the real apps.json shipped with the package', () => {
    const apps = loadAppsRegistry();
    const names = apps.map((a) => a.name);
    expect(names).toContain('communities');
    expect(new Set(names).size).toBe(names.length);
  });
});
