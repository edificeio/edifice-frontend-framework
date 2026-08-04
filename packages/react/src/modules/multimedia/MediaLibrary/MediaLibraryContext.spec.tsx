import { ReactNode } from 'react';

import { renderHook } from '~/setup';

import {
  MediaLibraryContext,
  useMediaLibraryContext,
} from './MediaLibraryContext';

type ContextValue = Parameters<typeof MediaLibraryContext.Provider>[0]['value'];

const aContext = (partial: Partial<ContextValue> = {}) =>
  ({
    appCode: 'blog',
    type: 'image',
    setResultCounter: vi.fn(),
    setResult: vi.fn(),
    setCancellable: vi.fn(),
    setVisibleTab: vi.fn(),
    switchType: vi.fn(),
    setPreSuccess: vi.fn(),
    ...partial,
  }) as ContextValue;

describe('useMediaLibraryContext', () => {
  it('hands over the context provided by the MediaLibrary', () => {
    const value = aContext({ appCode: 'timelinegenerator' });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MediaLibraryContext.Provider value={value}>
        {children}
      </MediaLibraryContext.Provider>
    );

    const { result } = renderHook(() => useMediaLibraryContext(), { wrapper });

    expect(result.current).toBe(value);
    expect(result.current.appCode).toBe('timelinegenerator');
  });

  it('refuses to run outside the MediaLibrary', () => {
    // The context has no default value, so an innertab rendered on its own
    // gets null and must fail loudly rather than crash further down.
    expect(() => renderHook(() => useMediaLibraryContext())).toThrow(
      /cannot be rendered outside the MediaLibrary component/,
    );
  });
});
