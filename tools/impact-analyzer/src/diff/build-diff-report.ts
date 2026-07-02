import { join } from 'node:path';
import type { GithubClientOptions } from '../discovery/github-client.js';
import { buildFfDeclarationsMap } from '../ff-map/build-ff-declarations-map.js';
import { currentFfRepoRoot } from '../ff-map/entry-points.js';
import { buildCiIndex } from '../index-builder/build-ci-index.js';
import {
  type BuildIndexOptions,
  buildLocalIndex,
} from '../index-builder/build-index.js';
import {
  loadAppsRegistry,
  type RegisteredApp,
} from '../registry/apps-registry.js';
import type { DiffReport } from '../types/diff-schema.js';
import type { ImpactIndex } from '../types/index-schema.js';
import { diffCss } from './css-diff.js';
import { cleanupSnapshot, createSnapshot } from './snapshot.js';
import { diffSymbols } from './symbol-diff.js';

export interface BuildDiffReportOptions extends BuildIndexOptions {
  /** Overridable for tests — otherwise buildLocalIndex()/buildCiIndex() is run for head, per `mode`. */
  headIndex?: ImpactIndex;
  /** How to discover head's consumer apps — local sibling repos (default) or the remote GitHub API, same distinction as `generate`. */
  mode?: 'local' | 'ci';
  githubClientOptions?: GithubClientOptions;
}

/**
 * Builds a base-vs-head diff report: snapshots `baseRef` into a disposable
 * worktree, re-extracts the FF symbol declarations there, compares against
 * head (buildLocalIndex/buildCiIndex, run once and reused for both the
 * JS/TS and CSS comparisons), and always cleans up the snapshot — even on
 * failure.
 */
export async function buildDiffReport(
  baseRef: string,
  apps: RegisteredApp[] = loadAppsRegistry(),
  options: BuildDiffReportOptions = {},
): Promise<DiffReport> {
  const repoRoot = options.repoRoot ?? currentFfRepoRoot();
  const headIndex =
    options.headIndex ??
    (options.mode === 'ci'
      ? await buildCiIndex(apps, options)
      : buildLocalIndex(apps, options));

  const snapshot = createSnapshot(repoRoot, baseRef);
  try {
    const baseSymbols = buildFfDeclarationsMap(
      snapshot.worktreePath,
      options.ffPackages,
      options.ffEntryMap,
    );
    // A second declarations-carrying pass for head — buildLocalIndex()
    // above already ran buildFfMap() internally, but that variant discards
    // declarations (they aren't part of the serialized ImpactIndex schema).
    // Accepted as part of the "two full ts-morph passes" cost already
    // called out for this command.
    const headSymbols = buildFfDeclarationsMap(
      repoRoot,
      options.ffPackages,
      options.ffEntryMap,
    );

    const symbolDiffs = diffSymbols({ baseSymbols, headSymbols, headIndex });

    const bootstrapSrcDir =
      options.bootstrapSrcDir ?? join(repoRoot, 'packages', 'bootstrap', 'src');
    const cssDiffs = diffCss({
      baseRef,
      headRepoRoot: repoRoot,
      bootstrapSrcDir,
      headCssComponents: headIndex.cssComponents,
      headCssGlobalRisks: headIndex.cssGlobalRisks,
    });

    return {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      base: { ref: baseRef, commit: snapshot.commit },
      head: { ref: headIndex.ffBranch, commit: headIndex.ffCommit },
      symbolDiffs,
      cssDiffs,
      scanErrors: headIndex.scanErrors.map((e) => ({
        app: e.app,
        branch: e.branch,
        error: e.error,
      })),
    };
  } finally {
    cleanupSnapshot(repoRoot, snapshot);
  }
}
