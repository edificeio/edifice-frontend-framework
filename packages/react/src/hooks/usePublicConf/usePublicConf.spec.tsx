import type { App } from '@edifice.io/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { renderHook, waitFor } from '~/setup';
import usePublicConf from './usePublicConf';

const { getPublicConf } = vi.hoisted(() => ({
  getPublicConf: vi.fn(),
}));

vi.mock('@edifice.io/client', () => ({
  odeServices: {
    conf: () => ({
      getPublicConf,
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

interface PublicConf {
  featureFlag: boolean;
}

describe('usePublicConf', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns the public configuration once the query resolves', async () => {
    const publicConf: PublicConf = { featureFlag: true };
    getPublicConf.mockResolvedValue(publicConf);

    const { result } = renderHook(
      () => usePublicConf<PublicConf>('blog' as App),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(publicConf);
  });

  it('requests the public configuration for the given appCode', async () => {
    getPublicConf.mockResolvedValue({ featureFlag: false });

    const { result } = renderHook(
      () => usePublicConf<PublicConf>('blog' as App),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getPublicConf).toHaveBeenCalledWith('blog');
  });

  it('exposes the error state when the query fails', async () => {
    getPublicConf.mockRejectedValue(new Error('boom'));

    const { result } = renderHook(
      () => usePublicConf<PublicConf>('blog' as App),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
