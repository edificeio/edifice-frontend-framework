import type { ReactNode } from 'react';
import { renderHook, wrapper } from '~/setup';
import { EdificeClientContext } from '../../providers/EdificeClientProvider/EdificeClientProvider.context';
import useBookmark from './useBookmark';

function createWrapper(bookmarkedApps?: Array<{ displayName: string }>) {
  return ({ children }: { children: ReactNode }) => (
    <EdificeClientContext.Provider
      value={
        {
          sessionQuery: {
            data: bookmarkedApps ? { bookmarkedApps } : undefined,
          },
        } as any
      }
    >
      {children}
    </EdificeClientContext.Provider>
  );
}

describe('useBookmark', () => {
  it('returns an empty list with the default session (no bookmarks)', () => {
    const { result } = renderHook(() => useBookmark(), { wrapper });

    expect(result.current).toEqual([]);
  });

  it('returns undefined when the session has no data', () => {
    const { result } = renderHook(() => useBookmark(), {
      wrapper: createWrapper(undefined),
    });

    expect(result.current).toBeUndefined();
  });

  it('deduplicates bookmarked apps by displayName', () => {
    const { result } = renderHook(() => useBookmark(), {
      wrapper: createWrapper([
        { displayName: 'Blog' },
        { displayName: 'Wiki' },
        { displayName: 'Blog' },
      ]),
    });

    expect(result.current).toEqual([
      { displayName: 'Blog' },
      { displayName: 'Wiki' },
    ]);
  });
});
