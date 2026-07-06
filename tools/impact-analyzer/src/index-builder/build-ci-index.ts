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
  AppBranchState,
  ConsumerEntry,
  ImpactIndex,
  OutOfContractImport,
  ScanError,
  SymbolEntry,
} from '../types/index-schema.js';
import { aggregateIconConsumers } from './aggregate-icon-consumers.js';
import {
  carryForwardCssConsumers,
  carryForwardOutOfContract,
  carryForwardSymbolConsumers,
  findAppState,
} from './carry-forward.js';

export interface BuildCiIndexOptions {
  /** FF repo — always local, the tool runs inside it, same as buildLocalIndex. */
  repoRoot?: string;
  ffPackages?: FfPackageSpec[];
  ffEntryMap?: FfEntryMap;
  bootstrapSrcDir?: string;
  githubClientOptions?: GithubClientOptions;
  /** Previous run's index (e.g. loaded from the CRON's data repo) — enables the incremental cache (plan §9). */
  previousIndex?: ImpactIndex;
}

interface ActiveClone {
  discoveredApp: DiscoveredRemoteApp;
  cloned: ClonedRepo;
  tsconfigPath: string;
}

/** An app-branch this run didn't clone (cache hit or stale fallback) — still needs CSS/global-risk carry-forward. */
interface CarriedForwardApp {
  discoveredApp: DiscoveredRemoteApp;
}

/**
 * CI-mode counterpart to buildLocalIndex: apps are discovered remotely
 * (discoverAppsRemote) and their source cloned into disposable sparse
 * checkouts, but the FF side is always read locally — the tool runs inside
 * this repo, never via the API. analyzeAppUsage/buildCssMap/buildFfMap are
 * reused completely unmodified; only the srcRoot they're pointed at
 * differs (a temp clone instead of a sibling repo already on disk).
 *
 * Incremental cache (plan §9): each app-branch's commit is tracked in
 * `appStates`. When `options.previousIndex` is given and a branch's head
 * commit hasn't moved since then, its consumer/CSS data is carried forward
 * (carry-forward.ts) instead of re-cloning and re-analyzing. On a genuine
 * failure (clone/analyze error), previous data is also carried forward if
 * available — marked `staleSince` on the scanError — rather than making the
 * app disappear from the index (plan §9 resilience). Without
 * `previousIndex`, every app is a cache miss and behavior is identical to
 * before this feature.
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
  const previousIndex = options.previousIndex;
  const previousSymbols = previousIndex?.symbols ?? [];
  const previousOutOfContract = previousIndex?.outOfContractImports ?? [];
  const previousCssComponents = previousIndex?.cssComponents ?? [];

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
  const carriedForwardApps: CarriedForwardApp[] = [];
  const appStates: AppBranchState[] = [];

  try {
    for (const app of discovered) {
      const cachedState = findAppState(previousIndex, app.app.name, app.branch);

      if (cachedState && cachedState.commit === app.commit) {
        carryForwardSymbolConsumers(
          symbols,
          previousSymbols,
          app.app.name,
          app.branch,
        );
        outOfContractImports.push(
          ...carryForwardOutOfContract(
            previousOutOfContract,
            app.app.name,
            app.branch,
          ),
        );
        carriedForwardApps.push({ discoveredApp: app });
        appStates.push({
          app: app.app.name,
          branch: app.branch,
          commit: app.commit,
        });
        continue;
      }

      let clonedThisIteration: ClonedRepo | undefined;
      try {
        const token = requireGithubToken(app.app.org);
        clonedThisIteration = cloneTargetSparse({
          org: app.app.org,
          repo: app.app.repo,
          branch: app.branch,
          token,
          sparsePath: app.layout.srcRelPath,
        });

        const appDir = join(
          clonedThisIteration.repoPath,
          dirname(app.layout.packageJsonRelPath),
        );
        const tsconfigPath = resolveAppTsconfigPath(appDir);
        if (!tsconfigPath) {
          throw new Error(
            `No usable tsconfig found under ${appDir} (checked tsconfig.app.json, tsconfig.lib.json, tsconfig.json)`,
          );
        }

        const srcRoot = join(
          clonedThisIteration.repoPath,
          app.layout.srcRelPath,
        );
        const result = analyzeAppUsage(srcRoot, tsconfigPath, knownEntries);

        for (const usage of result.usages) {
          const symbol = symbolByKey.get(
            `${usage.package}|${usage.entry}|${usage.importedName}`,
          );
          if (!symbol) continue;

          const pin = app.pins.find((p) => p.package === usage.package);
          const consumer: ConsumerEntry = {
            app: app.app.name,
            org: app.app.org,
            appBranch: app.branch,
            pins: pin?.raw ?? 'unknown',
            appCommit: app.commit,
            appDirty: false, // a fresh clone is never dirty
            usageSites: usage.usageSites,
            files: usage.files,
          };
          if (usage.viaNamespace) consumer.viaNamespace = true;
          symbol.consumers.push(consumer);
        }

        for (const outOfContract of result.outOfContractImports) {
          outOfContractImports.push({
            app: app.app.name,
            appBranch: app.branch,
            package: outOfContract.package,
            importPath: outOfContract.importPath,
            files: outOfContract.files,
          });
        }

        activeClones.push({
          discoveredApp: app,
          cloned: clonedThisIteration,
          tsconfigPath,
        });
        appStates.push({
          app: app.app.name,
          branch: app.branch,
          commit: app.commit,
        });
      } catch (error) {
        if (clonedThisIteration) cleanupClone(clonedThisIteration);

        scanErrors.push({
          app: app.app.name,
          branch: app.branch,
          error: error instanceof Error ? error.message : String(error),
          ...(cachedState && previousIndex
            ? { staleSince: previousIndex.generatedAt }
            : {}),
        });

        if (cachedState) {
          carryForwardSymbolConsumers(
            symbols,
            previousSymbols,
            app.app.name,
            app.branch,
          );
          outOfContractImports.push(
            ...carryForwardOutOfContract(
              previousOutOfContract,
              app.app.name,
              app.branch,
            ),
          );
          carriedForwardApps.push({ discoveredApp: app });
          appStates.push(cachedState); // keep the OLD commit so the next run still attempts a real scan.
        }
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
    const { cssComponents, cssGlobalRisks, cssScanErrors } = buildCssMap(
      bootstrapSrcDir,
      symbols,
      cssApps,
    );
    scanErrors.push(...cssScanErrors);

    // Cache-hit/stale apps weren't cloned this run, so buildCssMap never saw
    // them — reattach their CSS consumers, and their name in cssGlobalRisks
    // if they pin bootstrap (derivable from pins alone, no clone needed).
    for (const { discoveredApp } of carriedForwardApps) {
      carryForwardCssConsumers(
        cssComponents,
        previousCssComponents,
        discoveredApp.app.name,
        discoveredApp.branch,
      );

      const pinsBootstrap = discoveredApp.pins.some(
        (p) => p.package === '@edifice.io/bootstrap',
      );
      if (pinsBootstrap) {
        for (const risk of cssGlobalRisks) {
          if (!risk.affectedApps.includes(discoveredApp.app.name)) {
            risk.affectedApps.push(discoveredApp.app.name);
          }
        }
      }
    }

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
      appStates,
    };
  } finally {
    for (const { cloned } of activeClones) cleanupClone(cloned);
  }
}
