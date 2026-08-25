/**
 * Baseline/regression benchmark for REVIEW-impact-analyzer.md P4.3:
 * before this change, an app's source files were read twice — once by
 * ts-morph for JS usage analysis (analyze-app.ts), once by a separate
 * `readFileSync` pass for the CSS grep (build-css-map.ts). This script
 * measures the standalone cost of that second, now-unnecessary read.
 *
 * Usage: tsx scripts/bench-css-file-reuse.ts
 */
import { readFileSync } from 'node:fs';
import { analyzeAppUsage } from '../src/app-usage/analyze-app.js';
import { resolveAppTsconfigPath } from '../src/app-usage/resolve-app-tsconfig.js';
import { listAppSourceFiles } from '../src/app-usage/source-files.js';
import { buildFfMap, FF_PACKAGES } from '../src/ff-map/build-ff-map.js';
import { currentFfRepoRoot } from '../src/ff-map/entry-points.js';
import { reposRoot } from '../src/discovery/local-repo-resolver.js';
import { join } from 'node:path';

const APPS_TO_BENCH = ['communities', 'wiki', 'collect', 'blog'];

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
    'App'.padEnd(14),
    'analyzeAppUsage'.padEnd(18),
    'redundant readFileSync (avoided)'.padEnd(35),
  );
  for (const app of APPS_TO_BENCH) {
    const appDir = join(reposRoot(), app, 'frontend');
    const tsconfigPath = resolveAppTsconfigPath(appDir);
    const srcRoot = join(appDir, 'src');
    if (!tsconfigPath) continue;

    const analyzeMs: number[] = [];
    const readMs: number[] = [];
    for (let i = 0; i < 3; i++) {
      const start1 = performance.now();
      analyzeAppUsage(srcRoot, tsconfigPath, knownEntries);
      analyzeMs.push(performance.now() - start1);

      const start2 = performance.now();
      for (const file of listAppSourceFiles(srcRoot))
        readFileSync(file, 'utf-8');
      readMs.push(performance.now() - start2);
    }

    console.log(
      app.padEnd(14),
      `${median(analyzeMs).toFixed(0)}ms`.padEnd(18),
      `${median(readMs).toFixed(0)}ms`.padEnd(35),
    );
  }
}

main();
