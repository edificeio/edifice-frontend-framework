import { MutableRefObject } from 'react';

import { act, renderHook, waitFor } from '~/setup';
import useMediaLibrary from './useMediaLibrary';

// The hook exposes a ref meant to be attached to a real <MediaLibrary>
// component; writing to `.current` here simulates that attachment. The
// exposed type has a read-only `current`, so cast to the writable shape
// instead of scattering casts at every call site.
const setRefCurrent = <T,>(ref: { current: T }, value: T) => {
  (ref as MutableRefObject<T>).current = value;
};

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
    setRefCurrent(result.current.ref, { type: 'image', hide } as any);

    act(() => result.current.onSuccess([{ _id: 'abc' }] as any));

    expect(result.current.libraryMedia).toBe('/workspace/document/abc');
    expect(hide).toHaveBeenCalled();
  });

  it('returns the raw result for a hyperlink', () => {
    const { result } = renderHook(() => useMediaLibrary());
    setRefCurrent(result.current.ref, {
      type: 'hyperlink',
      hide: vi.fn(),
    } as any);

    act(() => result.current.onSuccess('https://edifice.io' as any));

    expect(result.current.libraryMedia).toBe('https://edifice.io');
  });

  it('removes uploads on cancel when a media type is active', async () => {
    const { result } = renderHook(() => useMediaLibrary());
    const hide = vi.fn();
    setRefCurrent(result.current.ref, { type: 'image', hide } as any);
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
    setRefCurrent(result.current.ref, {
      type: 'image',
      hide: vi.fn(),
    } as any);
    const uploads = [{ _id: 'up-1' }] as any;

    await act(async () => {
      await result.current.onTabChange({} as any, uploads);
    });

    await waitFor(() => expect(remove).toHaveBeenCalledWith(uploads));
  });
});
