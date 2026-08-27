/**
 * Construit les arguments de compilation Sass a l'identique du script `compile`
 * de packages/bootstrap/package.json (`sass --load-path=node_modules/ --style=compressed
 * --quiet-deps --silence-deprecation=import src/index.scss dist/index.css`), pour que
 * la verification utilise exactement la meme commande que le vrai build, jamais
 * une variante inventee.
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
