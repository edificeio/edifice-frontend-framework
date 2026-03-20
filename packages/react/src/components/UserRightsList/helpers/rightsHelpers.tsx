/**
 * Pure utility functions for permission manipulation.
 * Handles right toggle with requires/excludes logic and transitive removal.
 */
import { IUserInfo } from '@edifice.io/client';
import { SharingItem } from '../../../types';
import { ResourceRightName, ResourceRights } from '../types/types';

export const createRightsHelpers = (resourceRights: ResourceRights) => {
  /** Builds a SharingItem representing the resource owner with all rights. */
  const getOwnerItem = (
    ownerId: string,
    user: IUserInfo | undefined,
    isCreating: boolean,
  ): SharingItem => {
    if ((!ownerId && user && isCreating) || (user && ownerId === user.userId)) {
      return createOwnerItem(user);
    }

    if (!ownerId) {
      throw new Error('Owner ID or user is required');
    }

    return {
      recipientId: ownerId,
      recipientType: 'user',
      displayName: 'owner',
      permission: Object.keys(resourceRights),
    };
  };

  const createOwnerItem = (user: IUserInfo): SharingItem => {
    return {
      recipientId: user.userId ?? '',
      recipientType: 'user',
      displayName: user.firstName + ' ' + user.lastName,
      permission: Object.keys(resourceRights),
    };
  };

  /**
   * Sets a right on or off for an item.
   * When adding: includes required rights and removes excluded ones.
   * When removing: transitively removes all rights that depend on the removed one.
   */
  const applyRight = (
    item: SharingItem,
    rightName: ResourceRightName,
    add: boolean,
  ): SharingItem => {
    const { requires, excludes } = resourceRights[rightName];

    let newPermission: string[];

    if (add) {
      newPermission = [
        ...new Set([
          ...item.permission.filter(
            (perm) => !excludes.includes(perm as ResourceRightName),
          ),
          ...requires,
          rightName,
        ]),
      ];
    } else {
      // Collect this right + all rights that transitively depend on it
      const toRemove = new Set<string>([rightName]);
      let changed = true;
      while (changed) {
        changed = false;
        for (const [name, definition] of Object.entries(resourceRights)) {
          if (
            !toRemove.has(name) &&
            definition.requires.some((required) => toRemove.has(required))
          ) {
            toRemove.add(name);
            changed = true;
          }
        }
      }
      newPermission = item.permission.filter((perm) => !toRemove.has(perm));
    }

    return {
      ...item,
      permission: newPermission,
    };
  };

  /** Toggles a right: adds it if absent, removes it (with dependents) if present. */
  const toggleRight = (
    item: SharingItem,
    rightName: ResourceRightName,
  ): SharingItem => {
    const hasRight = item.permission.includes(rightName);
    return applyRight(item, rightName, !hasRight);
  };

  return {
    applyRight,
    toggleRight,
    createOwnerItem,
    getOwnerItem,
  };
};
