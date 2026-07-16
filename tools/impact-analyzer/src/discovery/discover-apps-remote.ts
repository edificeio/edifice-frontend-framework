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

export interface RemoteAppLayout {
  // Widened from a closed literal union: with `app.path` prefixing (monorepo
  // apps sharing one repo, e.g. entcore), these are no longer one of 2 fixed
  // strings but `${prefix}frontend/package.json` etc.
  packageJsonRelPath: string;
  srcRelPath: string;
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
  githubClientOptions?: GithubClientOptions;
}

/**
 * CI-mode discovery: reads package.json content via the GitHub Contents
 * API instead of a local checkout — for every branch listed in
 * `app.branches` (the registry's per-app ground truth: branch naming isn't
 * uniform across repos, e.g. "dev" vs "develop", so it's used as-is, never
 * cross-checked against a generic name). A branch missing on GitHub is
 * skipped silently (not every app has every branch); a missing package.json
 * on a branch that DOES exist is a real anomaly and becomes a scanError,
 * same as AppLayoutNotFoundError in local mode.
 */
export async function discoverAppsRemote(
  apps: RegisteredApp[],
  options: DiscoverAppsRemoteOptions = {},
): Promise<RemoteDiscoveryResult> {
  const discovered: DiscoveredRemoteApp[] = [];
  const scanErrors: ScanError[] = [];

  for (const app of apps) {
    const branchesToCheck = app.branches;
    let discoveredForApp = 0;
    let scanErrorsForApp = 0;

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

        // `app.path` prefixes every candidate for monorepo apps sharing one
        // repo (e.g. entcore: conversation/timeline/portal). The template
        // probe covers entcore apps that gitignore the real
        // `frontend/package.json` (generated at build time) and commit a
        // `.template` with placeholder pins instead — see pin-reader.ts.
        const prefix = app.path ? `${app.path}/` : '';
        const candidates: RemoteAppLayout[] = [
          {
            packageJsonRelPath: `${prefix}frontend/package.json`,
            srcRelPath: `${prefix}frontend/src`,
          },
          {
            packageJsonRelPath: `${prefix}frontend/package.json.template`,
            srcRelPath: `${prefix}frontend/src`,
          },
          {
            packageJsonRelPath: `${prefix}package.json`,
            srcRelPath: `${prefix}src`,
          },
        ];

        let layout: RemoteAppLayout | undefined;
        let content: string | null = null;
        for (const candidate of candidates) {
          // Sequential by design: first hit wins, no need to fetch further candidates.
          content = await fetchFileContent(
            app.org,
            app.repo,
            candidate.packageJsonRelPath,
            branch,
            token,
            options.githubClientOptions,
          );
          if (content) {
            layout = candidate;
            break;
          }
        }

        if (!layout || !content) {
          scanErrorsForApp++;
          scanErrors.push({
            app: app.name,
            branch,
            error: `None of [${candidates.map((c) => c.packageJsonRelPath).join(', ')}] found on branch "${branch}"`,
          });
          continue;
        }

        const pins = extractEdificePinsFromPackageJson(content);
        discovered.push({ app, branch, commit: head.sha, layout, pins });
        discoveredForApp++;
      } catch (error) {
        scanErrorsForApp++;
        scanErrors.push({
          app: app.name,
          branch,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Every branch was individually a silent "doesn't exist" skip (line
    // above) — indistinguishable via the GitHub API from "repo/branch is
    // private and invisible to this token" (both return a plain 404). Since
    // this previously left the app missing from the report with 0
    // scanErrors — which cost real debugging time — surface it explicitly
    // instead of staying silent, without claiming to know the cause.
    if (
      branchesToCheck.length > 0 &&
      discoveredForApp === 0 &&
      scanErrorsForApp === 0
    ) {
      scanErrors.push({
        app: app.name,
        branch: branchesToCheck.join(', '),
        error: `No branch found on GitHub among [${branchesToCheck.join(', ')}] for ${app.org}/${app.repo} — could be genuinely absent, or the repo/branch is private and not visible to this token.`,
      });
    }
  }

  return { discovered, scanErrors };
}
