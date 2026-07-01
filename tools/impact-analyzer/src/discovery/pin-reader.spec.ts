import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanupTempDir, writePackageJson } from './test-utils.js';
import {
  AppLayoutNotFoundError,
  readEdificePins,
  resolveAppLayout,
} from './pin-reader.js';

describe('resolveAppLayout', () => {
  let repoPath: string;

  afterEach(() => {
    if (repoPath) cleanupTempDir(repoPath);
  });

  it('prefers frontend/package.json when present', () => {
    repoPath = mkdtempSync(join(tmpdir(), 'impact-analyzer-layout-'));
    writePackageJson(repoPath, 'frontend', { name: 'app-frontend' });
    writePackageJson(repoPath, null, { name: 'app-backend' });

    const layout = resolveAppLayout(repoPath);
    expect(layout.usesFrontendSubdir).toBe(true);
    expect(layout.packageJsonPath).toBe(
      join(repoPath, 'frontend', 'package.json'),
    );
    expect(layout.srcRoot).toBe(join(repoPath, 'frontend', 'src'));
  });

  it('falls back to the root package.json when there is no frontend/', () => {
    repoPath = mkdtempSync(join(tmpdir(), 'impact-analyzer-layout-'));
    writePackageJson(repoPath, null, { name: 'app-only' });

    const layout = resolveAppLayout(repoPath);
    expect(layout.usesFrontendSubdir).toBe(false);
    expect(layout.packageJsonPath).toBe(join(repoPath, 'package.json'));
    expect(layout.srcRoot).toBe(join(repoPath, 'src'));
  });

  it('throws when neither layout has a package.json', () => {
    repoPath = mkdtempSync(join(tmpdir(), 'impact-analyzer-layout-'));
    expect(() => resolveAppLayout(repoPath)).toThrow(AppLayoutNotFoundError);
  });
});

describe('readEdificePins', () => {
  let repoPath: string;

  afterEach(() => {
    if (repoPath) cleanupTempDir(repoPath);
  });

  it('extracts and classifies @edifice.io/* pins from dependencies and devDependencies', () => {
    repoPath = mkdtempSync(join(tmpdir(), 'impact-analyzer-pins-'));
    writePackageJson(repoPath, null, {
      name: 'app',
      dependencies: {
        '@edifice.io/react': 'develop',
        '@edifice.io/bootstrap': '2.5.24',
        '@edifice.io/community-client-rest': 'workspace:*',
        'react': '18.3.1',
      },
      devDependencies: {
        '@edifice.io/client': '^2.5.0',
      },
    });

    const pins = readEdificePins(join(repoPath, 'package.json'));
    const byPackage = Object.fromEntries(pins.map((p) => [p.package, p]));

    expect(pins).toHaveLength(4);
    expect(byPackage['@edifice.io/react']).toEqual({
      package: '@edifice.io/react',
      raw: 'develop',
      type: 'branch',
    });
    expect(byPackage['@edifice.io/bootstrap'].type).toBe('semver');
    expect(byPackage['@edifice.io/community-client-rest'].type).toBe(
      'workspace',
    );
    expect(byPackage['@edifice.io/client'].type).toBe('semver');
  });
});
