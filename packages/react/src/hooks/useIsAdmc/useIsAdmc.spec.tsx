import { renderHook, waitFor } from '~/setup';
import useIsAdmc from './useIsAdmc';

const { getUser } = vi.hoisted(() => ({
  getUser: vi.fn(),
}));

vi.mock('@edifice.io/client', () => ({
  odeServices: {
    session: () => ({
      getUser,
    }),
  },
}));

describe('useIsAdmc', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('is false until the user has been resolved', async () => {
    getUser.mockResolvedValue({
      functions: { SUPER_ADMIN: { code: 'SUPER_ADMIN', scope: [] } },
    });

    const { result } = renderHook(() => useIsAdmc());

    expect(result.current.isAdmc).toBe(false);

    await waitFor(() => expect(result.current.isAdmc).toBe(true));
  });

  it('is true when the user has the SUPER_ADMIN function', async () => {
    getUser.mockResolvedValue({
      functions: { SUPER_ADMIN: { code: 'SUPER_ADMIN', scope: [] } },
    });

    const { result } = renderHook(() => useIsAdmc());

    await waitFor(() => expect(result.current.isAdmc).toBe(true));
  });

  it('is false when the user has no SUPER_ADMIN function', async () => {
    getUser.mockResolvedValue({
      functions: { ADMIN_LOCAL: { code: 'ADMIN_LOCAL', scope: [] } },
    });

    const { result } = renderHook(() => useIsAdmc());

    // Give the pending promise a chance to settle, then assert it stays false.
    await waitFor(() => expect(getUser).toHaveBeenCalled());
    expect(result.current.isAdmc).toBe(false);
  });

  it('is false when there is no session (user is undefined)', async () => {
    getUser.mockResolvedValue(undefined);

    const { result } = renderHook(() => useIsAdmc());

    await waitFor(() => expect(getUser).toHaveBeenCalled());
    expect(result.current.isAdmc).toBe(false);
  });

  it('is false when getUser rejects', async () => {
    getUser.mockRejectedValue(new Error('NOT_LOGGED_IN'));

    const { result } = renderHook(() => useIsAdmc());

    await waitFor(() => expect(getUser).toHaveBeenCalled());
    expect(result.current.isAdmc).toBe(false);
  });
});
