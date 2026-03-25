export type AvatarType = 'user' | 'group';
export type SearchResultType = AvatarType | 'bookmark';

export interface SharingItem {
  recipientId: string;
  recipientType: SearchResultType;
  permission: string[];
  displayName: string;
}
