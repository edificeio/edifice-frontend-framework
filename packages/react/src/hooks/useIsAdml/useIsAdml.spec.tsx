import { renderHook, waitFor } from '~/setup';
import useIsAdml from './useIsAdml';

const { isAdml } = vi.hoisted(() => ({
  isAdml: vi.fn(),
}));

vi.mock('@edifice.io/client', () => ({
  odeServices: {
    session: () => ({
      isAdml,
    }),
  },
}));

describe('useIsAdml', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('is false until the session service has resolved', async () => {
    isAdml.mockResolvedValue(true);

    const { result } = renderHook(() => useIsAdml());

    expect(result.current.isAdml).toBe(false);

    await waitFor(() => expect(result.current.isAdml).toBe(true));
  });

  it('is true when the user is an admin local', async () => {
    isAdml.mockResolvedValue(true);

    const { result } = renderHook(() => useIsAdml());

    await waitFor(() => expect(result.current.isAdml).toBe(true));
    expect(isAdml).toHaveBeenCalled();
  });

  it('is false when the user is not an admin local', async () => {
    isAdml.mockResolvedValue(false);

    const { result } = renderHook(() => useIsAdml());

    await waitFor(() => expect(isAdml).toHaveBeenCalled());
    expect(result.current.isAdml).toBe(false);
  });
});
