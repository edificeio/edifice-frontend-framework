import { renderHook } from '~/setup';

import useBackground from './useBackground';

const { preferences, uiOverrides } = vi.hoisted(() => ({
  preferences: {
    current: undefined as
      | {
          background?: string;
          homePage?: { betaEnabled?: boolean | null } | null;
        }
      | undefined,
  },
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

  it.each(['crna', 'ent77'])(
    'uses the %s platform background set as theme default',
    (platformBackground) => {
      uiOverrides.current['background.default'] = {
        variant: platformBackground,
      };

      const { result } = renderHook(() => useBackground());

      expect(result.current.background).toBe(platformBackground);
    },
  );

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
      betaEnabled: true,
      background: 'default',
      isBackgroundImageOverridden: true,
      productOverride: 'crna',
    });
  });

  // TODO(IMPULS-6352): remove the betaEnabled references.
  it.each([
    ['no preferences', undefined],
    ['no homePage preference', { homePage: null }],
    ['an undefined betaEnabled', { homePage: {} }],
    ['a null betaEnabled', { homePage: { betaEnabled: null } }],
    ['betaEnabled set to true', { homePage: { betaEnabled: true } }],
  ])('considers beta enabled with %s', (_, prefs) => {
    preferences.current = prefs;

    const { result } = renderHook(() => useBackground());

    expect(result.current.betaEnabled).toBe(true);
  });

  it('considers beta disabled only when betaEnabled is explicitly false', () => {
    preferences.current = { homePage: { betaEnabled: false } };

    const { result } = renderHook(() => useBackground());

    expect(result.current.betaEnabled).toBe(false);
  });
});
