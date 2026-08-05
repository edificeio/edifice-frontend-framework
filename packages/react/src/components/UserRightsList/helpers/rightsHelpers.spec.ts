import { IUserInfo } from '@edifice.io/client';
import { SharingItem } from '../../../types';
import { ResourceRights } from '../types/types';
import { createRightsHelpers } from './rightsHelpers';

// Rights of a typical resource: contributing implies reading, and managing
// implies contributing. A read-only right excludes contributing.
const resourceRights: ResourceRights = {
  read: { priority: 0, default: true, requires: [], excludes: [] },
  comment: { priority: 1, default: false, requires: ['read'], excludes: [] },
  contrib: { priority: 2, default: false, requires: ['read'], excludes: [] },
  manager: {
    priority: 3,
    default: false,
    requires: ['read', 'contrib'],
    excludes: [],
  },
};

const helpers = createRightsHelpers(resourceRights);

function item(permission: string[]): SharingItem {
  return {
    recipientId: 'user-2',
    recipientType: 'user',
    displayName: 'Someone',
    permission,
  };
}

const user = {
  userId: 'user-1',
  username: 'Pascal',
} as unknown as IUserInfo;

describe('createRightsHelpers', () => {
  describe('applyRight', () => {
    it('adds a right along with the rights it requires', () => {
      const result = helpers.applyRight(item(['read']), 'manager', true);

      expect(result.permission).toEqual(
        expect.arrayContaining(['read', 'contrib', 'manager']),
      );
    });

    it('does not duplicate a right already granted', () => {
      const result = helpers.applyRight(item(['read']), 'read', true);

      expect(result.permission).toEqual(['read']);
    });

    it('drops the rights excluded by the one being added', () => {
      const exclusive = createRightsHelpers({
        read: { priority: 0, default: true, requires: [], excludes: [] },
        contrib: {
          priority: 1,
          default: false,
          requires: ['read'],
          excludes: [],
        },
        publish: {
          priority: 2,
          default: false,
          requires: ['read'],
          excludes: ['contrib'],
        },
      });

      const result = exclusive.applyRight(
        item(['read', 'contrib']),
        'publish',
        true,
      );

      expect(result.permission).not.toContain('contrib');
      expect(result.permission).toEqual(
        expect.arrayContaining(['read', 'publish']),
      );
    });

    it('removes a right and everything depending on it, transitively', () => {
      const result = helpers.applyRight(
        item(['read', 'contrib', 'manager', 'comment']),
        'read',
        false,
      );

      expect(result.permission).toEqual([]);
    });

    it('removes only the dependents of the right being taken away', () => {
      const result = helpers.applyRight(
        item(['read', 'contrib', 'manager', 'comment']),
        'contrib',
        false,
      );

      expect(result.permission).toEqual(['read', 'comment']);
    });

    it('is a no-op when removing a right the item does not hold', () => {
      const result = helpers.applyRight(item(['read']), 'manager', false);

      expect(result.permission).toEqual(['read']);
    });

    it('keeps the rest of the item untouched', () => {
      const result = helpers.applyRight(item(['read']), 'comment', true);

      expect(result).toMatchObject({
        recipientId: 'user-2',
        recipientType: 'user',
        displayName: 'Someone',
      });
    });
  });

  describe('toggleRight', () => {
    it('grants a right the item does not hold', () => {
      const result = helpers.toggleRight(item(['read']), 'contrib');

      expect(result.permission).toContain('contrib');
    });

    it('revokes a right the item already holds', () => {
      const result = helpers.toggleRight(item(['read', 'contrib']), 'contrib');

      expect(result.permission).not.toContain('contrib');
    });

    it('revokes the dependents along the way', () => {
      const result = helpers.toggleRight(
        item(['read', 'contrib', 'manager']),
        'contrib',
      );

      expect(result.permission).toEqual(['read']);
    });
  });

  describe('createOwnerItem', () => {
    it('grants every right of the resource to the owner', () => {
      const result = helpers.createOwnerItem(user);

      expect(result).toEqual({
        recipientId: 'user-1',
        recipientType: 'user',
        displayName: 'Pascal',
        permission: ['read', 'comment', 'contrib', 'manager'],
      });
    });

    it('tolerates a user without an id', () => {
      const result = helpers.createOwnerItem({
        username: 'Anonyme',
      } as unknown as IUserInfo);

      expect(result.recipientId).toBe('');
    });
  });

  describe('getOwnerItem', () => {
    it('names the session user as owner while creating a resource', () => {
      const result = helpers.getOwnerItem('', user, true);

      expect(result.displayName).toBe('Pascal');
      expect(result.recipientId).toBe('user-1');
    });

    it('names the session user as owner of their own resource', () => {
      const result = helpers.getOwnerItem('user-1', user, false);

      expect(result.displayName).toBe('Pascal');
    });

    it('falls back to a generic owner for someone else resource', () => {
      const result = helpers.getOwnerItem('user-9', user, false);

      expect(result).toEqual({
        recipientId: 'user-9',
        recipientType: 'user',
        displayName: 'owner',
        permission: ['read', 'comment', 'contrib', 'manager'],
      });
    });

    it('throws when neither an owner nor a creating user is known', () => {
      expect(() => helpers.getOwnerItem('', undefined, true)).toThrow(
        'Owner ID or user is required',
      );
    });

    it('throws when the resource has no owner and is not being created', () => {
      expect(() => helpers.getOwnerItem('', user, false)).toThrow(
        'Owner ID or user is required',
      );
    });
  });
});
