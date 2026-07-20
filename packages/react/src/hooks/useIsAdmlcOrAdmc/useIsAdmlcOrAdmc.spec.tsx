import { renderHook } from '~/setup';
import useIsAdmlcOrAdmc from './useIsAdmlcOrAdmc';

const { useIsAdml, useIsAdmc } = vi.hoisted(() => ({
  useIsAdml: vi.fn(),
  useIsAdmc: vi.fn(),
}));

vi.mock('../useIsAdml', () => ({
  useIsAdml,
}));

vi.mock('../useIsAdmc', () => ({
  useIsAdmc,
}));

describe('useIsAdmlcOrAdmc', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('is true when the user is only an admin local (ADML)', () => {
    useIsAdml.mockReturnValue({ isAdml: true });
    useIsAdmc.mockReturnValue({ isAdmc: false });

    const { result } = renderHook(() => useIsAdmlcOrAdmc());

    expect(result.current.isAdmlcOrAdmc).toBe(true);
  });

  it('is true when the user is only a super admin (ADMC)', () => {
    useIsAdml.mockReturnValue({ isAdml: false });
    useIsAdmc.mockReturnValue({ isAdmc: true });

    const { result } = renderHook(() => useIsAdmlcOrAdmc());

    expect(result.current.isAdmlcOrAdmc).toBe(true);
  });

  it('is true when the user is both ADML and ADMC', () => {
    useIsAdml.mockReturnValue({ isAdml: true });
    useIsAdmc.mockReturnValue({ isAdmc: true });

    const { result } = renderHook(() => useIsAdmlcOrAdmc());

    expect(result.current.isAdmlcOrAdmc).toBe(true);
  });

  it('is false when the user is neither ADML nor ADMC', () => {
    useIsAdml.mockReturnValue({ isAdml: false });
    useIsAdmc.mockReturnValue({ isAdmc: false });

    const { result } = renderHook(() => useIsAdmlcOrAdmc());

    expect(result.current.isAdmlcOrAdmc).toBe(false);
  });
});
