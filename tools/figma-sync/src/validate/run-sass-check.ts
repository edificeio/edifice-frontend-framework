import { spawnSync } from 'node:child_process';
import { resolveBin } from './resolve-bin.js';

export interface SassCheckResult {
  ok: boolean;
  stderr: string;
}

/**
 * Lance le vrai binaire `sass` installe dans le node_modules du package
 * bootstrap (jamais un binaire global ni une reimplementation maison), avec
 * les arguments produits par `buildSassArgs`. C'est la seule verification qui
 * confirme que le SCSS patche compile reellement -- le controle de parentheses
 * (`checkBalancedParens`) est une aide rapide en amont, pas un substitut.
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
