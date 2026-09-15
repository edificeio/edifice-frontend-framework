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
  const isBackgroundImageOverriden = backgroundOverride?.variant === 'image';
  const { preferences } = useUserPreferences<BackgroundPreferences>();

  return {
    background: preferences?.background ?? 'default',
    isBackgroundImageOverriden,
    productOverride: backgroundOverride?.theme,
  };
};
