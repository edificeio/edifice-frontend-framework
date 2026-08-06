import { ShareRight } from '@edifice.io/client';
import { showShareRightLine } from './showShareRightLine';

const buildShareRight = (isBookmarkMember?: boolean): ShareRight => ({
  id: 'right-1',
  type: 'sharebookmark',
  displayName: 'Some bookmark',
  avatarUrl: '/avatar.png',
  directoryUrl: '/directory',
  actions: [],
  isBookmarkMember,
});

describe('showShareRightLine', () => {
  it('returns true when isBookmarkMember and showBookmarkMembers are both true', () => {
    expect(showShareRightLine(buildShareRight(true), true)).toBe(true);
  });

  it('returns false when isBookmarkMember is true and showBookmarkMembers is false', () => {
    expect(showShareRightLine(buildShareRight(true), false)).toBe(false);
  });

  it('returns true when isBookmarkMember is false and showBookmarkMembers is true', () => {
    expect(showShareRightLine(buildShareRight(false), true)).toBe(true);
  });

  it('returns true when isBookmarkMember and showBookmarkMembers are both false', () => {
    expect(showShareRightLine(buildShareRight(false), false)).toBe(true);
  });
});
