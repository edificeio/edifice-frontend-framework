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

  const toggleRight = (
    item: SharingItem,
    rightName: ResourceRightName,
  ): SharingItem => {
    const { requires, excludes } = resourceRights[rightName];
    const hasRight = item.permission.includes(rightName);
    const addRight = !hasRight;

    let newPermission: string[];

    if (addRight) {
      // Ajout : retirer les excludes, ajouter les requires + le droit sélectionné
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
      // Retrait : seul ce droit est retiré
      newPermission = item.permission.filter((p) => p !== rightName);
    }

    return {
      ...item,
      permission: newPermission,
    };
  };

  return {
    toggleRight,
    createOwnerItem,
    getOwnerItem,
  };
};
