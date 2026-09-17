import { renderHook } from '~/setup';

import useBackground from './useBackground';

const { preferences, uiOverrides } = vi.hoisted(() => ({
  preferences: { current: undefined as { background?: string } | undefined },
  uiOverrides: {
    current: {} as Record<string, { variant: string; theme?: string }>,
  },
}));

vi.mock('../useUiOverride', () => ({
  useUiOverride: (key: string) => uiOverrides.current[key],
}));

vi.mock('../useUserPreferences', () => ({
  default: () => ({ preferences: preferences.current }),
}));

describe('useBackground', () => {
  beforeEach(() => {
    preferences.current = undefined;
    uiOverrides.current = {};
  });

  it('prefers the user background over the theme default', () => {
    preferences.current = { background: 'pink-200' };
    uiOverrides.current['background.default'] = { variant: 'blue-200' };

    const { result } = renderHook(() => useBackground());

    expect(result.current.background).toBe('pink-200');
  });

  it('uses the theme default when no user background is set', () => {
    uiOverrides.current['background.default'] = { variant: 'yellow-200' };

    const { result } = renderHook(() => useBackground());

    expect(result.current.background).toBe('yellow-200');
  });

  it('falls back to the default background when no override is set', () => {
    const { result } = renderHook(() => useBackground());

    expect(result.current.background).toBe('default');
  });

  it('maps an image override to its flag and product theme', () => {
    uiOverrides.current['layout.background'] = {
      variant: 'image',
      theme: 'crna',
    };

    const { result } = renderHook(() => useBackground());

    expect(result.current).toEqual({
      background: 'default',
      isBackgroundImageOverridden: true,
      productOverride: 'crna',
    });
  });
});
