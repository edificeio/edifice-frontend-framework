/**
 * Builds the Sass compilation arguments identically to the `compile` script
 * of packages/bootstrap/package.json (`sass --load-path=node_modules/ --style=compressed
 * --quiet-deps --silence-deprecation=import src/index.scss dist/index.css`), so that
 * the check uses exactly the same command as the real build, never
 * an invented variant.
 */
export function buildSassArgs(
  bootstrapNodeModules: string,
  entryScssFile: string,
  outFile: string,
): string[] {
  return [
    `--load-path=${bootstrapNodeModules}`,
    '--style=compressed',
    '--quiet-deps',
    '--silence-deprecation=import',
    entryScssFile,
    outFile,
  ];
}
