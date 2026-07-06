import { existsSync, readFileSync } from 'node:fs';
import { basename } from 'node:path';
import { readRepoState } from '../discovery/local-repo-resolver.js';
import { currentFfRepoRoot } from '../ff-map/entry-points.js';
import { buildLocalIndex } from '../index-builder/build-index.js';
import { indexFilePath } from '../index-builder/write-index.js';
import {
  IMPACT_INDEX_SCHEMA_VERSION,
  isCompatibleImpactIndex,
  type ImpactIndex,
} from '../types/index-schema.js';
import { renderTable } from './format-table.js';

export interface SymbolCommandOptions {
  cached: boolean;
}

const MAX_INLINE_FILES = 3;

function formatFiles(files: string[]): string {
  if (files.length === 0) return '';
  if (files.length <= MAX_INLINE_FILES)
    return files.map((f) => basename(f)).join(', ');
  return `${files.length} files (see index for detail)`;
}

function resolveIndex(options: SymbolCommandOptions): ImpactIndex | null {
  if (!options.cached) return buildLocalIndex();

  // Even in --cached mode, we still need to know which branch's index to
  // read — a quick `git rev-parse`, not a full re-scan.
  const { branch } = readRepoState(currentFfRepoRoot());
  const filePath = indexFilePath(branch);
  if (!existsSync(filePath)) {
    console.error(
      `Cached index not found at ${filePath} — run 'generate' first, or drop --cached.`,
    );
    return null;
  }
  const parsed: unknown = JSON.parse(readFileSync(filePath, 'utf-8'));
  if (!isCompatibleImpactIndex(parsed)) {
    console.error(
      `Cached index at ${filePath} has an incompatible or missing schemaVersion ` +
        `(expected ${IMPACT_INDEX_SCHEMA_VERSION}) — run 'generate' again.`,
    );
    return null;
  }
  return parsed;
}

/**
 * `impact symbol <name>`: case-insensitive substring lookup across the
 * index. `indexOverride` exists purely for tests, mirroring
 * BuildIndexOptions.repoRoot's injectability pattern elsewhere in this repo.
 */
export function runSymbol(
  query: string,
  options: SymbolCommandOptions,
  indexOverride?: ImpactIndex,
): void {
  if (!query.trim()) {
    console.error('Usage: cli.ts symbol <name> [--cached]');
    process.exitCode = 1;
    return;
  }

  const index = indexOverride ?? resolveIndex(options);
  if (!index) {
    process.exitCode = 1;
    return;
  }

  const needle = query.toLowerCase();
  const matches = index.symbols.filter((s) =>
    s.name.toLowerCase().includes(needle),
  );

  if (matches.length === 0) {
    console.log(`No symbol matching "${query}".`);
    process.exitCode = 1;
    return;
  }

  for (const symbol of matches) {
    const entryLabel = symbol.entry === '.' ? '' : symbol.entry.slice(1);
    console.log(
      `\n${symbol.package}${entryLabel} :: ${symbol.name} (${symbol.kind})`,
    );

    if (symbol.consumers.length === 0) {
      console.log('  (no known consumer in the registry)');
      continue;
    }

    const rows = symbol.consumers
      .slice()
      .sort((a, b) => b.usageSites - a.usageSites)
      .map((c) => [
        c.app,
        c.appBranch,
        String(c.usageSites),
        formatFiles(c.files),
      ]);
    console.log(renderTable(['App', 'Branch', 'Usage sites', 'Files'], rows));
  }
}
