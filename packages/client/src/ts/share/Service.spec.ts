import { IOdeServices } from '../services/OdeServices';
import { ShareRight } from './interface';
import { ShareService } from './Service';

describe('ShareService', () => {
  let service: ShareService;

  const currentUser = { userId: 'user-me', username: 'Me' };

  const otherRight: ShareRight = {
    id: 'user-other',
    type: 'user',
    displayName: 'Other',
    avatarUrl: '',
    directoryUrl: '',
    actions: [{ id: 'read', displayName: 'read' }],
  };

  beforeEach(() => {
    service = new ShareService({} as unknown as IOdeServices);
  });

  describe('addCurrentUserRights', () => {
    it('appends the current user rights found in the resource rights', () => {
      const result = service.addCurrentUserRights(
        [otherRight],
        [
          `user:${currentUser.userId}:read`,
          `user:${currentUser.userId}:contrib`,
          'user:user-other:manage',
          'group:group-1:read',
        ],
        currentUser,
      );

      expect(result).toEqual([
        otherRight,
        {
          id: currentUser.userId,
          type: 'user',
          displayName: currentUser.username,
          avatarUrl: '',
          directoryUrl: '',
          actions: [
            { id: 'read', displayName: 'read' },
            { id: 'contrib', displayName: 'contrib' },
          ],
        },
      ]);
    });

    it('ignores resource rights without an action segment', () => {
      const result = service.addCurrentUserRights(
        [otherRight],
        [`user:${currentUser.userId}`],
        currentUser,
      );

      expect(result).toEqual([otherRight]);
    });

    it('returns the rights unchanged when the user has no own rights', () => {
      const result = service.addCurrentUserRights(
        [otherRight],
        ['user:user-other:read'],
        currentUser,
      );

      expect(result).toEqual([otherRight]);
    });

    it('returns the rights unchanged when there is no current user', () => {
      const result = service.addCurrentUserRights(
        [otherRight],
        [`user:${currentUser.userId}:read`],
        undefined,
      );

      expect(result).toEqual([otherRight]);
    });

    it('does not mutate the input array', () => {
      const rights = [otherRight];

      const result = service.addCurrentUserRights(
        rights,
        [`user:${currentUser.userId}:read`],
        currentUser,
      );

      expect(rights).toHaveLength(1);
      expect(result).not.toBe(rights);
    });
  });
});
