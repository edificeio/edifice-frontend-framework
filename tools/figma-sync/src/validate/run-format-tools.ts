import { spawnSync } from 'node:child_process';
import { resolveBin } from './resolve-bin.js';

export interface FormatToolResult {
  tool: string;
  ok: boolean;
  stderr: string;
}

/**
 * Applies the project's real formatters/linters to the modified files --
 * prettier (repo root) then stylelint --fix (scoped to packages/bootstrap),
 * exactly the tools that `pnpm format:write` / `pnpm --filter bootstrap fix`
 * would run. Never a home-made reimplementation of the style rules: the goal
 * of this step is precisely that the generated SCSS follows the same rules as
 * the rest of the repo.
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
