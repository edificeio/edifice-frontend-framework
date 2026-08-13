// Figma stocke ces familles en pixels ; le repo les exprime en rem (base de
// police 62.5% => 1rem = 10px, d'ou la division par 10). font/weight/* et les
// autres nombres bruts (colonnes, largeurs d'ecran...) ne sont PAS concernes.
export const REM_SCALE_PREFIXES = [
  'numbers/',
  'font/size/',
  'font/lineHeight/',
];

export function formatScssLiteral(
  figmaName: string,
  value: string | number,
): string {
  if (typeof value === 'number') {
    if (value === 0) return '0'; // le repo ecrit "0", jamais "0rem"
    if (REM_SCALE_PREFIXES.some((p) => figmaName.startsWith(p))) {
      const rem = Number((value / 10).toFixed(4));
      return `${rem}rem`;
    }
    return String(value);
  }
  if (value.startsWith('#')) {
    return value;
  }
  return `'${value}'`;
}
