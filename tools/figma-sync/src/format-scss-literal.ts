// Figma stores these families in pixels; the repo expresses them in rem (font
// base 62.5% => 1rem = 10px, hence the division by 10). font/weight/* and other
// raw numbers (columns, screen widths...) are NOT concerned.
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
    if (value === 0) return '0'; // the repo writes "0", never "0rem"
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
