import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { relative } from 'node:path';
import type { DeclaredSymbol } from '../ff-map/build-ff-declarations-map.js';
import type {
  ConsumerImpactSummary,
  SymbolChangeKind,
  SymbolDiffEntry,
} from '../types/diff-schema.js';
import type { ImpactIndex } from '../types/index-schema.js';
import { isCosmeticOnlyChange } from './cosmetic-normalize.js';
import { computeRiskScore, severityForChangeKind } from './risk-score.js';
import { computeSignatureShape } from './signature-shape.js';

export interface DiffSymbolsInput {
  baseSymbols: DeclaredSymbol[];
  headSymbols: DeclaredSymbol[];
  /** Already-built head index — consumers/riskScore are derived from it, never recomputed. */
  headIndex: ImpactIndex;
  /**
   * Repo-root-relative paths of files that actually differ between base and
   * head (see `listChangedFiles`) — lets `pushIfRealChange` skip the
   * read+compare entirely when none of a symbol's files changed at all
   * (css-diff.ts already does the equivalent pre-filter). Optional and
   * unfiltered when omitted, so unit tests that build synthetic
   * base/headSymbols with no real git history behind them are unaffected.
   */
  changedFiles?: Set<string>;
  /** Required alongside `changedFiles` — used to turn `sourceFiles`'s absolute paths into the same repo-relative form. */
  repoRoot?: string;
}

/**
 * Repo-root-relative paths of every file that differs between `baseRef` and
 * the current working tree. No worktree needed (unlike snapshot.ts's use for
 * base symbol extraction): `git diff` can compare a ref directly against the
 * working tree, which already matches "head = whatever's on disk"
 * (local-repo-resolver.ts's convention) — same approach as css-diff.ts's own
 * pre-filter.
 */
export function listChangedFiles(
  repoRoot: string,
  baseRef: string,
): Set<string> {
  const output = execFileSync(
    'git',
    ['-C', repoRoot, 'diff', '--name-only', baseRef],
    {
      encoding: 'utf-8',
    },
  );
  return new Set(
    output
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean),
  );
}

function keyOf(s: { package: string; entry: string; name: string }): string {
  return `${s.package}|${s.entry}|${s.name}`;
}

function readSourceFilesText(paths: string[]): string {
  return [...paths]
    .sort()
    .map((p) => readFileSync(p, 'utf-8'))
    .join('\n');
}

function consumersFor(
  headIndex: ImpactIndex,
  key: string,
): ConsumerImpactSummary[] {
  const symbolEntry = headIndex.symbols.find((s) => keyOf(s) === key);
  if (!symbolEntry) return [];
  return symbolEntry.consumers.map((c) => ({
    app: c.app,
    appBranch: c.appBranch,
    usageSites: c.usageSites,
    // Denormalized so the viewer can link each impacted file to its
    // SHA-pinned GitHub blob without needing the (unpublished) head index.
    org: c.org,
    repo: c.repo,
    appCommit: c.appCommit,
    files: c.files,
  }));
}

function buildEntry(
  base: DeclaredSymbol,
  head: DeclaredSymbol | undefined,
  changeKind: SymbolChangeKind,
  headIndex: ImpactIndex,
): SymbolDiffEntry {
  const key = keyOf(base);
  const consumers = consumersFor(headIndex, key);
  const totalUsageSites = consumers.reduce((sum, c) => sum + c.usageSites, 0);
  const appCount = new Set(consumers.map((c) => c.app)).size;
  const severity = severityForChangeKind(changeKind);

  return {
    package: base.package,
    entry: base.entry,
    name: base.name,
    kind: head?.kind ?? base.kind,
    changeKind,
    severity,
    sourceFilesBase: base.sourceFiles,
    sourceFilesHead: head?.sourceFiles ?? [],
    consumers,
    riskScore: computeRiskScore(severity, totalUsageSites, appCount),
  };
}

function pushIfRealChange(
  base: DeclaredSymbol,
  head: DeclaredSymbol,
  headIndex: ImpactIndex,
  entries: SymbolDiffEntry[],
  changedFiles: Set<string> | undefined,
  repoRoot: string | undefined,
): void {
  if (changedFiles && repoRoot) {
    const touched = head.sourceFiles.some((f) =>
      changedFiles.has(relative(repoRoot, f)),
    );
    // git already told us none of this symbol's files changed at all —
    // isCosmeticOnlyChange would necessarily find identical text anyway.
    if (!touched) return;
  }

  let baseText: string;
  let headText: string;
  try {
    baseText = readSourceFilesText(base.sourceFiles);
    headText = readSourceFilesText(head.sourceFiles);
  } catch {
    // A declared source file is missing on disk (e.g. the base worktree
    // snapshot was cleaned up mid-read) — we can't tell whether the change
    // is cosmetic, so report it (needs-review) rather than crash the diff.
    entries.push(buildEntry(base, head, 'body-changed', headIndex));
    return;
  }
  if (isCosmeticOnlyChange(baseText, headText)) return; // no observable change at all
  entries.push(buildEntry(base, head, 'body-changed', headIndex));
}

/**
 * Classifies every FF symbol touched between base and head into the plan's
 * 3 honest levels (§6). Per-symbol only — no transitive propagation: if
 * `interface Props` changes shape but `function Button(props: Props)`
 * doesn't change syntactically in its own declaration, `Props` is flagged
 * but `Button` is not automatically flagged too.
 *
 * A symbol present only at head (new export) is never a risk to existing
 * consumers and is intentionally absent from the result.
 */
export function diffSymbols(input: DiffSymbolsInput): SymbolDiffEntry[] {
  const { baseSymbols, headSymbols, headIndex, changedFiles, repoRoot } = input;
  const baseByKey = new Map(baseSymbols.map((s) => [keyOf(s), s]));
  const headByKey = new Map(headSymbols.map((s) => [keyOf(s), s]));

  const entries: SymbolDiffEntry[] = [];

  for (const [, base] of baseByKey) {
    const head = headByKey.get(keyOf(base));

    if (!head) {
      entries.push(buildEntry(base, undefined, 'removed', headIndex));
      continue;
    }

    const baseShape = computeSignatureShape(base.declarations);
    const headShape = computeSignatureShape(head.declarations);

    if (baseShape.comparable && headShape.comparable) {
      if (baseShape.shape !== headShape.shape) {
        entries.push(buildEntry(base, head, 'signature-changed', headIndex));
      } else {
        pushIfRealChange(
          base,
          head,
          headIndex,
          entries,
          changedFiles,
          repoRoot,
        );
      }
      continue;
    }

    // At least one side isn't comparable (e.g. a compound component) — never
    // report signature-changed, since we can't tell whether the shape moved.
    pushIfRealChange(base, head, headIndex, entries, changedFiles, repoRoot);
  }

  return entries.sort((a, b) => b.riskScore - a.riskScore);
}
