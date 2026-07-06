import { existsSync, readFileSync } from 'node:fs';
import { buildCiIndex } from '../index-builder/build-ci-index.js';
import { buildLocalIndex } from '../index-builder/build-index.js';
import { writeIndex } from '../index-builder/write-index.js';
import {
  isCompatibleImpactIndex,
  type ImpactIndex,
} from '../types/index-schema.js';

export interface RunGenerateOptions {
  /** Path to a previous run's index.json (e.g. from the CRON's data repo) — enables the incremental cache in --mode=ci. Ignored in local mode, and if the file doesn't exist (first run). */
  cachePath?: string;
}

export async function runGenerate(
  mode: string,
  options: RunGenerateOptions = {},
): Promise<void> {
  if (mode !== 'local' && mode !== 'ci') {
    console.error(`Unknown mode "${mode}". Supported: local, ci.`);
    process.exitCode = 1;
    return;
  }

  let previousIndex: ImpactIndex | undefined;
  if (mode === 'ci' && options.cachePath && existsSync(options.cachePath)) {
    const parsed: unknown = JSON.parse(
      readFileSync(options.cachePath, 'utf-8'),
    );
    if (isCompatibleImpactIndex(parsed)) {
      previousIndex = parsed;
    } else {
      console.warn(
        `Cache file ${options.cachePath} has an incompatible or missing schemaVersion — ignoring it (full re-scan for this run).`,
      );
    }
  }

  const index: ImpactIndex =
    mode === 'ci'
      ? await buildCiIndex(undefined, { previousIndex })
      : buildLocalIndex();
  const filePath = writeIndex(index);

  console.log(`Wrote ${filePath}`);
  console.log(
    `  mode=${index.mode} ffBranch=${index.ffBranch} ffCommit=${index.ffCommit.slice(0, 7)} ffDirty=${index.ffDirty}`,
  );
  console.log(
    `  symbols=${index.symbols.length} scanErrors=${index.scanErrors.length} outOfContractImports=${index.outOfContractImports.length}`,
  );

  if (previousIndex) {
    const previousCommits = new Map(
      previousIndex.appStates.map((s) => [`${s.app}|${s.branch}`, s.commit]),
    );
    const staleKeys = new Set(
      index.scanErrors
        .filter((e) => e.staleSince && e.branch)
        .map((e) => `${e.app}|${e.branch}`),
    );
    const cacheHits = index.appStates.filter(
      (s) =>
        !staleKeys.has(`${s.app}|${s.branch}`) &&
        previousCommits.get(`${s.app}|${s.branch}`) === s.commit,
    ).length;
    const freshlyScanned = index.appStates.length - cacheHits - staleKeys.size;
    console.log(
      `  cache: ${cacheHits} hit, ${staleKeys.size} stale-fallback, ${freshlyScanned} freshly scanned`,
    );
  }

  for (const error of index.scanErrors) {
    const stale = error.staleSince ? ` [stale since ${error.staleSince}]` : '';
    console.warn(
      `  scanError: ${error.app} (${error.branch ?? 'unknown branch'}): ${error.error}${stale}`,
    );
  }
}
