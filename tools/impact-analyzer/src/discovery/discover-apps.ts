import { existsSync } from 'node:fs';
import type { RegisteredApp } from '../registry/apps-registry.js';
import type { ScanError } from '../types/index-schema.js';
import {
  readRepoState,
  resolveRepoPath,
  RepoNotFoundError,
} from './local-repo-resolver.js';
import {
  type AppLayout,
  type PinEntry,
  readEdificePins,
  resolveAppLayout,
} from './pin-reader.js';

export interface DiscoveredApp {
  app: RegisteredApp;
  repoPath: string;
  branch: string;
  commit: string;
  dirty: boolean;
  layout: AppLayout;
  pins: PinEntry[];
}

export interface DiscoveryResult {
  discovered: DiscoveredApp[];
  scanErrors: ScanError[];
}

/**
 * Local-mode discovery: reads whatever is currently checked out for each
 * registered app, without ever switching branches. An app currently on a
 * branch other than the confirmed V1 branches (e.g. a feature branch) is
 * NOT an error — its data is still collected and labelled with the real
 * branch/commit (plan §9/§12: local mode reflects the developer's disk,
 * not a normalized state). `scanErrors` is reserved for genuine failures:
 * repo missing on disk, not a git repo, or no readable package.json.
 */
export function discoverApps(apps: RegisteredApp[]): DiscoveryResult {
  const discovered: DiscoveredApp[] = [];
  const scanErrors: ScanError[] = [];

  for (const app of apps) {
    const repoPath = resolveRepoPath(app.repo);
    try {
      if (!existsSync(repoPath)) {
        throw new RepoNotFoundError(`Repo not found on disk: ${repoPath}`);
      }

      const { branch, commit, dirty } = readRepoState(repoPath);
      const layout = resolveAppLayout(repoPath);
      const pins = readEdificePins(layout.packageJsonPath);

      discovered.push({ app, repoPath, branch, commit, dirty, layout, pins });
    } catch (error) {
      scanErrors.push({
        app: app.name,
        branch: null,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return { discovered, scanErrors };
}
