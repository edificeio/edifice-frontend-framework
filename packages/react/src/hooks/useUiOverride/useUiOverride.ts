import { useEdificeTheme } from '../../providers/EdificeThemeProvider/EdificeThemeProvider.hook';

/**
 * Read the platform-driven UI override registered under `key` in the
 * theme-conf. A string variant is normalized to `{ variant }`; a boolean
 * flag or a `{ variant, theme? }` object is returned as-is.
 */
export default function useUiOverride(key: string) {
  const { theme } = useEdificeTheme();
  const raw = theme?.uiOverrides?.[key];
  return typeof raw === 'string' ? { variant: raw } : raw;
}
