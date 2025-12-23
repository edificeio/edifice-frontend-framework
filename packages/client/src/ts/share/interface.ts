import { Bookmark, Group, User } from '../directory/interface';

/**
 * Represents a share right for a user, group, or bookmark with associated permissions and metadata.
 *
 * @interface ShareRight
 * @property {string} id - Unique identifier for the share right
 * @property {ShareRightType} type - Type of entity being shared with (user, group, or sharebookmark)
 * @property {string} displayName - Human-readable name for display purposes
 * @property {string} [profile] - User profile information (only applicable when type is 'user')
 * @property {string} avatarUrl - URL to the entity's avatar image
 * @property {string} directoryUrl - URL to the entity's directory page
 * @property {ShareRightAction[]} actions - Array of available actions/permissions for this share right
 * @property {boolean} [isBookmarkMember] - Indicates if the entity is a member of a bookmark
 * @property {User[]} [users] - Array of users associated with a bookmark (when type is 'sharebookmark')
 * @property {Group[]} [groups] - Array of groups associated with a bookmark (when type is 'sharebookmark')
 */
export interface ShareRight {
  id: string;
  type: ShareRightType;
  displayName: string;
  profile?: string; // if type is user
  avatarUrl: string;
  directoryUrl: string;
  actions: ShareRightAction[];
  isBookmarkMember?: boolean;
  users?: User[]; // bookmark users
  groups?: Group[]; // bookmark groups
}

//--------------------------------------- SHARE

/**
 * Parameters for sharing operations containing resource ID and associated rights.
 *
 * @interface ShareParameters
 * @property {string} id - Unique identifier of the resource being shared
 * @property {ShareRight[]} rights - Array of share rights defining who has access and what permissions they have
 */
export interface ShareParameters {
  id: string;
  rights: ShareRight[];
}

/**
 * Type of share right
 * */
export type ShareRightType = 'user' | 'group' | 'sharebookmark';

/**
 * Represents an action that can be performed on a shared resource.
 *
 * @interface ShareRightAction
 * @property {ShareRightActionDisplayName} id - Unique identifier for the action
 * @property {ShareRightActionDisplayName} displayName - Display name for the action
 * @property {number} [priority] - Priority level of the action (higher values indicate higher priority)
 * @property {ShareRightActionDisplayName[]} [requires] - Array of action names that are required as prerequisites for this action
 */
export interface ShareRightAction {
  id: ShareRightActionDisplayName;
  displayName: ShareRightActionDisplayName;
  priority?: number;
  requires?: ShareRightActionDisplayName[];
}

/**
 * Name of current action when sharing
 * */
export type ShareRightActionDisplayName =
  | 'read'
  | 'contrib'
  | 'manage'
  | 'publish'
  | 'manager'
  | 'comment';

export type ShareRightActionDisplayNameExt =
  | ShareRightActionDisplayName
  | 'creator';

/**
 * Configuration object defining sharing rights with their properties including priority, default status, and dependencies.
 *
 * @type {SharingRight}
 * @description Record mapping each ShareRightActionDisplayName to an object containing:
 * - priority: Numeric priority level
 * - default: Whether this right is selected by default
 * - requires: Array of prerequisite action names
 */
export type SharingRight = Record<
  ShareRightActionDisplayName,
  {
    priority: number;
    default: boolean;
    requires: ShareRightActionDisplayName[];
  }
>;

/**
 * Mapping of share right actions to their corresponding backend permission strings.
 *
 * @type {ShareMapping}
 * @description Record mapping each ShareRightActionDisplayName to an array of backend permission strings
 */
export type ShareMapping = Record<ShareRightActionDisplayName, string[]>;

/**
 * Payload structure returned when fetching resource rights information.
 *
 * @interface GetResourceRightPayload
 * @property {Array} actions - Available actions with their metadata including name arrays, display names, and type
 * @property {Object} groups - Group information including visible groups and their checked permissions
 * @property {Object} users - User information including visible users and their checked permissions
 */
