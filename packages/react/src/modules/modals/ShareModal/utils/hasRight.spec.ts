import { ShareRight, ShareRightAction } from '@edifice.io/client';
import { hasRight } from './hasRight';

const buildAction = (id: ShareRightAction['id']): ShareRightAction => ({
  id,
  displayName: id,
});

const buildShareRight = (actions: ShareRightAction[]): ShareRight => ({
  id: 'right-1',
  type: 'user',
  displayName: 'Some user',
  avatarUrl: '/avatar.png',
  directoryUrl: '/directory',
  actions,
});

describe('hasRight', () => {
  it('returns true when the share right contains the action', () => {
    const shareRight = buildShareRight([
      buildAction('read'),
      buildAction('contrib'),
    ]);

    expect(hasRight(shareRight, buildAction('contrib'))).toBe(true);
  });

  it('returns false when the share right does not contain the action', () => {
    const shareRight = buildShareRight([buildAction('read')]);

    expect(hasRight(shareRight, buildAction('manage'))).toBe(false);
  });

  it('returns false when the share right has no actions', () => {
    const shareRight = buildShareRight([]);

    expect(hasRight(shareRight, buildAction('read'))).toBe(false);
  });
});
