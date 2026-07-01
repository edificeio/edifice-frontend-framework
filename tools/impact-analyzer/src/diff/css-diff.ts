import { execFileSync } from 'node:child_process';
import { join, relative } from 'node:path';
import { detectGlobalScope } from '../css/global-scope-detector.js';
import type { CssDiffEntry } from '../types/diff-schema.js';
import type {
  CssComponentEntry,
  CssGlobalRisk,
} from '../types/index-schema.js';
import { computeRiskScore, severityForCssChange } from './risk-score.js';

export interface DiffCssInput {
  baseRef: string;
  headRepoRoot: string;
  bootstrapSrcDir: string;
  /** Already computed for the head index — reused, never recalculated. */
  headCssComponents: CssComponentEntry[];
  headCssGlobalRisks: CssGlobalRisk[];
}

function listChangedScssFiles(
  headRepoRoot: string,
  baseRef: string,
  bootstrapSrcDir: string,
): string[] {
  const output = execFileSync(
    'git',
    ['-C', headRepoRoot, 'diff', '--name-only', baseRef, '--', bootstrapSrcDir],
    { encoding: 'utf-8' },
  );
  // git diff --name-only always reports paths relative to the repo root,
  // regardless of whether the pathspec itself was absolute.
  return output
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.endsWith('.scss'));
}

/**
 * No worktree needed here (unlike the JS/TS symbol diff): `git diff` can
 * compare a ref directly against the working tree, which already matches
 * "head = whatever's on disk" (local-repo-resolver.ts's convention). A
 * changed file no longer present at head (deleted between base and head)
 * has no entry in headCssComponents — it still gets a CssDiffEntry, with
 * `confidence` left undefined (repli `needs-review`), rather than being
 * silently dropped.
 */
export function diffCss(input: DiffCssInput): CssDiffEntry[] {
  const {
    baseRef,
    headRepoRoot,
    bootstrapSrcDir,
    headCssComponents,
    headCssGlobalRisks,
  } = input;

  const changedFiles = listChangedScssFiles(
    headRepoRoot,
    baseRef,
    bootstrapSrcDir,
  ).map((relToRepoRoot) => join(headRepoRoot, relToRepoRoot));

  const bootstrapConsumingApps = [
    ...new Set(headCssGlobalRisks.flatMap((risk) => risk.affectedApps)),
  ];

  const entries: CssDiffEntry[] = changedFiles.map((absolutePath) => {
    const file = relative(bootstrapSrcDir, absolutePath);
    const globalScope = detectGlobalScope(bootstrapSrcDir, absolutePath);

    if (globalScope) {
      const severity = severityForCssChange('global', globalScope, undefined);
      return {
        file,
        scope: 'global',
        globalScope,
        severity,
        affectedApps: bootstrapConsumingApps,
        riskScore: computeRiskScore(severity, 0, bootstrapConsumingApps.length),
      };
    }

    const componentEntry = headCssComponents.find((c) => c.file === file);
    const confidence = componentEntry?.confidence;
    const severity = severityForCssChange('component', undefined, confidence);
    const affectedApps = componentEntry?.consumers.map((c) => c.app) ?? [];
    const totalMatchCount =
      componentEntry?.consumers.reduce((sum, c) => sum + c.matchCount, 0) ?? 0;

    return {
      file,
      scope: 'component',
      reactPeer: componentEntry?.reactPeer,
      confidence,
      severity,
      affectedApps,
      riskScore: computeRiskScore(
        severity,
        totalMatchCount,
        affectedApps.length,
      ),
    };
  });

  return entries.sort((a, b) => b.riskScore - a.riskScore);
}
