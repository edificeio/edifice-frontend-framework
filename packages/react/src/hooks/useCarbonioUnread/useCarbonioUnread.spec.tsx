import { renderHook, waitFor, wrapper } from '~/setup';
import useCarbonioUnread from './useCarbonioUnread';

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

describe('useCarbonioUnread', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('resolves the unread count when the user can open Carbonio', async () => {
    hasWorkflowRight.mockResolvedValue(true);
    get.mockResolvedValue({ count: 7 });

    const { result } = renderHook(() => useCarbonioUnread(), { wrapper });

    expect(result.current.unreadCount).toBe(0);

    await waitFor(() => expect(result.current.unreadCount).toBe(7));
    expect(result.current.hasCarbonioWorkflow).toBe(true);
    expect(get).toHaveBeenCalledWith('/auth/carbonio/unread', {
      disableNotifications: true,
    });
  });

  it('does not query Carbonio without the preauth workflow', async () => {
    hasWorkflowRight.mockResolvedValue(false);

    const { result } = renderHook(() => useCarbonioUnread(), { wrapper });

    await waitFor(() => expect(hasWorkflowRight).toHaveBeenCalled());
    expect(result.current.hasCarbonioWorkflow).toBe(false);
    expect(result.current.unreadCount).toBe(0);
    expect(get).not.toHaveBeenCalled();
  });

  it('counts 0 when Carbonio cannot be reached', async () => {
    hasWorkflowRight.mockResolvedValue(true);
    get.mockRejectedValue({ error: 'carbonio.unread.error' });

    const { result } = renderHook(() => useCarbonioUnread(), { wrapper });

    await waitFor(() => expect(get).toHaveBeenCalledTimes(1));
    expect(result.current.unreadCount).toBe(0);
  });
});
