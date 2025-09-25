import { ShareRight, ShareRightWithVisibles } from '@edifice.io/client';

// List of group labels that should be hidden from the share UI
const HIDDEN_GROUP_LABELS = ['CommunityAdminGroup'];

/**
 * Hook to determine if a share right (group) should be visible in the share UI.
 * Groups containing any label from `HIDDEN_GROUP_LABELS` will be hidden.
 *
 * Returns a function `isShareRightVisible(shareRight, shareRights)` that returns
 * true when the share right must be displayed and false when it must be hidden.
 */
export const useShareRightVisible = () => {
  /**
   * Determine whether the given shareRight should be visible based on group labels.
   * Non-group share rights are always visible.
   */
  const isShareRightVisible = (
    shareRight: ShareRight,
    shareRights: ShareRightWithVisibles,
  ): boolean => {
    // Only apply to group type
    if (shareRight.type !== 'group') {
      return true;
    }

    // Find the corresponding group in visibleGroups by id
    const group = shareRights.visibleGroups.find((g) => g.id === shareRight.id);

    // If group not found or labels undefined, be conservative and show it
    if (!group || !group.labels || !Array.isArray(group.labels)) {
      return true;
    }

    // If any label matches the hidden list, hide the group
    if (group.labels.some((label) => HIDDEN_GROUP_LABELS.includes(label))) {
      return false;
    }

    return true;
  };

  return { isShareRightVisible };
};
