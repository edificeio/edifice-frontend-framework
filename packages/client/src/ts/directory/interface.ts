/**
 * Selected User when using directory routes
 */
export interface User {
  id: string;
  displayName: string;
  profile: string;
  lastName: string;
  firstName: string;
  login: string;
}

export interface Group {
  id: string;
  displayName: string;
  labels?: string[];
  nbUsers?: number;
}

/**
 * Id and Name of Bookmark
 */
export interface Bookmark {
  id: string;
  displayName: string;
  notVisibleCount: number;
}

export interface BookmarkWithMembers extends Bookmark {
  members: string[];
}

export interface BookmarkWithDetails extends Bookmark {
  users: User[];
  groups: Group[];
}

export interface BookmarkSaveResponse {
  id: string;
}

/**
 * Payload when getting bookamark info
 */
export interface BookmarkGetResponse {
  id: string;
  name: string;
  notVisibleCount: number;
  groups: Array<{
    id: string;
    name: string;
    activationCode: boolean;
    groupType: string;
    profile: string;
    sortName: string;
    nbUsers?: number;
  }>;
  users: Array<{
    displayName: string;
    profile: string;
    id: string;
    activationCode: boolean;
  }>;
}
