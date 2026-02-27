export enum VisibleType {
  User = 'User',
  Group = 'Group',
  ShareBookmark = 'ShareBookmark',
  BroadcastGroup = 'BroadcastGroup',
}

export type Visible = {
  id: string;
  displayName: string;
  type: VisibleType;
  children?: { id: string; displayName: string }[];
  groupType?: string;
  nbUsers?: number;
  profile?: string;
  relatives?: { id: string; displayName: string }[];
  structureName?: string;
  usedIn?: ('TO' | 'CC' | 'CCI')[];
};
