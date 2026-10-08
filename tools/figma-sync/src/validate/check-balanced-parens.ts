export interface BalanceResult {
  balanced: boolean;
  openCount: number;
  closeCount: number;
}

/**
 * Quick in-memory check, before even writing a file to disk:
 * a patch that unbalances the parentheses of an SCSS map is necessarily a bug
 * in the script, never an intention. Does not replace a real Sass compilation
 * (see cli.ts, which compiles via `sass` in a temporary copy before writing
 * the real files), but costs almost nothing and catches the error as early as possible.
 */
export function checkBalancedParens(text: string): BalanceResult {
  const openCount = (text.match(/\(/g) ?? []).length;
  const closeCount = (text.match(/\)/g) ?? []).length;
  return { balanced: openCount === closeCount, openCount, closeCount };
}
