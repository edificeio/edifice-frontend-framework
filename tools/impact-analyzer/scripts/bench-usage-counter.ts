/**
 * Baseline/regression benchmark for REVIEW-impact-analyzer.md P4.2:
 * `usage-counter.ts` runs a full-project `findReferencesAsNodes()` per
 * binding, then filters down to references in the same file — the language
 * service is surdimensionné for what's ultimately an intra-file count. This
 * script measures `analyzeAppUsage` wall-clock time against real sibling
 * app repos (not fixtures) so a change to the counting strategy has a
 * concrete before/after to compare against, not just a theoretical
 * complexity argument.
 *
 * Usage: tsx scripts/bench-usage-counter.ts
 */
import { analyzeAppUsage } from '../src/app-usage/analyze-app.js';
import { resolveAppTsconfigPath } from '../src/app-usage/resolve-app-tsconfig.js';
import { buildFfMap, FF_PACKAGES } from '../src/ff-map/build-ff-map.js';
import { currentFfRepoRoot } from '../src/ff-map/entry-points.js';
import { reposRoot } from '../src/discovery/local-repo-resolver.js';
import { join } from 'node:path';

// A spread of real app sizes (see file counts checked manually), not just
// the biggest one — a change that helps a 230-file app but regresses a
// 30-file one is still worth knowing about.
const APPS_TO_BENCH = [
  'communities',
  'wiki',
  'collect',
  'blog',
  'explorer',
  'mindmap',
];

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

async function main() {
  const repoRoot = currentFfRepoRoot();
  const symbols = buildFfMap(repoRoot, FF_PACKAGES);
  const knownEntries = [
    ...new Set(symbols.map((s) => `${s.package}|${s.entry}`)),
  ].map((key) => {
    const i = key.indexOf('|');
    return { package: key.slice(0, i), entry: key.slice(i + 1) };
  });
  console.log(
    `FF known entries: ${knownEntries.length} (from ${symbols.length} symbols)\n`,
  );

  const RUNS = 3;
  const rows: {
    app: string;
    usageSites: number;
    msRuns: number[];
  }[] = [];

  for (const app of APPS_TO_BENCH) {
    const appDir = join(reposRoot(), app, 'frontend');
    const tsconfigPath = resolveAppTsconfigPath(appDir);
    const srcRoot = join(appDir, 'src');
    if (!tsconfigPath) {
      console.warn(`skip ${app}: no tsconfig found under ${appDir}`);
      continue;
    }

    const msRuns: number[] = [];
    let usageSites = 0;
    for (let i = 0; i < RUNS; i++) {
      const start = performance.now();
      const result = analyzeAppUsage(srcRoot, tsconfigPath, knownEntries);
      msRuns.push(performance.now() - start);
      usageSites = result.usages.reduce((sum, u) => sum + u.usageSites, 0);
    }

    rows.push({ app, usageSites, msRuns });
  }

  console.log(
    'App'.padEnd(16),
    'usageSites'.padEnd(12),
    'runs (ms)'.padEnd(30),
    'median (ms)',
  );
  for (const row of rows) {
    console.log(
      row.app.padEnd(16),
      String(row.usageSites).padEnd(12),
      row.msRuns
        .map((m) => m.toFixed(0))
        .join(', ')
        .padEnd(30),
      median(row.msRuns).toFixed(0),
    );
  }

  const total = rows.reduce((sum, r) => sum + median(r.msRuns), 0);
  console.log(`\nTotal (median per app, summed): ${total.toFixed(0)}ms`);
}

main();
