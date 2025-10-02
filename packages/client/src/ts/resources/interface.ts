import {
  App,
  ID,
  ILinkedResource,
  ResourceType,
  RightRole,
  RightStringified,
} from '..';

/**
 * @deprecated Used by the internal linker ONLY
 * Old-fashioned way of listing resources => `behaviours.loadResources()`
 */
export interface IBehaviourService {
  /** App providing this service. */
  getApplication(): App | string;
  /** Type of resource this service can manage. */
  getResourceType(): ResourceType;
  /** Load resources. */
  loadResources(parameters: GetContextParameters): Promise<ILinkedResource[]>;
}

/**
 * Resources management service.
 * Resources are assets created or imported in the whole solution (core and non-core apps)
 */
export interface IResourceService {
  /** App providing this service. */
  getApplication(): App | string;
  /** Type of resource this service can manage. */
  getResourceType(): ResourceType;

  //--------------------------------------- ACTIONS
  /** Create a new resource from common parameters. */
  create<T extends CreateParameters>(parameters: T): Promise<CreateResult>;
  /** Update an existing resource from common parameters. */
  update<T extends UpdateParameters>(parameters: T): Promise<UpdateResult>;
  /** Copy a resource from common parameters. */
  copy<T extends CopyParameters>(parameters: T): Promise<CopyResult>;
  /** Publish an resource */
  publish(parameters: PublishParameters): Promise<PublishResult>;
  /** Delete folders and/or resources. */
  deleteAll(
    parameters: DeleteParameters,
    useAssetId?: boolean,
  ): Promise<IActionResult>;
  /** Trash folders and/or resources. */
  trashAll(
    parameters: DeleteParameters,
    useAssetId?: boolean,
  ): Promise<IActionResult>;
  /** Restore folders and/or resources from trash. */
  restoreAll(
    parameters: DeleteParameters,
    useAssetId?: boolean,
  ): Promise<IActionResult>;

  //--------------------------------------- SEARCH
  /** Create a search context and get the first results page. */
  createContext(parameters: GetContextParameters): Promise<GetContextResult>;
  /** Search / paginate within a search context. */
  searchContext(parameters: GetContextParameters): Promise<ISearchResults>;
  /** Search 1 resource by `id` */
  searchResource(parameters: GetResourceParameters): Promise<IResource>;

  //--------------------------------------- FOLDERS MANAGEMENT
  /** Create a new folder. */
  createFolder(parameters: CreateFolderParameters): Promise<CreateFolderResult>;
  /** Update folder. */
  updateFolder(parameters: UpdateFolderParameters): Promise<CreateFolderResult>;
  /** Move resources/folders to a folder. */
  moveToFolder(
    parameters: MoveParameters,
    useAssetId?: boolean,
  ): Promise<IActionResult>;
  /** List subfolders of a parent folder. */
  listSubfolders(folderId: ID): Promise<GetSubFoldersResult>;
}

/** FIXME */
export interface IWebResourceService {
  /** URL where to print a resource. */
  getPrintUrl(resourceId: string): string;
  /** URL where to view a resource. */
  getViewUrl(resourceId: string): string;
  /** URL where to edit a resource. */
  getEditUrl(resourceId: string): string;
  /** URL where to create a new resource. */
  getFormUrl(folderId?: string): string;
}

//---------------------------------------------------------------------
//--------------------------------------- Typings and definitions
//---------------------------------------------------------------------
/** Model of a searchable (indexed) resource. */
export interface IResource {
  application: App | string;
  assetId: ID;
  creatorId: ID;
  creatorName: string;
  comments?: number;
  createdAt: string; // FIXME: S'entendre sur un format de date
  favorite?: boolean;
  folderIds?: ID[]; // TODO à confirmer
  id: ID;
  modifiedAt: string; // FIXME: S'entendre sur un format de date
  modifierId: ID;
  modifierName: string;
  name: string;
  slug?: string;
  public?: boolean;
  shared?: boolean;
  thumbnail: string; // URL : requis; ou bien déductible d’une convention ?
  updatedAt: string;
  views?: number;
  trashed: boolean;
  trashedBy?: ID[];
  rights: RightStringified[];
  description: string;
  allowReplies?: boolean;
}

/**
 * Core actions applicable on resources.
 * Specific actions, which would depend on the running application,
 * MUST BE typed and implemented in this application's agent.
 */
export const ACTION = {
  SEARCH: 'search',
  CREATE: 'create',
  CREATE_PUBLIC: 'createPublic',
  OPEN: 'open',
  EDIT: 'edit',
  MANAGE: 'manage', // Query properties metadata
  UPD_PROPS: 'properties', // Update properties
  COMMENT: 'comment',
  DELETE: 'delete',
  TRASH: 'trash',
  RESTORE: 'restore',
  MOVE: 'move',
  COPY: 'copy',
  EXPORT: 'export',
  SHARE: 'share',
  PRINT: 'print',

  /* FIXME only core actions here ! */
  PAGES_LIST: 'pages_list',
  DISTRIBUTE: 'distribute',
  REGISTER: 'register',
  PUBLISH: 'publish',
  PUBLISH_MOODLE: 'publish_moodle',
} as const;
export type ActionType = (typeof ACTION)[keyof typeof ACTION];

