import { MutableRefObject } from 'react';

import { ShareRight, ShareRightWithVisibles } from '@edifice.io/client';

import { act, renderHook } from '~/setup';
import { useShareBookmark } from './useShareBookmark';

// The hook exposes a ref meant to be attached to a real <input>; writing to
// `.current` here simulates that attachment. The exposed type has a
// read-only `current`, so cast to the writable shape instead of scattering
// casts at every call site.
const setRefCurrent = <T>(ref: { current: T }, value: T) => {
  (ref as MutableRefObject<T>).current = value;
};

const { saveBookmarks } = vi.hoisted(() => ({
  saveBookmarks: vi.fn(),
}));

vi.mock('@edifice.io/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@edifice.io/client')>();
  return {
    ...actual,
    odeServices: {
      directory: () => ({
        saveBookmarks,
      }),
    },
  };
});

const { toast } = vi.hoisted(() => ({
  toast: {
    custom: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
    remove: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  default: toast,
}));

const buildShareRight = (overrides: Partial<ShareRight> = {}): ShareRight => ({
  id: 'right-1',
  type: 'user',
  displayName: 'Right 1',
  avatarUrl: '',
  directoryUrl: '',
  actions: [],
  ...overrides,
});

const buildShareRights = (
  overrides: Partial<ShareRightWithVisibles> = {},
): ShareRightWithVisibles => ({
  rights: [],
  visibleUsers: [],
  visibleGroups: [],
  visibleBookmarks: [],
  ...overrides,
});

describe('useShareBookmark', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('handleBookmarkChange', () => {
    it('updates bookmark.name from the ref input value', () => {
      const shareDispatch = vi.fn();
      const { result } = renderHook(() =>
        useShareBookmark({ shareRights: buildShareRights(), shareDispatch }),
      );

      act(() => {
        setRefCurrent(result.current.refBookmark, {
          value: 'My Bookmark',
        } as HTMLInputElement);
      });

      act(() => {
        result.current.handleBookmarkChange();
      });

      expect(result.current.bookmark.name).toBe('My Bookmark');
    });
  });

  describe('toggleBookmark', () => {
    it('flips showBookmark', () => {
      const shareDispatch = vi.fn();
      const { result } = renderHook(() =>
        useShareBookmark({ shareRights: buildShareRights(), shareDispatch }),
      );

      expect(result.current.showBookmark).toBe(false);

      act(() => {
        result.current.toggleBookmark();
      });

      expect(result.current.showBookmark).toBe(true);

      act(() => {
        result.current.toggleBookmark();
      });

      expect(result.current.showBookmark).toBe(false);
    });
  });

  describe('saveBookmark / handleOnSave', () => {
    it('saves the bookmark with the rights filtered by type, updates shareRights and closes the input', async () => {
      saveBookmarks.mockResolvedValue({ id: 'bookmark-99' });

      const userRight = buildShareRight({ id: 'user-1', type: 'user' });
      const groupRight = buildShareRight({ id: 'group-1', type: 'group' });
      const bookmarkRight = buildShareRight({
        id: 'bookmark-1',
        type: 'sharebookmark',
      });
      const shareRights = buildShareRights({
        rights: [userRight, groupRight, bookmarkRight],
        visibleBookmarks: [
          { displayName: 'Existing', id: 'existing-1', notVisibleCount: 0 },
        ],
      });
      const shareDispatch = vi.fn();

      const { result } = renderHook(() =>
        useShareBookmark({ shareRights, shareDispatch }),
      );

      act(() => {
        result.current.toggleBookmarkInput(true);
      });
      expect(result.current.showBookmarkInput).toBe(true);

      act(() => {
        setRefCurrent(result.current.refBookmark, {
          value: 'New Bookmark',
        } as HTMLInputElement);
      });

      await act(async () => {
        await result.current.handleOnSave();
      });

      expect(saveBookmarks).toHaveBeenCalledWith('New Bookmark', {
        users: ['user-1'],
        groups: ['group-1'],
        bookmarks: ['bookmark-1'],
      });

      expect(shareDispatch).toHaveBeenCalledWith({
        type: 'updateShareRights',
        payload: {
          ...shareRights,
          visibleBookmarks: [
            ...shareRights.visibleBookmarks,
            {
              displayName: 'New Bookmark',
              id: 'bookmark-99',
              notVisibleCount: 0,
            },
          ],
        },
      });

      expect(result.current.showBookmarkInput).toBe(false);
    });

    it('logs the error and shows an error toast without dispatching when saveBookmarks rejects', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      const error = new Error('save failed');
      saveBookmarks.mockRejectedValue(error);

      const shareRights = buildShareRights();
      const shareDispatch = vi.fn();

      const { result } = renderHook(() =>
        useShareBookmark({ shareRights, shareDispatch }),
      );

      act(() => {
        setRefCurrent(result.current.refBookmark, {
          value: 'New Bookmark',
        } as HTMLInputElement);
      });

      await act(async () => {
        await result.current.handleOnSave();
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to save bookmark',
        error,
      );
      expect(toast.custom).toHaveBeenCalled();
      const [element] = toast.custom.mock.calls[0];
      expect(element.props.type).toBe('danger');
      expect(shareDispatch).not.toHaveBeenCalled();
    });
  });
});
