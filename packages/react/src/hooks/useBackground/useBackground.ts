import { useUiOverride } from '../useUiOverride';
import useUserPreferences from '../useUserPreferences';

export type Background =
  | 'default'
  | 'pink-200'
  | 'yellow-200'
  | 'orange-200'
  | 'blue-200'
  | 'green-200'
  | 'crna'
  | 'ent77';

type BackgroundPreferences = {
  background: Background;

  homePage?: { betaEnabled?: boolean | null } | null;
};

export default () => {
  const backgroundOverride = useUiOverride('layout.background');
  const backgroundDefault = useUiOverride('background.default');
  const { preferences } = useUserPreferences<BackgroundPreferences>();

  const isBackgroundImageOverridden = backgroundOverride?.variant === 'image';

  return {
    /* Beta is enabled unless explicitly disabled (undefined or null means enabled) */
    betaEnabled: preferences?.homePage?.betaEnabled !== false,
    /* Actual background is either : user's prefered value, theme-conf overriden value or 'default' */
    background:
      preferences?.background ??
      (backgroundDefault?.variant as Background) ??
      'default',
    isBackgroundImageOverridden,
    productOverride: backgroundOverride?.theme,
  };
};
