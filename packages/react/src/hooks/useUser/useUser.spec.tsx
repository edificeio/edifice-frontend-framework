import type {
  IOdeTheme,
  IUserDescription,
  IUserInfo,
} from '@edifice.io/client';
import type { ReactNode } from 'react';
import { renderHook, wrapper } from '~/setup';
import { EdificeClientContext } from '../../providers/EdificeClientProvider/EdificeClientProvider.context';
import { EdificeThemeContext } from '../../providers/EdificeThemeProvider/EdificeThemeProvider.context';
import {
  mockSession,
  mockUser,
} from '../../providers/MockedProvider/MockedProvider.mocks';
import useUser from './useUser';

/**
 * Builds a wrapper providing the client and theme contexts consumed by
 * useUser, so each test can drive the avatar-resolution branches.
 */
function createWrapper({
  user,
  userDescription,
  basePath,
}: {
  user?: IUserInfo;
  userDescription?: Partial<IUserDescription>;
  basePath?: string;
}) {
  return ({ children }: { children: ReactNode }) => (
    <EdificeClientContext.Provider value={{ user, userDescription } as any}>
      <EdificeThemeContext.Provider
        value={{ theme: { basePath } as IOdeTheme }}
      >
        {children}
      </EdificeThemeContext.Provider>
    </EdificeClientContext.Provider>
  );
}

describe('useUser', () => {
  it('returns the user and its description from the client context', () => {
    const { result } = renderHook(() => useUser(), { wrapper });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.userDescription).toEqual(mockSession.userDescription);
  });

  it('uses the user picture as the avatar when one is set', () => {
    const { result } = renderHook(() => useUser(), {
      wrapper: createWrapper({
        user: mockUser,
        userDescription: { picture: '/userbook/avatar/some-id' },
        basePath: '/basepath',
      }),
    });

    expect(result.current.avatar).toBe('/userbook/avatar/some-id');
  });

  it('falls back to the default avatar when no picture is set', () => {
    const { result } = renderHook(() => useUser(), {
      wrapper: createWrapper({
        user: mockUser,
        userDescription: {},
        basePath: '/basepath',
      }),
    });

    expect(result.current.avatar).toBe(
      '/basepath/img/illustrations/no-avatar.svg',
    );
  });

  it.each(['no-avatar.jpg', 'no-avatar.svg'])(
    'falls back to the default avatar when the picture is the placeholder "%s"',
    (placeholder) => {
      const { result } = renderHook(() => useUser(), {
        wrapper: createWrapper({
          user: mockUser,
          userDescription: { picture: placeholder },
          basePath: '/basepath',
        }),
      });

      expect(result.current.avatar).toBe(
        '/basepath/img/illustrations/no-avatar.svg',
      );
    },
  );

  it('returns an undefined user when the context has none', () => {
    const { result } = renderHook(() => useUser(), {
      wrapper: createWrapper({
        user: undefined,
        userDescription: undefined,
        basePath: '/basepath',
      }),
    });

    expect(result.current.user).toBeUndefined();
    expect(result.current.userDescription).toBeUndefined();
    expect(result.current.avatar).toBe(
      '/basepath/img/illustrations/no-avatar.svg',
    );
  });
});
