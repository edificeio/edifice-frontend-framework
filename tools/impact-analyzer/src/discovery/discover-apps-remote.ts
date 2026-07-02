import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { RegisteredApp } from '../registry/apps-registry.js';
import type { ScanError } from '../types/index-schema.js';
import {
  fetchBranchHead,
  fetchFileContent,
  type GithubClientOptions,
} from './github-client.js';
import { requireGithubToken } from './github-credentials.js';
import {
  extractEdificePinsFromPackageJson,
  type PinEntry,
} from './pin-reader.js';

const DEFAULT_BRANCHES_PATH = fileURLToPath(
  new URL('../../config/branches.json', import.meta.url),
);

export function loadV1Branches(path: string = DEFAULT_BRANCHES_PATH): string[] {
  return JSON.parse(readFileSync(path, 'utf-8'));
}

export interface RemoteAppLayout {
  packageJsonRelPath: 'frontend/package.json' | 'package.json';
  srcRelPath: 'frontend/src' | 'src';
}

export interface DiscoveredRemoteApp {
  app: RegisteredApp;
  branch: string;
  commit: string;
  layout: RemoteAppLayout;
  pins: PinEntry[];
}

export interface RemoteDiscoveryResult {
  discovered: DiscoveredRemoteApp[];
  scanErrors: ScanError[];
}

export interface DiscoverAppsRemoteOptions {
  v1Branches?: string[];
  githubClientOptions?: GithubClientOptions;
}

/**
 * CI-mode discovery: reads package.json content via the GitHub Contents
 * API instead of a local checkout — for every (app, branch) pair where
 * `branch` is one of the confirmed V1 branches this app actually has
 * (`app.branches`, never anything outside that list). A branch missing on
 * GitHub is skipped silently (plan §4: not every app has every V1 branch);
 * a missing package.json on a branch that DOES exist is a real anomaly and
 * becomes a scanError, same as AppLayoutNotFoundError in local mode.
 */
export async function discoverAppsRemote(
  apps: RegisteredApp[],
  options: DiscoverAppsRemoteOptions = {},
): Promise<RemoteDiscoveryResult> {
  const v1Branches = options.v1Branches ?? loadV1Branches();
  const discovered: DiscoveredRemoteApp[] = [];
  const scanErrors: ScanError[] = [];

  for (const app of apps) {
    const branchesToCheck = app.branches.filter((b) => v1Branches.includes(b));

    for (const branch of branchesToCheck) {
      try {
        const token = requireGithubToken(app.org);

        const head = await fetchBranchHead(
          app.org,
          app.repo,
          branch,
          token,
          options.githubClientOptions,
        );
        if (!head) continue; // branch doesn't exist on GitHub for this app — silent skip, not an error.

        const frontendContent = await fetchFileContent(
          app.org,
          app.repo,
          'frontend/package.json',
          branch,
          token,
          options.githubClientOptions,
        );
        const layout: RemoteAppLayout = frontendContent
          ? {
              packageJsonRelPath: 'frontend/package.json',
              srcRelPath: 'frontend/src',
            }
          : { packageJsonRelPath: 'package.json', srcRelPath: 'src' };

        const content =
          frontendContent ??
          (await fetchFileContent(
            app.org,
            app.repo,
            'package.json',
            branch,
            token,
            options.githubClientOptions,
          ));

        if (!content) {
          scanErrors.push({
            app: app.name,
            branch,
            error: `Neither frontend/package.json nor package.json found on branch "${branch}"`,
          });
          continue;
        }

        const pins = extractEdificePinsFromPackageJson(content);
        discovered.push({ app, branch, commit: head.sha, layout, pins });
      } catch (error) {
        scanErrors.push({
          app: app.name,
          branch,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  return { discovered, scanErrors };
}
