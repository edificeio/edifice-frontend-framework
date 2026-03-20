export type SearchResultType = 'user' | 'group' | 'bookmark';

export interface SharingItem {
  recipientId: string;
  recipientType: SearchResultType;
  permission: string[];
  displayName: string;
}
