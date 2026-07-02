import { dirname, join } from 'node:path';
import { analyzeAppUsage } from '../app-usage/analyze-app.js';
import { resolveAppTsconfigPath } from '../app-usage/resolve-app-tsconfig.js';
import { buildCssMap, type CssAppContext } from '../css/build-css-map.js';
import { discoverApps } from '../discovery/discover-apps.js';
import { readRepoState } from '../discovery/local-repo-resolver.js';
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

export interface BuildIndexOptions {
  /** Overridable for tests — defaults to the real monorepo this tool lives in. */
  repoRoot?: string;
  ffPackages?: FfPackageSpec[];
  ffEntryMap?: FfEntryMap;
  bootstrapSrcDir?: string;
}

/**
 * Builds the full impact index by running discovery, the FF map, and
 * per-app usage analysis, then stitching per-app usage back onto each
 * FF symbol as a ConsumerEntry. Local mode only (plan Jalons 0-3):
 * everything reflects whatever is currently checked out on disk, for the
 * FF repo itself and for every registered app.
 */
export function buildLocalIndex(
  apps: RegisteredApp[] = loadAppsRegistry(),
  options: BuildIndexOptions = {},
): ImpactIndex {
  const repoRoot = options.repoRoot ?? currentFfRepoRoot();
  const ffState = readRepoState(repoRoot);

  const { discovered, scanErrors: discoveryErrors } = discoverApps(apps);

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

  const scanErrors: ScanError[] = [...discoveryErrors];
  const outOfContractImports: OutOfContractImport[] = [];

  for (const app of discovered) {
    const appDir = dirname(app.layout.packageJsonPath);
    const tsconfigPath = resolveAppTsconfigPath(appDir);
    if (!tsconfigPath) {
      scanErrors.push({
        app: app.app.name,
        branch: app.branch,
        error: `No usable tsconfig found under ${appDir} (checked tsconfig.app.json, tsconfig.lib.json, tsconfig.json)`,
      });
      continue;
    }

    let result;
    try {
      result = analyzeAppUsage(app.layout.srcRoot, tsconfigPath, knownEntries);
    } catch (error) {
      scanErrors.push({
        app: app.app.name,
        branch: app.branch,
        error: error instanceof Error ? error.message : String(error),
      });
      continue;
    }

    for (const usage of result.usages) {
      const symbol = symbolByKey.get(
        `${usage.package}|${usage.entry}|${usage.importedName}`,
      );
      if (!symbol) continue; // resolved to a real export we don't otherwise track (rare) — skip rather than guess.

      const pin = app.pins.find((p) => p.package === usage.package);
      const consumer: ConsumerEntry = {
        app: app.app.name,
        org: app.app.org,
        appBranch: app.branch,
        pins: pin?.raw ?? 'unknown',
        appCommit: app.commit,
        appDirty: app.dirty,
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
  }

  aggregateIconConsumers(symbols);

  const cssApps: CssAppContext[] = discovered.map((app) => ({
    appName: app.app.name,
    appBranch: app.branch,
    pinsBootstrap: app.pins.some((p) => p.package === '@edifice.io/bootstrap'),
    srcRoot: app.layout.srcRoot,
  }));
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
    mode: 'local',
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
}
