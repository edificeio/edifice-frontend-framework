/**
 * Normalizes a hex color for comparison only (#fff == #ffffff): the
 * repo sometimes uses the short form (#000, #fff), Figma always exports
 * 6 digits. Without this, these two lines would be "changed" on every run even though
 * the color is identical.
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
