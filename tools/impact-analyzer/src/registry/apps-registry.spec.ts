import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { AppsRegistryError, loadAppsRegistry } from './apps-registry.js';

const fixture = (name: string) =>
  fileURLToPath(
    new URL(`../../test/fixtures/registry/${name}`, import.meta.url),
  );

const tempDirs: string[] = [];

/** Writes a throwaway apps.json for a single test and returns its path. */
function writeTempRegistry(entries: unknown[]): string {
  const dir = mkdtempSync(join(tmpdir(), 'impact-analyzer-registry-'));
  tempDirs.push(dir);
  const path = join(dir, 'apps.json');
  writeFileSync(path, JSON.stringify(entries));
  return path;
}

describe('loadAppsRegistry', () => {
  afterEach(() => {
    tempDirs
      .splice(0)
      .forEach((dir) => rmSync(dir, { recursive: true, force: true }));
  });

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

  it('round-trips an entry with a monorepo path, and several apps can share one repo', () => {
    const apps = loadAppsRegistry(fixture('valid-apps-with-path.json'));
    const conversation = apps.find((a) => a.name === 'conversation');
    const timeline = apps.find((a) => a.name === 'timeline');

    expect(conversation).toEqual({
      name: 'conversation',
      org: 'edificeio',
      repo: 'entcore',
      path: 'conversation',
      branches: ['dev'],
    });
    expect(timeline?.repo).toBe(conversation?.repo);
    expect(timeline?.path).toBe('timeline');
  });

  it('does not leak a `path` key for apps without one', () => {
    const apps = loadAppsRegistry(fixture('valid-apps.json'));
    expect(Object.prototype.hasOwnProperty.call(apps[0], 'path')).toBe(false);
  });

  it.each([
    ['/conversation', 'leading slash'],
    ['conversation/', 'trailing slash'],
    ['a\\b', 'backslash'],
    ['a/../b', '.. segment'],
    ['./a', '. segment'],
    ['', 'empty string'],
  ])('rejects an invalid path %j (%s)', (path) => {
    const registryPath = writeTempRegistry([
      {
        name: 'foo',
        org: 'edificeio',
        repo: 'entcore',
        path,
        branches: ['dev'],
      },
    ]);
    expect(() => loadAppsRegistry(registryPath)).toThrow(AppsRegistryError);
  });
});