/** Constant folders IDs */
export const FOLDER = {
  /** Special ID of the bin, or trash folder. */
  BIN: 'bin',
  /** Special ID of the root folder. */
  DEFAULT: 'default',
} as const;
export type FolderType = (typeof FOLDER)[keyof typeof FOLDER];

/** Constant search filters IDs, having a boolean type. */
export const BOOLEAN_FILTER = {
  OWNER: 'owner',
  SHARED: 'shared',
  PUBLIC: 'public',
  FAVORITE: 'favorite',
} as const;
export type BooleanFilterType =
  (typeof BOOLEAN_FILTER)[keyof typeof BOOLEAN_FILTER];

// export const STRING_FILTER = {
//   //  FOLDER:     "folder" // is instead an ID
// } as const;
// export type StringFilterType =
//   (typeof STRING_FILTER)[keyof typeof STRING_FILTER];

/** Sort orders. */
export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
} as const;
export type SortOrderType = (typeof SORT_ORDER)[keyof typeof SORT_ORDER];
/** Sortable fields. */
export const SORT_BY = {
  NAME: 'name',
  MODIFY_DATE: 'updatedAt',
  CREATED_AT: 'createdAt',
  APPLICATION: 'application',
  RESOURCE_TYPE: 'resourceType',
  /*
//FIXME On devrait pouvoir trier sur tout champ issu d'un type de ressource (name, createdAt, creatorId...) voir IResource
  createdAt: string;
  creatorId: string;
  authorName: string;
  modifierId: ID;
  modifierName: string;
  modifiedAt: string;
  public?: boolean;
  shared?: boolean;
  favorite?: boolean;
  comments?: number;
*/
} as const;
export type SortByType = (typeof SORT_BY)[keyof typeof SORT_BY];

export type FilterValues = { [B in BooleanFilterType]?: boolean } & {
  folder?: ID;
};
export type OrderValues = { [O in SortByType]?: SortOrderType };

/**
 * Model of actions the user can -or cannot- accomplish.
 */
export interface IAction {
  id: ActionType;
  /** Needed workflow right to accomplish this action. */
  workflow: string;
  /** Thruthy if the user owns the corresponding right. */
  available?: boolean;
  target?: 'actionbar' | 'tree';
  right?: RightRole;
  //FIXME comment relier les actions aux behaviours, qu'on va remplacer.
}

export interface IFolder {
  id: ID;
  parentId: ID;
  name: string;
  type: FolderType | ID;
  childNumber: number;
  trashed: boolean;
  rights: string[];
  ancestors: string[];
}

export interface IFilter {
  id: BooleanFilterType;
  defaultValue?: string | string[] | boolean | boolean[];
  /* values?: StringFilterValue[];  @deprecated : too ahead of actual needs */
}

export interface IOrder {
  id: SortByType;
  defaultValue?: SortOrderType;
  i18n: string;
}

export interface IPagination {
  /** Index of the first available result. */
  startIdx: number;
  /** Number of actual results. */
  pageSize: number; // Sera égal à la valeur paramétrée côté serveur
  /** Index of the last result (number of hits less 1). */
  maxIdx?: number;
}

//---------------------------------------------------------------------
//--------------------------------------- Parameters and results types
//---------------------------------------------------------------------
/** Base  */
export interface IActionParameters {
  application: App | string;
  // TODO : other common parameters should be placed here
}
/**  */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IActionResult {
  // TODO : common results should be placed here
}

//--------------------------------------- CREATE
/** Parameters expected to create a resource */
export interface CreateParameters extends IActionParameters {
  name: string;
  description: string;
  thumbnail: string | Blob | File;
  folder: number | undefined;

  public?: boolean;
  slug?: string;
  commentType?: string;
  publishType?: string;
  allowReplies?: boolean;
  /* app?: string;  @deprecated, replaced by 'application' in IActionParameters */
}
/** Response when creating resource */
export interface CreateResult {
  'entId': string;
  'thumbnail': string | undefined;

  '_id'?: string;
  'title'?: string;
  'description'?: string;
  'visibility'?: string;
  'trashed'?: boolean;
  'publish-type'?: string;
  'comment-type'?: string;
  'created'?: { $date: string };
  'modified'?: { $date: string };
  'author'?: { userId: string; username: string; login: string };
  'shared'?: Array<string>;
}

//--------------------------------------- COPY
/** Parameters expected to copy a resource. */
export interface CopyParameters extends IActionParameters {
  resourceId: ID;
}
/** Response when copying a resource. */
export interface CopyResult extends IActionResult {
  duplicateId: ID;
  message: string;
}

