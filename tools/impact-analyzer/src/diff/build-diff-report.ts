import { join } from 'node:path';
import type { GithubClientOptions } from '../discovery/github-client.js';
import {
  buildFfDeclarationsMap,
  type DeclaredSymbol,
} from '../ff-map/build-ff-declarations-map.js';
import { projectDeclaredSymbols } from '../ff-map/build-ff-map.js';
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
import { toRepoRelativeFiles } from '../index-builder/repo-relative.js';
import type { DiffReport, DiffSource } from '../types/diff-schema.js';
import type { ImpactIndex } from '../types/index-schema.js';
import { diffCss } from './css-diff.js';
import { cleanupSnapshot, createSnapshot } from './snapshot.js';
import { diffSymbols, listChangedFiles } from './symbol-diff.js';

export interface BuildDiffReportOptions extends BuildIndexOptions {
  /** Overridable for tests — otherwise buildLocalIndex()/buildCiIndex() is run for head, per `mode`. */
  headIndex?: ImpactIndex;
  /** Provenance recorded in the report (e.g. the PR that triggered a CI diff). */
  source?: DiffSource;
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
 *
 * Head's declarations are read from the real repoRoot exactly once: when
 * `options.headIndex` isn't overridden, buildLocalIndex/buildCiIndex would
 * otherwise re-traverse the same FF packages at the same commit internally
 * (via buildFfMap) to build their own symbol table — `ffSymbols` short-
 * circuits that with a projection of the declarations already computed
 * here (P4.4 follow-up, REVIEW-impact-analyzer.md §2.4 "trois passes
 * ts-morph FF complètes par diff", now two: head once, base once).
 */
export async function buildDiffReport(
  baseRef: string,
  apps: RegisteredApp[] = loadAppsRegistry(),
  options: BuildDiffReportOptions = {},
): Promise<DiffReport> {
  const repoRoot = options.repoRoot ?? currentFfRepoRoot();

  let headSymbols: DeclaredSymbol[];
  let headIndex: ImpactIndex;
  if (options.headIndex) {
    headIndex = options.headIndex;
    headSymbols = buildFfDeclarationsMap(
      repoRoot,
      options.ffPackages,
      options.ffEntryMap,
    );
  } else {
    headSymbols = buildFfDeclarationsMap(
      repoRoot,
      options.ffPackages,
      options.ffEntryMap,
    );
    const ffSymbols = projectDeclaredSymbols(repoRoot, headSymbols);
    headIndex =
      options.mode === 'ci'
        ? await buildCiIndex(apps, { ...options, ffSymbols })
        : buildLocalIndex(apps, { ...options, ffSymbols });
  }

  const snapshot = createSnapshot(repoRoot, baseRef);
  try {
    const baseSymbols = buildFfDeclarationsMap(
      snapshot.worktreePath,
      options.ffPackages,
      options.ffEntryMap,
    );

    const changedFiles = listChangedFiles(repoRoot, baseRef);
    const symbolDiffs = diffSymbols({
      baseSymbols,
      headSymbols,
      headIndex,
      changedFiles,
      repoRoot,
    }).map((d) => ({
      ...d,
      // Internal diffing needs absolute paths (files are read from disk);
      // the persisted report must not: base paths would leak the disposable
      // snapshot worktree, head paths the runner's checkout dir.
      sourceFilesBase: toRepoRelativeFiles(
        snapshot.worktreePath,
        d.sourceFilesBase,
      ),
      sourceFilesHead: toRepoRelativeFiles(repoRoot, d.sourceFilesHead),
    }));

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
      ...(options.source ? { source: options.source } : {}),
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
