import { act, renderHook, waitFor } from '~/setup';
import useMediaLibrary from './useMediaLibrary';

const { remove } = vi.hoisted(() => ({
  remove: vi.fn(),
}));

vi.mock('../useWorkspaceFile', () => ({
  useWorkspaceFile: () => ({ remove }),
}));

describe('useMediaLibrary', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('starts with no selected media and a null ref', () => {
    const { result } = renderHook(() => useMediaLibrary());

    expect(result.current.libraryMedia).toBeUndefined();
    expect(result.current.ref.current).toBeNull();
  });

  it('builds a workspace document path for an image result', () => {
    const { result } = renderHook(() => useMediaLibrary());
    const hide = vi.fn();
    result.current.ref.current = { type: 'image', hide } as any;

    act(() => result.current.onSuccess([{ _id: 'abc' }] as any));

    expect(result.current.libraryMedia).toBe('/workspace/document/abc');
    expect(hide).toHaveBeenCalled();
  });

  it('returns the raw result for a hyperlink', () => {
    const { result } = renderHook(() => useMediaLibrary());
    result.current.ref.current = { type: 'hyperlink', hide: vi.fn() } as any;

    act(() => result.current.onSuccess('https://edifice.io' as any));

    expect(result.current.libraryMedia).toBe('https://edifice.io');
  });

  it('removes uploads on cancel when a media type is active', async () => {
    const { result } = renderHook(() => useMediaLibrary());
    const hide = vi.fn();
    result.current.ref.current = { type: 'image', hide } as any;
    const uploads = [{ _id: 'up-1' }] as any;

    await act(async () => {
      await result.current.onCancel(uploads);
    });

    expect(remove).toHaveBeenCalledWith(uploads);
    expect(hide).toHaveBeenCalled();
  });

  it('does not remove uploads on cancel when no media type is active', async () => {
    const { result } = renderHook(() => useMediaLibrary());

    await act(async () => {
      await result.current.onCancel([{ _id: 'up-1' }] as any);
    });

    expect(remove).not.toHaveBeenCalled();
  });

  it('removes uploads when switching tabs with an active media type', async () => {
    const { result } = renderHook(() => useMediaLibrary());
    result.current.ref.current = { type: 'image', hide: vi.fn() } as any;
    const uploads = [{ _id: 'up-1' }] as any;

    await act(async () => {
      await result.current.onTabChange({} as any, uploads);
    });

    await waitFor(() => expect(remove).toHaveBeenCalledWith(uploads));
  });
});
