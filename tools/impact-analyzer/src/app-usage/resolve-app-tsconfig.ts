import { existsSync } from 'node:fs';
import { join } from 'node:path';

const CANDIDATE_TSCONFIG_NAMES = [
  'tsconfig.app.json',
  'tsconfig.lib.json',
  'tsconfig.json',
];

/**
 * Consuming apps commonly scaffold a "solution style" tsconfig.json
 * (`files: []` + `references` only, Vite's default React+TS template) with
 * the real compilerOptions living in tsconfig.app.json — the same pattern
 * observed in packages/react (tsconfig.json -> tsconfig.lib.json). Try the
 * more specific file names first rather than the generic one.
 */
export function resolveAppTsconfigPath(appDir: string): string | null {
  for (const name of CANDIDATE_TSCONFIG_NAMES) {
    const candidate = join(appDir, name);
    if (existsSync(candidate)) return candidate;
  }
  return null;
}
