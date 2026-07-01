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
 */
export function resolveAppLayout(repoPath: string): AppLayout {
  const frontendPkg = join(repoPath, 'frontend', 'package.json');
  if (existsSync(frontendPkg)) {
    return {
      packageJsonPath: frontendPkg,
      srcRoot: join(repoPath, 'frontend', 'src'),
      usesFrontendSubdir: true,
    };
  }

  const rootPkg = join(repoPath, 'package.json');
  if (existsSync(rootPkg)) {
    return {
      packageJsonPath: rootPkg,
      srcRoot: join(repoPath, 'src'),
      usesFrontendSubdir: false,
    };
  }

  throw new AppLayoutNotFoundError(
    `Neither frontend/package.json nor package.json found under ${repoPath}`,
  );
}

export type PinType = 'branch' | 'semver' | 'workspace';

export interface PinEntry {
  package: string;
  raw: string;
  type: PinType;
}

function classifyPin(raw: string): PinType {
  if (raw.startsWith('workspace:')) return 'workspace';
  if (/^[\^~]?\d/.test(raw)) return 'semver';
  return 'branch';
}

/** Reads @edifice.io/* dependency pins from a package.json (dependencies + devDependencies). */
export function readEdificePins(packageJsonPath: string): PinEntry[] {
  const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
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
