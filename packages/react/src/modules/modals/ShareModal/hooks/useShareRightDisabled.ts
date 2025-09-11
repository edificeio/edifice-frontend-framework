import { ShareRight, ShareRightWithVisibles } from '@edifice.io/client';

// List of group labels for which rights should be disabled
const DISABLED_GROUP_LABELS = ['CommunityMemberGroup', 'CommunityAdminGroup'];

/**
 * Hook to determine if a share right should be disabled
 * @returns function to check if a specific share right should be disabled
 */
export const useShareRightDisabled = () => {
  /**
   * Checks if a share right should be disabled based on group labels
   * Community groups (CommunityMemberGroup, CommunityAdminGroup) have their rights disabled
   */
  const isShareRightDisabled = (
    shareRight: ShareRight,
    shareRights: ShareRightWithVisibles,
  ): boolean => {
    // Only apply to group type
    if (shareRight.type !== 'group') {
      return false;
    }

    // Find the corresponding group in visibleGroups by id
    const group = shareRights.visibleGroups.find((g) => g.id === shareRight.id);

    // If group not found or labels undefined, enable the right
    if (!group || !group.labels || !Array.isArray(group.labels)) {
      return false;
    }

    // Check if the group has any of the disabled labels
    if (group.labels.some((label) => DISABLED_GROUP_LABELS.includes(label))) {
      return true;
    }

    return false;
  };

  return { isShareRightDisabled };
};
