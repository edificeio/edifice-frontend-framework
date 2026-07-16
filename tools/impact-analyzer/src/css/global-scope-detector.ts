import { relative } from 'node:path';
import type { CssGlobalScope } from '../types/index-schema.js';

/**
 * Directories under packages/bootstrap/src whose changes can't be
 * localized to one component (plan §5.2 regime 2) — mapped to the schema's
 * CssGlobalScope values (note: "base" has no plural form).
 */
export const GLOBAL_SCOPE_DIRS: Record<string, CssGlobalScope> = {
  themes: 'theme',
  tokens: 'token',
  abstracts: 'abstract',
  base: 'base',
};

export function detectGlobalScope(
  bootstrapSrcDir: string,
  scssFilePath: string,
): CssGlobalScope | null {
  const rel = relative(bootstrapSrcDir, scssFilePath);
  const topDir = rel.split('/')[0];
  return GLOBAL_SCOPE_DIRS[topDir] ?? null;
}
