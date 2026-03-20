import { IUserInfo } from '@edifice.io/client';
import { SharingItem } from 'src/components/UserSearch';
import { ResourceRightName, ResourceRights } from '../types/types';

export const useRights = (resourceRights: ResourceRights) => {
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
      recipientId: user?.userId ?? '',
      recipientType: 'user',
      displayName: user?.firstName + ' ' + user?.lastName,
      permission: Object.keys(resourceRights),
    };
  };

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
            (p) => !excludes.includes(p as ResourceRightName),
          ),
          ...requires,
          rightName,
        ]),
      ];
    } else {
      // Retrait : retirer ce droit + tous les droits qui en dépendent (transitivité)
      const toRemove = new Set<string>([rightName]);
      let changed = true;
      while (changed) {
        changed = false;
        for (const [name, def] of Object.entries(resourceRights)) {
          if (
            !toRemove.has(name) &&
            def.requires.some((r) => toRemove.has(r))
          ) {
            toRemove.add(name);
            changed = true;
          }
        }
      }
      newPermission = item.permission.filter((p) => !toRemove.has(p));
    }

    return {
      ...item,
      permission: newPermission,
    };
  };

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
