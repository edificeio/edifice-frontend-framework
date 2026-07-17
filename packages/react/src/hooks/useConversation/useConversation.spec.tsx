import { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '~/setup';
import useConversation from './useConversation';

const { hasWorkflowRight, get } = vi.hoisted(() => ({
  hasWorkflowRight: vi.fn(),
  get: vi.fn(),
}));

vi.mock('@edifice.io/client', () => ({
  odeServices: {
    rights: () => ({ sessionHasWorkflowRight: hasWorkflowRight }),
    http: () => ({ get }),
  },
}));

// Each test gets its own QueryClient to avoid cache pollution from the
// module-level singleton used by the shared MockedProvider.
function createWrapper() {
  const queryClient = new QueryClient();
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

function mockGet(overrides: Record<string, unknown>) {
  get.mockImplementation(async (url: string) => {
    if (url in overrides) return overrides[url];
    throw new Error(`unexpected url: ${url}`);
  });
}

describe('useConversation', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('starts with 0 messages and resolves the count once the query settles', async () => {
    hasWorkflowRight.mockResolvedValue(false);
    mockGet({
      '/conversation/api/count/inbox': { count: 3 },
      '/userbook/preference/zimbra': { preference: null },
    });

    const { result } = renderHook(() => useConversation(), {
      wrapper: createWrapper(),
    });

    expect(result.current.messages).toBe(0);

    await waitFor(() => expect(result.current.messages).toBe(3));
  });

  it('always fetches the count from the conversation endpoint on mount, even when zimbraWorkflow later resolves true (existing behavior)', async () => {
    // The count query has no `enabled` gate and runs on mount, when
    // zimbraWorkflow is still undefined (useHasWorkflow resolves
    // asynchronously) — so it always reads the conversation endpoint on
    // first mount. Since the queryKey never changes, React Query does not
    // re-run it once zimbraWorkflow later resolves to true.
    hasWorkflowRight.mockResolvedValue(true);
    mockGet({
      '/conversation/api/count/inbox': { count: 5 },
      '/zimbra/count/INBOX': { count: 999 },
      '/userbook/preference/zimbra': { preference: null },
    });

    const { result } = renderHook(() => useConversation(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.messages).toBe(5));
    await waitFor(() => expect(result.current.zimbraWorkflow).toBe(true));
    expect(get).not.toHaveBeenCalledWith(
      '/zimbra/count/INBOX',
      expect.anything(),
    );
  });

  it('falls back to the default zimbra link when not in expert mode', async () => {
    hasWorkflowRight.mockResolvedValue(false);
    mockGet({
      '/conversation/api/count/inbox': { count: 0 },
      '/userbook/preference/zimbra': {
        preference: JSON.stringify({ modeExpert: false }),
      },
    });

    const { result } = renderHook(() => useConversation(), {
      wrapper: createWrapper(),
    });

    await waitFor(() =>
      expect(result.current.msgLink).toBe(
        window.location.origin + '/zimbra/zimbra',
      ),
    );
  });

  it('never reaches the preauth link, even in expert mode with preauth allowed (existing behavior)', async () => {
    // goToMessagerie runs once on mount (effect with an empty dependency
    // array) and closes over zimbraPreauth's value at that time, which is
    // still undefined (useHasWorkflow resolves asynchronously). Because that
    // closure is never recreated, `isExpertMode && zimbraPreauth` always
    // reads a stale falsy zimbraPreauth, so the preauth branch is
    // effectively unreachable regardless of what it resolves to afterwards.
    hasWorkflowRight.mockResolvedValue(true);
    mockGet({
      '/conversation/api/count/inbox': { count: 0 },
      '/zimbra/count/INBOX': { count: 0 },
      '/userbook/preference/zimbra': {
        preference: JSON.stringify({ modeExpert: true }),
      },
    });

    const { result } = renderHook(() => useConversation(), {
      wrapper: createWrapper(),
    });

    await waitFor(() =>
      expect(result.current.msgLink).toBe(
        window.location.origin + '/zimbra/zimbra',
      ),
    );
  });

  it('falls back to the default link when the preference request fails', async () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    hasWorkflowRight.mockResolvedValue(false);
    get.mockImplementation(async (url: string) => {
      if (url === '/conversation/api/count/inbox') return { count: 0 };
      throw new Error('boom');
    });

    const { result } = renderHook(() => useConversation(), {
      wrapper: createWrapper(),
    });

    await waitFor(() =>
      expect(result.current.msgLink).toBe(
        window.location.origin + '/zimbra/zimbra',
      ),
    );

    consoleError.mockRestore();
  });
});
