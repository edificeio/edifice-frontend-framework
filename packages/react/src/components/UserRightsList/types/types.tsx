/**
 * Resource Rights
 * Liste des rights pour une resource
 */

import type { SharingItem } from '../../../types';
export type { SearchResultType, SharingItem } from '../../../types';

export type ResourceRightName =
  | 'read'
  | 'contrib'
  | 'publish'
  | 'manager'
  | 'comment';

export type ResourceRightDefinition = {
  priority: number;
  default: boolean;
  requires: ResourceRightName[];
  excludes: ResourceRightName[];
};

export type ResourceRights = Record<ResourceRightName, ResourceRightDefinition>;

export interface BookmarkUser {
  id: string;
  displayName: string;
  profile?: string;
  activationCode?: boolean;
}

export interface BookmarkInput {
  id: string;
  name: string;
  notVisibleCount?: number;
  groups?: { id: string; displayName: string }[];
  users: BookmarkUser[];
}

export interface BookmarkState {
  id: string;
  name: string;
  permission: string[];
  userIds: string[];
  isExpanded: boolean;
}

export function isBookmarkInput(
  item: SharingItem | BookmarkInput,
): item is BookmarkInput {
  return 'users' in item && Array.isArray((item as BookmarkInput).users);
}
