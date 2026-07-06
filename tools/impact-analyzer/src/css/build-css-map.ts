import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join, relative } from 'node:path';
import type {
  CssComponentEntry,
  CssConsumerEntry,
  CssGlobalRisk,
  ScanError,
  SymbolEntry,
} from '../types/index-schema.js';
import { listAppSourceFiles } from '../app-usage/source-files.js';
import { classConfidence, findClassUsageInApp } from './class-usage-grep.js';
import { correlateComponent } from './component-correlation.js';
import { GLOBAL_SCOPE_DIRS } from './global-scope-detector.js';
import { extractClassNames } from './selector-extractor.js';
import { parseScssSelectors } from './scss-parser.js';

function listScssFilesRecursively(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const results: string[] = [];
  const walk = (current: string) => {
    for (const entry of readdirSync(current)) {
      const fullPath = join(current, entry);
      if (statSync(fullPath).isDirectory()) walk(fullPath);
      else if (entry.endsWith('.scss')) results.push(fullPath);
    }
  };
  walk(dir);
  return results;
}

export interface CssAppContext {
  appName: string;
  appBranch: string;
  pinsBootstrap: boolean;
  srcRoot: string;
}

export interface BuildCssMapResult {
  cssComponents: CssComponentEntry[];
  cssGlobalRisks: CssGlobalRisk[];
  cssScanErrors: ScanError[];
}

/**
 * Builds the CSS side of the index (plan §5.2): per-component class tables
 * correlated with React components and grepped against every app, plus a
 * flat list of "global impact" files (themes/tokens/abstracts/base) that
 * can't be localized to one component.
 */
export function buildCssMap(
  bootstrapSrcDir: string,
  ffSymbols: SymbolEntry[],
  apps: CssAppContext[],
): BuildCssMapResult {
  // Compound components built via `Object.assign(Root, { Trigger, ... })`
  // (e.g. Dropdown) aren't recognized as functions/JSX by the kind
  // heuristic and fall back to 'const' — treat both kinds as correlation
  // candidates rather than miss every component built that way.
  const componentNames = ffSymbols
    .filter(
      (s) => (s.kind === 'component' || s.kind === 'const') && !s.isAggregate,
    )
    .map((s) => s.name);

  const scssFiles = listScssFilesRecursively(
    join(bootstrapSrcDir, 'components'),
  );

  // Read every app's source files once, reused across every component's grep pass.
  const appFiles = apps.map((app) => ({
    app,
    files: listAppSourceFiles(app.srcRoot).map((path) => ({
      path,
      content: readFileSync(path, 'utf-8'),
    })),
  }));

  const cssComponents: CssComponentEntry[] = [];
  const cssScanErrors: ScanError[] = [];

  for (const scssFile of scssFiles) {
    // A single malformed .scss file must not take down the whole CSS index —
    // isolate the parse per file, matching the resilience already applied to
    // per-app scan failures (build-ci-index.ts).
    let selectors: string[];
    try {
      selectors = parseScssSelectors(readFileSync(scssFile, 'utf-8'));
    } catch (error) {
      cssScanErrors.push({
        app: relative(bootstrapSrcDir, scssFile),
        branch: null,
        error: error instanceof Error ? error.message : String(error),
      });
      continue;
    }

    const classes = extractClassNames(selectors);
    if (classes.length === 0) continue;

    const reactPeer = correlateComponent(basename(scssFile), componentNames);
    const hasGenericClass = classes.some((c) => classConfidence(c) === 'low');
    const confidence: CssComponentEntry['confidence'] = !reactPeer
      ? 'low'
      : hasGenericClass
        ? 'medium'
        : 'high';

    const consumers: CssConsumerEntry[] = [];
    for (const { app, files } of appFiles) {
      const usage = findClassUsageInApp(classes, files);
      if (usage) {
        consumers.push({
          app: app.appName,
          appBranch: app.appBranch,
          matchedSelectors: usage.matchedSelectors,
          files: usage.files,
          matchCount: usage.matchCount,
        });
      }
    }

    cssComponents.push({
      file: relative(bootstrapSrcDir, scssFile),
      reactPeer,
      selectors: classes,
      consumers,
      confidence,
    });
  }

  const bootstrapConsumingApps = apps
    .filter((a) => a.pinsBootstrap)
    .map((a) => a.appName);
  const cssGlobalRisks: CssGlobalRisk[] = [];
  for (const [dirName, scope] of Object.entries(GLOBAL_SCOPE_DIRS)) {
    for (const file of listScssFilesRecursively(
      join(bootstrapSrcDir, dirName),
    )) {
      cssGlobalRisks.push({
        file: relative(bootstrapSrcDir, file),
        scope,
        affectedApps: bootstrapConsumingApps,
      });
    }
  }

  return { cssComponents, cssGlobalRisks, cssScanErrors };
}
