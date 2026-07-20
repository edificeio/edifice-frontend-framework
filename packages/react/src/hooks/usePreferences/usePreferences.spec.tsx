import { renderHook } from '~/setup';
import usePreferences from './usePreferences';

const { getPreference, savePreference } = vi.hoisted(() => ({
  getPreference: vi.fn(),
  savePreference: vi.fn(),
}));

vi.mock('@edifice.io/client', () => ({
  odeServices: {
    conf: () => ({
      getPreference,
      savePreference,
    }),
  },
}));

describe('usePreferences', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('reads a preference by name', async () => {
    const preference = { theme: 'dark' };
    getPreference.mockResolvedValue(preference);

    const { result } = renderHook(() => usePreferences('my-pref'));

    await expect(result.current.getPreference()).resolves.toEqual(preference);
    expect(getPreference).toHaveBeenCalledWith('my-pref');
  });

  it('serializes the value as JSON when saving a preference', async () => {
    savePreference.mockResolvedValue(undefined);
    const value = { theme: 'dark', collapsed: true };

    const { result } = renderHook(() => usePreferences('my-pref'));

    await result.current.savePreference(value);

    expect(savePreference).toHaveBeenCalledWith(
      'my-pref',
      JSON.stringify(value),
    );
  });

  it('keeps the preference name bound across get and save', async () => {
    getPreference.mockResolvedValue('value');
    savePreference.mockResolvedValue(undefined);

    const { result } = renderHook(() => usePreferences('language'));

    await result.current.getPreference();
    await result.current.savePreference('fr');

    expect(getPreference).toHaveBeenCalledWith('language');
    expect(savePreference).toHaveBeenCalledWith(
      'language',
      JSON.stringify('fr'),
    );
  });
});
