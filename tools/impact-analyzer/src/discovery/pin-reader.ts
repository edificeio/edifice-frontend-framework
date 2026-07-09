import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface AppLayout {
  packageJsonPath: string;
  srcRoot: string;
  usesFrontendSubdir: boolean;
}

export class AppLayoutNotFoundError extends Error {}

/**
 * Consuming app repos have two observed layouts: `frontend/` only, or a
 * monorepo layout with a backend package.json at the root and a
 * `frontend/` subdir. FF dependency pins always live in the frontend
 * package.json when one exists.
 *
 * `appPath` (optional) is a repo-relative subdirectory for monorepos where
 * several registered apps share one repo (e.g. `edificeio/entcore`:
 * conversation/timeline/portal each under their own top-level dir). When
 * absent, `base` is the repo root itself — identical to the pre-existing
 * behavior.
 *
 * A third probe covers `frontend/package.json.template`: some entcore apps
 * gitignore the real `frontend/package.json` (generated at build time) and
 * commit a template instead, with `%packageVersion%`-style placeholder pins
 * (see `classifyPin`'s `'template'` case below).
 */
export function resolveAppLayout(
  repoPath: string,
  appPath?: string,
): AppLayout {
  const base = appPath ? join(repoPath, appPath) : repoPath;

  const frontendPkg = join(base, 'frontend', 'package.json');
  if (existsSync(frontendPkg)) {
    return {
      packageJsonPath: frontendPkg,
      srcRoot: join(base, 'frontend', 'src'),
      usesFrontendSubdir: true,
    };
  }

  const frontendPkgTemplate = join(base, 'frontend', 'package.json.template');
  if (existsSync(frontendPkgTemplate)) {
    return {
      packageJsonPath: frontendPkgTemplate,
      srcRoot: join(base, 'frontend', 'src'),
      usesFrontendSubdir: true,
    };
  }

  const rootPkg = join(base, 'package.json');
  if (existsSync(rootPkg)) {
    return {
      packageJsonPath: rootPkg,
      srcRoot: join(base, 'src'),
      usesFrontendSubdir: false,
    };
  }

  throw new AppLayoutNotFoundError(
    `Neither frontend/package.json, frontend/package.json.template, nor ` +
      `package.json found under ${base}`,
  );
}

export type PinType = 'branch' | 'semver' | 'workspace' | 'template';

export interface PinEntry {
  package: string;
  raw: string;
  type: PinType;
}

function classifyPin(raw: string): PinType {
  if (raw.startsWith('workspace:')) return 'workspace';
  if (/^%.+%$/.test(raw)) return 'template';
  if (/^[\^~]?\d/.test(raw)) return 'semver';
  return 'branch';
}

/**
 * Pure — receives already-read content (disk or the GitHub Contents API),
 * never touches the filesystem itself. Reused by both local (readEdificePins)
 * and remote (discover-apps-remote.ts) discovery, so pin classification
 * never diverges between the two modes.
 */
export function extractEdificePinsFromPackageJson(content: string): PinEntry[] {
  const pkg = JSON.parse(content);
  const deps: Record<string, string> = {
    ...(pkg.dependencies ?? {}),
    ...(pkg.devDependencies ?? {}),
  };

  return Object.entries(deps)
    .filter(([name]) => name.startsWith('@edifice.io/'))
    .map(([name, raw]) => ({
      package: name,
      raw,
      type: classifyPin(raw),
    }));
}

/** Reads @edifice.io/* dependency pins from a package.json on disk (dependencies + devDependencies). */
export function readEdificePins(packageJsonPath: string): PinEntry[] {
  return extractEdificePinsFromPackageJson(
    readFileSync(packageJsonPath, 'utf-8'),
  );
}
