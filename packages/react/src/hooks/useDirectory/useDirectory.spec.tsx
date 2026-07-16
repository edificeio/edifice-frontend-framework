import { renderHook } from '~/setup';
import useDirectory from './useDirectory';

const { getAvatarUrl, getDirectoryUrl } = vi.hoisted(() => ({
  getAvatarUrl: vi.fn(),
  getDirectoryUrl: vi.fn(),
}));

vi.mock('@edifice.io/client', () => ({
  odeServices: {
    directory: () => ({ getAvatarUrl, getDirectoryUrl }),
  },
}));

describe('useDirectory', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('builds an avatar URL through the directory service', () => {
    getAvatarUrl.mockReturnValue('/avatar/user-1');
    const { result } = renderHook(() => useDirectory());

    expect(result.current.getAvatarURL('user-1', 'user')).toBe(
      '/avatar/user-1',
    );
    expect(getAvatarUrl).toHaveBeenCalledWith('user-1', 'user');
  });

  it('returns undefined for an empty user id without calling the service', () => {
    const { result } = renderHook(() => useDirectory());

    expect(result.current.getAvatarURL('', 'user')).toBeUndefined();
    expect(getAvatarUrl).not.toHaveBeenCalled();
  });

  it('builds a userbook URL through the directory service', () => {
    getDirectoryUrl.mockReturnValue('/userbook/user-1');
    const { result } = renderHook(() => useDirectory());

    expect(result.current.getUserbookURL('user-1', 'user')).toBe(
      '/userbook/user-1',
    );
    expect(getDirectoryUrl).toHaveBeenCalledWith('user-1', 'user');
  });
});
