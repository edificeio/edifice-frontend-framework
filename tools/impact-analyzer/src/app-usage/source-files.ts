import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const EXCLUDED_SUFFIXES = [
  '.test.ts',
  '.test.tsx',
  '.spec.ts',
  '.spec.tsx',
  '.stories.ts',
  '.stories.tsx',
  '.d.ts',
];

function isExcluded(fileName: string): boolean {
  return EXCLUDED_SUFFIXES.some((suffix) => fileName.endsWith(suffix));
}

/**
 * Lists an app's TS/TSX source files under its src root, excluding tests
 * and stories (the plan only cares about production usage sites).
 * Returns an empty array (not an error) when srcRoot doesn't exist —
 * callers surface that as a ScanError with more context.
 */
export function listAppSourceFiles(srcRoot: string): string[] {
  if (!existsSync(srcRoot)) return [];

  const results: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      if (entry === 'node_modules') continue;
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (/\.(ts|tsx)$/.test(entry) && !isExcluded(entry)) {
        results.push(fullPath);
      }
    }
  };
  walk(srcRoot);

  return results;
}
