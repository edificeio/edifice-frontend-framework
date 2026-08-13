import { spawnSync } from 'node:child_process';
import { resolveBin } from './resolve-bin.js';

export interface FormatToolResult {
  tool: string;
  ok: boolean;
  stderr: string;
}

/**
 * Applique les vrais formatters/linters du projet sur les fichiers modifies --
 * prettier (racine du repo) puis stylelint --fix (scope a packages/bootstrap),
 * exactement les outils que `pnpm format:write` / `pnpm --filter bootstrap fix`
 * lanceraient. Jamais une reimplementation maison des regles de style : le but
 * de ce point est justement que le SCSS genere respecte les memes regles que
 * le reste du repo.
 */
export function runFormatTools(
  repoRootNodeModules: string,
  bootstrapNodeModules: string,
  filePaths: string[],
): FormatToolResult[] {
  if (filePaths.length === 0) return [];

  const results: FormatToolResult[] = [];

  const prettierBin = resolveBin(repoRootNodeModules, 'prettier');
  const prettier = spawnSync(prettierBin, ['--write', ...filePaths], {
    encoding: 'utf8',
  });
  results.push({
    tool: 'prettier --write',
    ok: !prettier.error && prettier.status === 0,
    stderr: prettier.error ? prettier.error.message : (prettier.stderr ?? ''),
  });

  const stylelintBin = resolveBin(bootstrapNodeModules, 'stylelint');
  const stylelint = spawnSync(stylelintBin, ['--fix', ...filePaths], {
    encoding: 'utf8',
  });
  results.push({
    tool: 'stylelint --fix',
    ok: !stylelint.error && stylelint.status === 0,
    stderr: stylelint.error
      ? stylelint.error.message
      : (stylelint.stderr ?? ''),
  });

  return results;
}
