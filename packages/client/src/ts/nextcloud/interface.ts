/** A user's Nextcloud document or folder, as consumed by the frontend. */
export interface NextcloudDocument {
  /** Path of this entry, relative to the user's Nextcloud root. Used as a unique id. */
  path: string;
  name: string;
  ownerDisplayName?: string;
  contentType?: string;
  size?: number;
  favorite?: boolean;
  etag?: string;
  fileId?: string;
  isFolder: boolean;
  lastModified?: string;
}

/** Raw DTO returned by the `/nextcloud/files/user/:userId` endpoint. */
export interface NextcloudDocumentResponse {
  path: string;
  displayname: string;
  ownerDisplayName?: string;
  contentType?: string;
  size?: number;
  favorite?: boolean;
  etag?: string;
  fileId?: string;
  isFolder: boolean;
  lastModified?: string;
}
