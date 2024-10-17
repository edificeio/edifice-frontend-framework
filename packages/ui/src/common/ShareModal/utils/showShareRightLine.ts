import { ShareRight } from '@edifice.io/ts-client';

export const showShareRightLine = (
  shareRight: ShareRight,
  showBookmarkMembers: boolean,
): boolean =>
  (shareRight.isBookmarkMember && showBookmarkMembers) ||
  !shareRight.isBookmarkMember;