//--------------------------------------- PUBLISH
/** Parameters expected to publish a resource */
export interface PublishParameters extends IActionParameters {
  userId: string | undefined;
  title: string;
  cover: Blob;
  language: string;
  activityType: string[];
  subjectArea: string[];
  age: [string, string];
  description: string;
  keyWords: string;
  licence: string;
  teacherAvatar: Blob;
  resourceId: string;
  resourceEntId: string;
  userStructureName: string;
}
/** Response when publishing a resource */
export interface PublishResult extends IActionResult {
  details: {
    application: string;
    created_at: string;
    description: string;
    front_url: string;
    id: string;
    title: string;
  };
  message: string;
  reason: string;
  success: boolean;
}

//--------------------------------------- SEARCH
export interface IPreferences {
  //-------------------------------------
  view: 'card' | 'list';
}
export interface ISearchParameters {
  /* app: App;  @deprecated, replaced by 'application' in IActionParameters */
  types: ResourceType[];
  filters: FilterValues;
  orders?: OrderValues;
  pagination: IPagination;
  search?: string;
  trashed?: boolean;
  id?: number;
  asset_id?: string[];
}
export interface IResourceParameters {
  id: string;
}

export interface ISearchResults {
  folders: IFolder[];
  pagination: IPagination;
  resources: IResource[];
  searchConfig?: { minLength: number };
}
export interface IContext extends ISearchResults {
  preferences: IPreferences;
}
/** Parameters expected to search for a resource */
export type GetContextParameters = IActionParameters & ISearchParameters;
/** Response when searching for a resource */
export type GetContextResult = IActionResult & IContext;

//--------------------------------------- FOLDERS MANAGEMENT

/** Parameters expected to create a folder */
export interface CreateFolderParameters extends IActionParameters {
  /* app: App;  @deprecated, replaced by 'application' in IActionParameters */
  type?: ResourceType;
  parentId: ID | 'default';
  name: string;
}
/** Response when creating a folder */
export interface CreateFolderResult extends IActionResult, IFolder {
  createdAt: string;
  creator_id?: string;
}

/** Parameters expected to update a folder */
export interface UpdateFolderParameters extends IActionParameters {
  folderId: ID;
  /* app: App;  @deprecated, replaced by 'application' in IActionParameters */
  type: ResourceType;
  parentId: ID | 'default';
  name: string;
}
/** Response when updating a folder */
export interface UpdateFolderResult extends CreateFolderResult {
  updatedAt: string;
  parentId: ID | 'default';
}

/** Parameters expected to move folders and/or resources */
export interface MoveParameters extends IActionParameters {
  folderId: ID;
  resourceIds: ID[];
  folderIds: ID[];
}

/** Response when listing subfolders of a folder */
export interface GetSubFoldersResult extends IActionResult {
  folders: IFolder[];
}

//--------------------------------------- DELETION
/** Parameters expected to delete folders and/or resources */
export interface DeleteParameters extends IActionParameters {
  resourceType: string;
  resourceIds: ID[];
  folderIds: ID[];
}
export interface TrashParameters extends DeleteParameters {
  trash: boolean;
}

/* TODO resources ? */
export type GetResourceParameters = IActionParameters & IResourceParameters;
export type GetResourcesParameters = IActionParameters & ISearchParameters;
export type GetResourcesResult = IActionResult & ISearchResults;

/** Parameters expected to update resource. */
export interface UpdateParameters {
  entId: string;
  trashed: boolean;
  name: string;
  thumbnail: string | Blob | File;
  description: string;
  public: boolean;
  slug: string;
  allowReplies?: boolean;
}
/** Response when updating resource. */
export interface UpdateResult {
  entId: string;
  thumbnail?: string;
}

export interface BlogUpdate extends UpdateParameters {
  'publish-type'?: 'RESTRAINT' | 'IMMEDIATE';
}

export interface BlogResource extends IResource {
  'publish-type': 'RESTRAINT' | 'IMMEDIATE';
}

export interface MindmapUpdate extends UpdateParameters {
  'publish-type'?: 'RESTRAINT' | 'IMMEDIATE';
}

export interface MindmapResource extends IResource {
  'publish-type': 'RESTRAINT' | 'IMMEDIATE';
}

export interface CollaborativewallUpdate extends UpdateParameters {
  'publish-type'?: 'RESTRAINT' | 'IMMEDIATE';
}

export interface CollaborativewallResource extends IResource {
  'publish-type': 'RESTRAINT' | 'IMMEDIATE';
}

export interface HomeworksCreate extends CreateParameters {
  repeats?: any[];
}

export interface HomeworksUpdate extends UpdateParameters {
  repeats?: any[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ScrapbookUpdate extends UpdateParameters {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ScrapbookResource extends IResource {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TimelineGeneratorUpdate extends UpdateParameters {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CollaborativeEditorUpdate extends UpdateParameters {}
