import { dirname, join } from 'node:path';
import {
  analyzeAppUsage,
  type AnalyzeAppResult,
} from '../app-usage/analyze-app.js';
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
import { runWithConcurrencyLimit } from './concurrency-pool.js';
import { toRepoRelativeFiles } from './repo-relative.js';
import {
  carryForwardCssConsumers,
  carryForwardOutOfContract,
  carryForwardSymbolConsumers,
  findAppState,
} from './carry-forward.js';

// A registry sized for ~10 apps could afford full parallelism, but this is
// also the concurrency GitHub sees on the clone step — bounded well under
// its abuse-detection thresholds regardless of registry size (plan §9,
// REVIEW-impact-analyzer.md P4.1).
const DEFAULT_CLONE_CONCURRENCY = 6;

export interface BuildCiIndexOptions {
  /** FF repo — always local, the tool runs inside it, same as buildLocalIndex. */
  repoRoot?: string;
  ffPackages?: FfPackageSpec[];
  ffEntryMap?: FfEntryMap;
  bootstrapSrcDir?: string;
  githubClientOptions?: GithubClientOptions;
  /** Previous run's index (e.g. loaded from the CRON's data repo) — enables the incremental cache (plan §9). */
  previousIndex?: ImpactIndex;
  /** Max app-branches cloned/analyzed at once. Defaults to DEFAULT_CLONE_CONCURRENCY. */
  cloneConcurrency?: number;
  /**
   * Precomputed FF symbol table — skips this function's own buildFfMap call
   * when given. Lets build-diff-report.ts reuse the buildFfDeclarationsMap
   * pass it already ran for head instead of a second full ts-morph
   * traversal of the same repoRoot/commit (P4.4 follow-up,
   * REVIEW-impact-analyzer.md §2.4 "trois passes ts-morph FF complètes par
   * diff"). Mutated in place (consumers attached) — pass a fresh array.
   */
  ffSymbols?: SymbolEntry[];
}

interface ActiveClone {
  discoveredApp: DiscoveredRemoteApp;
  cloned: ClonedRepo;
  tsconfigPath: string;
  /** Reused by the CSS pass instead of reading this app's files from disk again (P4.3). */
  fileContents: { path: string; content: string }[];
}

/** An app-branch this run didn't clone (cache hit or stale fallback) — still needs CSS/global-risk carry-forward. */
interface CarriedForwardApp {
  discoveredApp: DiscoveredRemoteApp;
}

/**
 * Result of the network/clone/analyze phase for one app-branch — carries no
 * side effect of its own, so it can be produced concurrently (bounded pool)
 * without racing on the shared `symbols`/`scanErrors`/etc. collections.
 * Applying it (pushing consumers, recording scanErrors...) happens
 * afterwards in a plain sequential loop, in the original `discovered`
 * order, so the resulting index stays byte-for-byte deterministic
 * regardless of which app-branch's network call happened to finish first.
 */
type AppOutcome =
  | { kind: 'cache-hit'; app: DiscoveredRemoteApp; cachedState: AppBranchState }
  | {
      kind: 'cloned';
      app: DiscoveredRemoteApp;
      cloned: ClonedRepo;
      tsconfigPath: string;
      result: AnalyzeAppResult;
    }
  | {
      kind: 'error';
      app: DiscoveredRemoteApp;
      message: string;
      cachedState: AppBranchState | undefined;
    };

/**
 * Network/clone/analyze work for a single app-branch — the part that's
 * safe to run concurrently. Never throws: any failure (missing token,
 * clone/timeout, missing tsconfig, analyze error) becomes an `'error'`
 * outcome instead, same resilience contract as before (plan §9: an
 * isolated failure never aborts the rest of the run).
 */
