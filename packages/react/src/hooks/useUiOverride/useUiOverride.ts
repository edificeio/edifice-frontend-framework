import { useEdificeTheme } from '../../providers/EdificeThemeProvider/EdificeThemeProvider.hook';

/** Read the platform-driven UI override registered under `key` in the theme-conf, normalized to an object form. */
export default function useUiOverride(key: string) {
  const { theme } = useEdificeTheme();
  const raw = theme?.uiOverrides?.[key];
  return typeof raw === 'string' ? { variant: raw } : raw;
}
