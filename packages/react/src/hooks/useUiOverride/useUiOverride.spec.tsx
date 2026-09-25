import { type ReactNode } from 'react';

import { renderHook } from '~/setup';

import { EdificeThemeContext } from '../../providers/EdificeThemeProvider/EdificeThemeProvider.context';
import useUiOverride from './useUiOverride';

const themeWrapper = (uiOverrides?: Record<string, unknown>) => {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <EdificeThemeContext.Provider value={{ theme: { uiOverrides } as any }}>
        {children}
      </EdificeThemeContext.Provider>
    );
  };
};

describe('useUiOverride', () => {
  it('returns undefined when the key is absent from uiOverrides', () => {
    const { result } = renderHook(() => useUiOverride('layout.header'), {
      wrapper: themeWrapper({}),
    });

    expect(result.current).toBeUndefined();
  });

  it('normalizes a string override to { variant }', () => {
    const { result } = renderHook(() => useUiOverride('notifications.panel'), {
      wrapper: themeWrapper({ 'notifications.panel': 'with-flash-history' }),
    });

    expect(result.current).toEqual({ variant: 'with-flash-history' });
  });

  it('passes through an object override untouched', () => {
    const { result } = renderHook(() => useUiOverride('layout.header'), {
      wrapper: themeWrapper({
        'layout.header': { variant: 'v2', theme: 'crna' },
      }),
    });

    expect(result.current).toEqual({ variant: 'v2', theme: 'crna' });
  });
});
