export default function usePaths(): string[] {
  const base = import.meta.env.BASE_URL;
  const imagePath = `${base}assets/themes/edifice-bootstrap/images`;
  const iconPath = `${base}assets/themes/edifice-bootstrap/icons`;
  const fontPath = `${base}assets/themes/edifice-bootstrap/fonts`;

  return [imagePath, iconPath, fontPath];
}
