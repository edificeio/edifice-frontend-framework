/**
 * Thumbnail size requested for the avatar displayed in the headers
 * (rendered at 24px or 36px, 48px keeps it sharp on most screens).
 */
export const HEADER_AVATAR_THUMBNAIL = '48x48';

/**
 * Append the `thumbnail` query parameter to the user's avatar URL so the
 * backend serves a resized picture instead of the original one.
 * The default "no avatar" visual and URLs that already request a thumbnail
 * are returned unchanged.
 */
export function getHeaderAvatarUrl(avatar: string): string {
  if (!avatar || avatar.includes('no-avatar') || /[?&]thumbnail=/.test(avatar))
    return avatar;

  const separator = avatar.includes('?') ? '&' : '?';
  return `${avatar}${separator}thumbnail=${HEADER_AVATAR_THUMBNAIL}`;
}
