import { spawnSync } from 'node:child_process';
import { resolveBin } from './resolve-bin.js';

export interface SassCheckResult {
  ok: boolean;
  stderr: string;
}

/**
 * Runs the real `sass` binary installed in the node_modules of the
 * bootstrap package (never a global binary nor a home-made reimplementation), with
 * the arguments produced by `buildSassArgs`. It is the only check that
 * confirms the patched SCSS actually compiles -- the parenthesis check
 * (`checkBalancedParens`) is a quick upstream aid, not a substitute.
 */
export function runSassCheck(
  bootstrapNodeModules: string,
  args: string[],
): SassCheckResult {
  const sassBin = resolveBin(bootstrapNodeModules, 'sass');
  const result = spawnSync(sassBin, args, { encoding: 'utf8' });
  if (result.error) {
    return {
      ok: false,
      stderr: `Impossible de lancer sass ("${sassBin}") : ${result.error.message}`,
    };
  }
  return { ok: result.status === 0, stderr: result.stderr ?? '' };
}
