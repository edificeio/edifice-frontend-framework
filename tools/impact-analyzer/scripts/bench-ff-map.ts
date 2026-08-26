/**
 * Baseline/regression benchmark for REVIEW-impact-analyzer.md P4.4:
 * `buildFfMap` and `buildFfDeclarationsMap` independently re-run the exact
 * same ts-morph traversal (project creation, entry resolution, symbol
 * extraction) over the FF packages — the only difference is whether
 * declarations are kept and whether icons get aggregated. A single `impact
 * diff` run calls both once for head (via buildLocalIndex/buildCiIndex +
 * buildDiffReport) and once more for base, i.e. this traversal runs 3
 * times per diff. This script measures each function's standalone cost so
 * merging them into one shared traversal has a concrete before/after.
 *
 * Usage: tsx scripts/bench-ff-map.ts
 */
import { buildFfDeclarationsMap } from '../src/ff-map/build-ff-declarations-map.js';
import { buildFfMap, FF_PACKAGES } from '../src/ff-map/build-ff-map.js';
import { currentFfRepoRoot } from '../src/ff-map/entry-points.js';

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function bench(label: string, fn: () => unknown, runs = 5): number[] {
  const ms: number[] = [];
  let lastCount = 0;
  for (let i = 0; i < runs; i++) {
    const start = performance.now();
    const result = fn();
    ms.push(performance.now() - start);
    lastCount = Array.isArray(result) ? result.length : 0;
  }
  console.log(
    `${label.padEnd(24)} runs: ${ms
      .map((m) => m.toFixed(0))
      .join(', ')
      .padEnd(45)} median: ${median(ms).toFixed(0)}ms  (${lastCount} entries)`,
  );
  return ms;
}

function main() {
  const repoRoot = currentFfRepoRoot();

  const ffMapMs = bench('buildFfMap', () => buildFfMap(repoRoot, FF_PACKAGES));
  const declMapMs = bench('buildFfDeclarationsMap', () =>
    buildFfDeclarationsMap(repoRoot, FF_PACKAGES),
  );

  // What a single `impact diff` run pays today: one buildFfMap (head, via
  // buildLocalIndex/buildCiIndex) + two buildFfDeclarationsMap (base + head,
  // in build-diff-report.ts) — three full traversals.
  const perDiffToday = median(ffMapMs) + 2 * median(declMapMs);
  console.log(
    `\nPer "impact diff" run today (1x buildFfMap + 2x buildFfDeclarationsMap): ${perDiffToday.toFixed(0)}ms`,
  );
}

main();
