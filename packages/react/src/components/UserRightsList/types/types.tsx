/**
 * Resource Rights
 * Liste des rights pour une resource
 */

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

export interface SharingItem {
  recipientId: string;
  recipientType: SearchResultType;
  permission: string[];
  displayName: string;
}

export type SearchResultType = 'user' | 'group' | 'bookmark';