async function processApp(
  app: DiscoveredRemoteApp,
  knownEntries: { package: string; entry: string }[],
  previousIndex: ImpactIndex | undefined,
): Promise<AppOutcome> {
  const cachedState = findAppState(previousIndex, app.app.name, app.branch);
  if (cachedState && cachedState.commit === app.commit) {
    return { kind: 'cache-hit', app, cachedState };
  }

  let cloned: ClonedRepo | undefined;
  try {
    const token = requireGithubToken(app.app.org);
    cloned = await cloneTargetSparse({
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
      throw new Error(
        `No usable tsconfig found under ${appDir} (checked tsconfig.app.json, tsconfig.lib.json, tsconfig.json)`,
      );
    }

    const srcRoot = join(cloned.repoPath, app.layout.srcRelPath);
    const result = analyzeAppUsage(srcRoot, tsconfigPath, knownEntries);

    return { kind: 'cloned', app, cloned, tsconfigPath, result };
  } catch (error) {
    if (cloned) cleanupClone(cloned);
    return {
      kind: 'error',
      app,
      message: error instanceof Error ? error.message : String(error),
      cachedState,
    };
  }
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

  const symbols =
    options.ffSymbols ??
    buildFfMap(repoRoot, options.ffPackages ?? FF_PACKAGES, options.ffEntryMap);
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
    // Network/clone/analyze work runs with bounded concurrency (plan §9,
    // REVIEW-impact-analyzer.md P4.1 — a fully sequential loop over a
    // growing app registry made this the dominant cost of a CI run).
    // Applying each outcome below stays a plain sequential loop over
    // `discovered`'s original order, so the resulting index is unaffected
    // by which network call happened to resolve first.
    const outcomes = await runWithConcurrencyLimit(
      discovered,
      options.cloneConcurrency ?? DEFAULT_CLONE_CONCURRENCY,
      (app) => processApp(app, knownEntries, previousIndex),
    );

    for (const outcome of outcomes) {
      const app = outcome.app;

      if (outcome.kind === 'cache-hit') {
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

      if (outcome.kind === 'error') {
        scanErrors.push({
          app: app.app.name,
          branch: app.branch,
          error: outcome.message,
          ...(outcome.cachedState && previousIndex
            ? { staleSince: previousIndex.generatedAt }
            : {}),
        });

        if (outcome.cachedState) {
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
          appStates.push(outcome.cachedState); // keep the OLD commit so the next run still attempts a real scan.
        }
        continue;
      }

      // outcome.kind === 'cloned'
      for (const usage of outcome.result.usages) {
        const symbol = symbolByKey.get(
          `${usage.package}|${usage.entry}|${usage.importedName}`,
        );
        if (!symbol) continue;

        const pin = app.pins.find((p) => p.package === usage.package);
        const consumer: ConsumerEntry = {
          app: app.app.name,
          org: app.app.org,
          repo: app.app.repo,
          appBranch: app.branch,
          pins: pin?.raw ?? 'unknown',
          appCommit: app.commit,
          appDirty: false, // a fresh clone is never dirty
          usageSites: usage.usageSites,
          files: toRepoRelativeFiles(outcome.cloned.repoPath, usage.files),
        };
        if (usage.viaNamespace) consumer.viaNamespace = true;
        symbol.consumers.push(consumer);
      }

      for (const outOfContract of outcome.result.outOfContractImports) {
        outOfContractImports.push({
          app: app.app.name,
          appBranch: app.branch,
          package: outOfContract.package,
          importPath: outOfContract.importPath,
          files: toRepoRelativeFiles(
            outcome.cloned.repoPath,
            outOfContract.files,
          ),
        });
      }

      activeClones.push({
        discoveredApp: app,
        cloned: outcome.cloned,
        tsconfigPath: outcome.tsconfigPath,
        fileContents: outcome.result.fileContents,
      });
      appStates.push({
        app: app.app.name,
        branch: app.branch,
        commit: app.commit,
      });
    }

    aggregateIconConsumers(symbols);

    const cssApps: CssAppContext[] = activeClones.map(
      ({ discoveredApp, cloned, fileContents }) => ({
        appName: discoveredApp.app.name,
        appBranch: discoveredApp.branch,
        org: discoveredApp.app.org,
        repo: discoveredApp.app.repo,
        appCommit: discoveredApp.commit,
        repoRoot: cloned.repoPath,
        pinsBootstrap: discoveredApp.pins.some(
          (p) => p.package === '@edifice.io/bootstrap',
        ),
        srcRoot: join(cloned.repoPath, discoveredApp.layout.srcRelPath),
        fileContents,
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
