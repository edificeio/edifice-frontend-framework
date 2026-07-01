import { readFileSync } from 'node:fs';
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
): void {
  const baseText = readSourceFilesText(base.sourceFiles);
  const headText = readSourceFilesText(head.sourceFiles);
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
  const { baseSymbols, headSymbols, headIndex } = input;
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
        pushIfRealChange(base, head, headIndex, entries);
      }
      continue;
    }

    // At least one side isn't comparable (e.g. a compound component) — never
    // report signature-changed, since we can't tell whether the shape moved.
    pushIfRealChange(base, head, headIndex, entries);
  }

  return entries.sort((a, b) => b.riskScore - a.riskScore);
}