export interface GetResourceRightPayload {
  actions: Array<{
    name: string[];
    displayName: string; //'app.right'
    type: 'RESOURCE';
  }>;
  groups: {
    visibles: Array<{
      id: string;
      name: string;
      groupDisplayName: string;
      structureName: string;
      labels?: string[];
    }>;
    checked: Record<string, string[]>;
  };
  users: {
    visibles: Array<{
      id: string;
      login: string;
      username: string;
      lastName: string;
      firstName: string;
      profile: string;
    }>;
    checked: Record<string, string[]>;
  };
}

/**
 * Payload structure for updating shared resource permissions.
 *
 * @interface PutSharePayload
 * @property {Record<string, string[]>} users - Mapping of user IDs to their assigned permission arrays
 * @property {Record<string, string[]>} groups - Mapping of group IDs to their assigned permission arrays
 * @property {Record<string, string[]>} bookmarks - Mapping of bookmark IDs to their assigned permission arrays
 */
export interface PutSharePayload {
  users: Record<string, string[]>;
  groups: Record<string, string[]>;
  bookmarks: Record<string, string[]>;
}

/**
 * Response structure returned after updating shared resource permissions.
 *
 * @interface PutShareResponse
 * @property {Array} notify-timeline-array - Array of notification objects containing either groupId or userId for timeline notifications
 */
export interface PutShareResponse {
  'notify-timeline-array': Array<{ groupId: string } | { userId: string }>;
}

/**
 * Represents a subject (user, group, or bookmark) that can be involved in sharing operations.
 *
 * @interface ShareSubject
 * @property {string} id - Unique identifier
 * @property {string} displayName - Human-readable display name
 * @property {string} [profile] - Profile information (applicable for users)
 * @property {string} avatarUrl - URL to avatar image
 * @property {string} directoryUrl - URL to directory page
 * @property {'user' | 'group' | 'sharebookmark'} type - Type of subject
 * @property {string} [structureName] - Name of the organizational structure (applicable for groups)
 */
export interface ShareSubject {
  id: string;
  displayName: string;
  profile?: string;
  avatarUrl: string;
  directoryUrl: string;
  type: 'user' | 'group' | 'sharebookmark';
  structureName?: string;
}

/**
 * Extended structure containing share rights along with all visible entities that can be shared with.
 *
 * @interface ShareRightWithVisibles
 * @property {ShareRight[]} rights - Current share rights configuration
 * @property {User[]} visibleUsers - Array of users available for sharing
 * @property {Group[]} visibleGroups - Array of groups available for sharing
 * @property {Bookmark[]} visibleBookmarks - Array of bookmarks available for sharing
 */
export interface ShareRightWithVisibles {
  rights: ShareRight[];
  visibleUsers: User[];
  visibleGroups: Group[];
  visibleBookmarks: Bookmark[];
}

/**
 * Configuration object containing URLs for various sharing-related API endpoints.
 *
 * @type {ShareUrls}
 * @property {string} [getResourceRights] - Optional URL endpoint for fetching resource rights
 * @property {string} [saveResourceRights] - Optional URL endpoint for saving/updating resource rights
 * @property {string} [getShareMapping] - Optional URL endpoint for retrieving share action mappings
 *
 * @example Example related to sharing thread resources:
 * ```ts
 * const shareUrls: ShareUrls = {
 *     getResourceRights: '/api/V1/thread/shares', (get endpoint)
 *     saveResourceRights: '/api/V1/thread/shares', (put endpoint)
 *     getShareMapping: '/api/V1/rights/sharing'
 *   }
 * };
 * ```
 *
 * @example Example related to sharing info resources:
 * ```ts
 * const shareUrls: ShareUrls = {
 *     getResourceRights: '/api/V1/info/shares', (get endpoint)
 *     saveResourceRights: '/api/V1/info/shares', (put endpoint)
 *     getShareMapping: '/api/V1/rights/sharing'
 *   }
 * };
 * ```
 */
export type ShareUrls = {
  getResourceRights?: string;
  saveResourceRights?: string;
  getShareMapping?: string;
};
