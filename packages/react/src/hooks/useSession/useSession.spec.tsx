import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { renderHook, waitFor } from '~/setup';
import useSession from './useSession';

const { getSession } = vi.hoisted(() => ({
  getSession: vi.fn(),
}));

vi.mock('@edifice.io/client', () => ({
  odeServices: {
    session: () => ({
      getSession,
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

describe('useSession', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('is loading before the session resolves', () => {
    getSession.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('exposes the session once the query resolves', async () => {
    const session = { user: { userId: 'user-id' }, currentLanguage: 'fr' };
    getSession.mockResolvedValue(session);

    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(session);
    expect(getSession).toHaveBeenCalled();
  });

  it('exposes the error state when the query fails', async () => {
    getSession.mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
