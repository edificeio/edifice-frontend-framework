/**
 * Normalise une couleur hex pour comparaison uniquement (#fff == #ffffff) : le
 * repo utilise parfois la forme courte (#000, #fff), Figma exporte toujours en
 * 6 chiffres. Sans ca, ces deux lignes seraient "changees" a chaque run alors
 * que la couleur est identique.
 */
export function normalizeForCompare(value: string): string {
  const shortHex = value.match(/^#([0-9a-fA-F]{3})$/);
  if (shortHex) {
    const [r, g, b] = shortHex[1].split('');
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  if (value.startsWith('#')) return value.toLowerCase();
  return value;
}
