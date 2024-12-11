import { ShareRight } from '@edifice.io/client';

export const showShareRightLine = (
  shareRight: ShareRight,
  showBookmarkMembers: boolean,
): boolean =>
  (shareRight.isBookmarkMember && showBookmarkMembers) ||
  !shareRight.isBookmarkMember;
