export interface Comment {
  _id: string;
}
export interface WorkspaceElement {
  _id?: string;
  eType: 'folder' | 'file' | string;
  eParent: string;
  name: string;
  title?: string;
  file?: string;
  deleted?: boolean;
  children: WorkspaceElement[];
  created: Date;
  trasher?: string;
  externalId?: string;
  //shared
  _shared: any[];
  inheritedShares?: any[];
  isShared: boolean;
  showComments?: boolean;
  editing?: boolean;
  //comments
  comments?: Comment[];
  comment?: string;
  ownerName?: string;
  owner: string;
  //upload
  uploadStatus?: 'loading' | 'loaded' | 'failed' | 'abort';
  uploadXhr?: XMLHttpRequest;
  hiddenBlob?: Blob;
  metadata?: {
    'content-type'?: string;
    'role'?: string;
    'extension'?: string;
    'filename'?: string;
    'size'?: number;
    'captation'?: boolean;
    'duration'?: number;
    'width'?: number;
    'height'?: number;
  };
  link?: string;
  icon?: string;
  version?: number;
  currentQuality?: number;
  application?: string;
  legend?: string;
  alt?: string;
  //visibility
  protected?: boolean;
  public?: boolean;
  /**
   * Get multimedia thumbnails
   * */
  thumbnails?: { [thumbSize: string]: string };
}

/** Supported view preferences */
export type WorkspacePreferenceView = 'list' | 'icons' | 'carousel';
export type WorkspaceVisibility = 'public' | 'protected';

/** Workspace preferences */
export interface WorkspacePreference {
  sortField?: string;
  sortDesc?: boolean;
  view?: WorkspacePreferenceView;
  bbmView?: WorkspacePreferenceView;
  quickstart?: 'viewed' | 'notviewed';
}

/** Supported search filters */
export type WorkspaceSearchFilter =
  | 'owner'
  | 'shared'
  | 'protected'
  | 'public'
  | 'trash'
  | 'all'
  | 'external';
