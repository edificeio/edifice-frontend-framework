import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanupTempDir, writePackageJson } from './test-utils.js';
import {
  AppLayoutNotFoundError,
  extractEdificePinsFromPackageJson,
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

  it('resolves a layout under a repo-relative appPath (monorepo)', () => {
    repoPath = mkdtempSync(join(tmpdir(), 'impact-analyzer-layout-'));
    writePackageJson(repoPath, 'conversation/frontend', {
      name: 'conversation-frontend',
    });

    const layout = resolveAppLayout(repoPath, 'conversation');
    expect(layout.usesFrontendSubdir).toBe(true);
    expect(layout.packageJsonPath).toBe(
      join(repoPath, 'conversation', 'frontend', 'package.json'),
    );
    expect(layout.srcRoot).toBe(
      join(repoPath, 'conversation', 'frontend', 'src'),
    );
  });

  it('falls back to frontend/package.json.template when the real package.json is absent (appPath given)', () => {
    repoPath = mkdtempSync(join(tmpdir(), 'impact-analyzer-layout-'));
    writePackageJson(
      repoPath,
      'conversation/frontend',
      { name: 'conversation-frontend', dependencies: {} },
      'package.json.template',
    );

    const layout = resolveAppLayout(repoPath, 'conversation');
    expect(layout.usesFrontendSubdir).toBe(true);
    expect(layout.packageJsonPath).toBe(
      join(repoPath, 'conversation', 'frontend', 'package.json.template'),
    );
    expect(layout.srcRoot).toBe(
      join(repoPath, 'conversation', 'frontend', 'src'),
    );
  });

  it('falls back to frontend/package.json.template when there is no appPath either', () => {
    repoPath = mkdtempSync(join(tmpdir(), 'impact-analyzer-layout-'));
    writePackageJson(
      repoPath,
      'frontend',
      { name: 'app-frontend' },
      'package.json.template',
    );

    const layout = resolveAppLayout(repoPath);
    expect(layout.packageJsonPath).toBe(
      join(repoPath, 'frontend', 'package.json.template'),
    );
  });

  it('prefers the real frontend/package.json over the template when both exist', () => {
    repoPath = mkdtempSync(join(tmpdir(), 'impact-analyzer-layout-'));
    writePackageJson(repoPath, 'frontend', { name: 'real' });
    writePackageJson(
      repoPath,
      'frontend',
      { name: 'template' },
      'package.json.template',
    );

    const layout = resolveAppLayout(repoPath);
    expect(layout.packageJsonPath).toBe(
      join(repoPath, 'frontend', 'package.json'),
    );
  });

  it('names the probed base directory in the error when nothing is found', () => {
    repoPath = mkdtempSync(join(tmpdir(), 'impact-analyzer-layout-'));

    expect(() => resolveAppLayout(repoPath, 'typo-subdir')).toThrow(
      join(repoPath, 'typo-subdir'),
    );
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

describe('extractEdificePinsFromPackageJson', () => {
  it('extracts pins from a raw JSON string, without touching the filesystem', () => {
    const content = JSON.stringify({
      name: 'app',
      dependencies: {
        '@edifice.io/react': 'develop-enabling',
        'react': '18.3.1',
      },
    });

    const pins = extractEdificePinsFromPackageJson(content);
    expect(pins).toEqual([
      { package: '@edifice.io/react', raw: 'develop-enabling', type: 'branch' },
    ]);
  });

  it('is the function readEdificePins delegates to (same classification)', () => {
    const content = JSON.stringify({
      dependencies: { '@edifice.io/utilities': 'workspace:*' },
    });
    expect(extractEdificePinsFromPackageJson(content)[0].type).toBe(
      'workspace',
    );
  });

  it('classifies a %placeholder% pin as "template" (entcore package.json.template)', () => {
    const content = JSON.stringify({
      dependencies: { '@edifice.io/react': '%packageVersion%' },
    });
    expect(extractEdificePinsFromPackageJson(content)).toEqual([
      {
        package: '@edifice.io/react',
        raw: '%packageVersion%',
        type: 'template',
      },
    ]);
  });

  // Regression guards: %packageVersion% must NOT be swallowed by the
  // pre-existing "branch" fallthrough, and unrelated pin shapes must keep
  // classifying the same way now that the template check runs first.
  it('still classifies a real branch name as "branch"', () => {
    const content = JSON.stringify({
      dependencies: { '@edifice.io/react': 'develop-enabling' },
    });
    expect(extractEdificePinsFromPackageJson(content)[0].type).toBe('branch');
  });

  it('still classifies a pinned semver as "semver"', () => {
    const content = JSON.stringify({
      dependencies: {
        '@edifice.io/react': '2.5.24-develop-enabling.20260629161142',
      },
    });
    expect(extractEdificePinsFromPackageJson(content)[0].type).toBe('semver');
  });
});
