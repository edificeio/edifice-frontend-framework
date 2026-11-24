import { describe, expect, it } from 'vitest';

import { getHeaderAvatarUrl } from './getHeaderAvatarUrl';

describe('getHeaderAvatarUrl', () => {
  it('appends the 100x100 thumbnail to a user avatar URL', () => {
    expect(getHeaderAvatarUrl('/userbook/avatar/123')).toBe(
      '/userbook/avatar/123?thumbnail=100x100',
    );
  });

  it('uses "&" when the URL already has query parameters', () => {
    expect(getHeaderAvatarUrl('/userbook/avatar/123?v=2')).toBe(
      '/userbook/avatar/123?v=2&thumbnail=100x100',
    );
  });

  it('keeps an existing thumbnail parameter', () => {
    expect(getHeaderAvatarUrl('/userbook/avatar/123?thumbnail=48x48')).toBe(
      '/userbook/avatar/123?thumbnail=48x48',
    );
  });

  it('leaves the default "no avatar" visual unchanged', () => {
    const noAvatar = '/assets/themes/edifice/img/illustrations/no-avatar.svg';
    expect(getHeaderAvatarUrl(noAvatar)).toBe(noAvatar);
  });

  it('leaves an empty URL unchanged', () => {
    expect(getHeaderAvatarUrl('')).toBe('');
  });
});
