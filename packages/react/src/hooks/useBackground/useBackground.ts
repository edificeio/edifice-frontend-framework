import { useUiOverride } from '../useUiOverride';
import useUserPreferences from '../useUserPreferences';

export type Background =
  | 'default'
  | 'pink-200'
  | 'yellow-200'
  | 'orange-200'
  | 'blue-200'
  | 'green-200';

type BackgroundPreferences = {
  background: Background;
};

export default () => {
  const backgroundOverride = useUiOverride('layout.background');
  const backgroundDefault = useUiOverride('background.default');
  const { preferences } = useUserPreferences<BackgroundPreferences>();

  const isBackgroundImageOverriden = backgroundOverride?.variant === 'image';

  return {
    /* Actual background is either : user's prefered value, theme-conf overriden value or 'default' */
    background:
      preferences?.background ?? backgroundDefault?.variant ?? 'default',
    isBackgroundImageOverriden,
    productOverride: backgroundOverride?.theme,
  };
};
