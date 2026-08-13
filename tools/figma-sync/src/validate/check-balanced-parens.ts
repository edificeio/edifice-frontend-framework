export interface BalanceResult {
  balanced: boolean;
  openCount: number;
  closeCount: number;
}

/**
 * Verification rapide, en memoire, avant meme d'ecrire un fichier sur disque :
 * un patch qui desequilibre les parentheses d'une map SCSS est forcement un bug
 * du script, jamais une intention. Ne remplace pas une vraie compilation Sass
 * (voir cli.ts, qui compile via `sass` dans une copie temporaire avant d'ecrire
 * les vrais fichiers), mais coute quasiment rien et attrape l'erreur au plus tot.
 */
export function checkBalancedParens(text: string): BalanceResult {
  const openCount = (text.match(/\(/g) ?? []).length;
  const closeCount = (text.match(/\)/g) ?? []).length;
  return { balanced: openCount === closeCount, openCount, closeCount };
}
