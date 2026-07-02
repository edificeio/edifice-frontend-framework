import { dirname, join } from 'node:path';
import { analyzeAppUsage } from '../app-usage/analyze-app.js';
import { resolveAppTsconfigPath } from '../app-usage/resolve-app-tsconfig.js';
import { buildCssMap, type CssAppContext } from '../css/build-css-map.js';
import {
  discoverAppsRemote,
  type DiscoveredRemoteApp,
} from '../discovery/discover-apps-remote.js';
import { requireGithubToken } from '../discovery/github-credentials.js';
import type { GithubClientOptions } from '../discovery/github-client.js';
import { readRepoState } from '../discovery/local-repo-resolver.js';
import {
  cleanupClone,
  cloneTargetSparse,
  type ClonedRepo,
} from '../discovery/remote-clone.js';
import {
  buildFfMap,
  FF_PACKAGES,
  type FfPackageSpec,
} from '../ff-map/build-ff-map.js';
import { currentFfRepoRoot, type FfEntryMap } from '../ff-map/entry-points.js';
import {
  loadAppsRegistry,
  type RegisteredApp,
} from '../registry/apps-registry.js';
import type {
  ConsumerEntry,
  ImpactIndex,
  OutOfContractImport,
  ScanError,
  SymbolEntry,
} from '../types/index-schema.js';
import { aggregateIconConsumers } from './aggregate-icon-consumers.js';

export interface BuildCiIndexOptions {
  /** FF repo — always local, the tool runs inside it, same as buildLocalIndex. */
  repoRoot?: string;
  ffPackages?: FfPackageSpec[];
  ffEntryMap?: FfEntryMap;
  bootstrapSrcDir?: string;
  githubClientOptions?: GithubClientOptions;
}

interface ActiveClone {
  discoveredApp: DiscoveredRemoteApp;
  cloned: ClonedRepo;
  tsconfigPath: string;
}

/**
 * CI-mode counterpart to buildLocalIndex: apps are discovered remotely
 * (discoverAppsRemote) and their source cloned into disposable sparse
 * checkouts, but the FF side is always read locally — the tool runs inside
 * this repo, never via the API. analyzeAppUsage/buildCssMap/buildFfMap are
 * reused completely unmodified; only the srcRoot they're pointed at
 * differs (a temp clone instead of a sibling repo already on disk).
 *
 * Clones must stay alive through both the JS and CSS passes, so they're
 * collected first into `activeClones` and cleaned up together in one
 * `finally` at the end — unlike local mode, which never needs to clean up
 * anything (nothing was cloned).
 */
export async function buildCiIndex(
  apps: RegisteredApp[] = loadAppsRegistry(),
  options: BuildCiIndexOptions = {},
): Promise<ImpactIndex> {
  const repoRoot = options.repoRoot ?? currentFfRepoRoot();
  const ffState = readRepoState(repoRoot);

  const symbols = buildFfMap(
    repoRoot,
    options.ffPackages ?? FF_PACKAGES,
    options.ffEntryMap,
  );
  const knownEntries = [
    ...new Set(symbols.map((s) => `${s.package}|${s.entry}`)),
  ].map((key) => {
    const separatorIndex = key.indexOf('|');
    return {
      package: key.slice(0, separatorIndex),
      entry: key.slice(separatorIndex + 1),
    };
  });
  const symbolByKey = new Map<string, SymbolEntry>();
  for (const s of symbols)
    symbolByKey.set(`${s.package}|${s.entry}|${s.name}`, s);

  const { discovered, scanErrors: discoveryErrors } = await discoverAppsRemote(
    apps,
    {
      githubClientOptions: options.githubClientOptions,
    },
  );

  const scanErrors: ScanError[] = [...discoveryErrors];
  const outOfContractImports: OutOfContractImport[] = [];
  const activeClones: ActiveClone[] = [];

  try {
    for (const app of discovered) {
      try {
        const token = requireGithubToken(app.app.org);
        const cloned = cloneTargetSparse({
          org: app.app.org,
          repo: app.app.repo,
          branch: app.branch,
          token,
          sparsePath: app.layout.srcRelPath,
        });

        const appDir = join(
          cloned.repoPath,
          dirname(app.layout.packageJsonRelPath),
        );
        const tsconfigPath = resolveAppTsconfigPath(appDir);
        if (!tsconfigPath) {
          cleanupClone(cloned);
          scanErrors.push({
            app: app.app.name,
            branch: app.branch,
            error: `No usable tsconfig found under ${appDir} (checked tsconfig.app.json, tsconfig.lib.json, tsconfig.json)`,
          });
          continue;
        }

        activeClones.push({ discoveredApp: app, cloned, tsconfigPath });
      } catch (error) {
        scanErrors.push({
          app: app.app.name,
          branch: app.branch,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    for (const { discoveredApp, cloned, tsconfigPath } of activeClones) {
      const srcRoot = join(cloned.repoPath, discoveredApp.layout.srcRelPath);
      let result;
      try {
        result = analyzeAppUsage(srcRoot, tsconfigPath, knownEntries);
      } catch (error) {
        scanErrors.push({
          app: discoveredApp.app.name,
          branch: discoveredApp.branch,
          error: error instanceof Error ? error.message : String(error),
        });
        continue;
      }

      for (const usage of result.usages) {
        const symbol = symbolByKey.get(
          `${usage.package}|${usage.entry}|${usage.importedName}`,
        );
        if (!symbol) continue;

        const pin = discoveredApp.pins.find((p) => p.package === usage.package);
        const consumer: ConsumerEntry = {
          app: discoveredApp.app.name,
          org: discoveredApp.app.org,
          appBranch: discoveredApp.branch,
          pins: pin?.raw ?? 'unknown',
          appCommit: discoveredApp.commit,
          appDirty: false, // a fresh clone is never dirty
          usageSites: usage.usageSites,
          files: usage.files,
        };
        if (usage.viaNamespace) consumer.viaNamespace = true;
        symbol.consumers.push(consumer);
      }

      for (const outOfContract of result.outOfContractImports) {
        outOfContractImports.push({
          app: discoveredApp.app.name,
          appBranch: discoveredApp.branch,
          package: outOfContract.package,
          importPath: outOfContract.importPath,
          files: outOfContract.files,
        });
      }
    }

    aggregateIconConsumers(symbols);

    const cssApps: CssAppContext[] = activeClones.map(
      ({ discoveredApp, cloned }) => ({
        appName: discoveredApp.app.name,
        appBranch: discoveredApp.branch,
        pinsBootstrap: discoveredApp.pins.some(
          (p) => p.package === '@edifice.io/bootstrap',
        ),
        srcRoot: join(cloned.repoPath, discoveredApp.layout.srcRelPath),
      }),
    );
    const bootstrapSrcDir =
      options.bootstrapSrcDir ?? join(repoRoot, 'packages', 'bootstrap', 'src');
    const { cssComponents, cssGlobalRisks } = buildCssMap(
      bootstrapSrcDir,
      symbols,
      cssApps,
    );

    return {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      mode: 'ci',
      ffBranch: ffState.branch,
      ffCommit: ffState.commit,
      ffDirty: ffState.dirty,
      packages: [...new Set(symbols.map((s) => s.package))],
      scanErrors,
      symbols,
      outOfContractImports,
      cssComponents,
      cssGlobalRisks,
    };
  } finally {
    for (const { cloned } of activeClones) cleanupClone(cloned);
  }
}
