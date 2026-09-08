import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { renderHook, waitFor } from '~/setup';
import { useUserPreferences } from './useUserPreferences';

const { getUserPreferences, saveUserPreferences } = vi.hoisted(() => ({
  getUserPreferences: vi.fn(),
  saveUserPreferences: vi.fn(),
}));

vi.mock('@edifice.io/client', () => ({
  odeServices: {
    conf: () => ({
      getUserPreferences,
      saveUserPreferences,
    }),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useUserPreferences', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('loads user preferences once and exposes them', async () => {
    const preferences = {
      language: { 'default-domain': 'fr' },
      background: 'default',
    };
    getUserPreferences.mockResolvedValue(preferences);

    const { result } = renderHook(
      () => useUserPreferences<typeof preferences>(),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() =>
      expect(result.current.preferences).toEqual(preferences),
    );
    expect(getUserPreferences).toHaveBeenCalledTimes(1);
  });

  it('caches the preferences returned when saving the whole payload', async () => {
    const preferences = {
      language: { 'default-domain': 'fr' },
      apps: { bookmarks: ['news'] },
    };
    const savedPreferences = {
      ...preferences,
      background: 'default',
    };
    getUserPreferences.mockResolvedValue(preferences);
    saveUserPreferences.mockResolvedValue(savedPreferences);

    const { result } = renderHook(
      () => useUserPreferences<typeof preferences>(),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() =>
      expect(result.current.preferences).toEqual(preferences),
    );
    await result.current.savePreferences(preferences);

    expect(saveUserPreferences).toHaveBeenCalledWith(preferences);
    await waitFor(() =>
      expect(result.current.preferences).toEqual(savedPreferences),
    );
    expect(getUserPreferences).toHaveBeenCalledTimes(1);
  });
});
