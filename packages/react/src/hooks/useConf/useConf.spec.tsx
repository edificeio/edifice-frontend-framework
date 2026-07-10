import type { App } from '@edifice.io/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { renderHook, waitFor } from '~/setup';
import useConf from './useConf';

const { getConf } = vi.hoisted(() => ({
  getConf: vi.fn(),
}));

vi.mock('@edifice.io/client', () => ({
  odeServices: {
    conf: () => ({
      getConf,
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

describe('useConf', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns the configuration once the query resolves', async () => {
    const conf = { app: 'blog', applications: [] };
    getConf.mockResolvedValue(conf);

    const { result } = renderHook(() => useConf({ appCode: 'blog' as App }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(conf);
  });

  it('requests the configuration for the given appCode', async () => {
    getConf.mockResolvedValue({ app: 'blog' });

    const { result } = renderHook(() => useConf({ appCode: 'blog' as App }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getConf).toHaveBeenCalledWith('blog');
  });

  it('exposes the error state when the query fails', async () => {
    getConf.mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => useConf({ appCode: 'blog' as App }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
