/** Mime type identifying a folder in Google Drive. */
export const GOOGLE_DRIVE_FOLDER_MIME_TYPE =
  'application/vnd.google-apps.folder';

/** A user's Google Drive document or folder, as consumed by the frontend. */
export interface GoogleDriveDocument {
  /** Drive file id. Used as a unique id, and as the parent id when browsing. */
  id: string;
  name: string;
  ownerDisplayName?: string;
  contentType?: string;
  size?: number;
  isFolder: boolean;
  lastModified?: string;
  shared?: boolean;
}

/** Raw DTO returned by the `/googledrive/files/user/:userId` endpoint. */
export interface GoogleDriveDocumentResponse {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
  modifiedTime?: string;
  shared?: boolean;
  ownerDisplayName?: string;
}

/**
 * Per-document outcome returned by the copy-to-workspace endpoint. Unlike the
 * Nextcloud equivalent, which returns a flat array of workspace documents, each
 * entry here wraps the created document under `workspace` and carries its own
 * status, so a copy can partially fail.
 */
export interface GoogleDriveCopyResult<TWorkspaceElement> {
  id: string;
  status?: 'ok' | 'error';
  message?: string;
  workspace?: TWorkspaceElement | null;
}

/** A single document the backend failed to copy into the workspace. */
export interface GoogleDriveCopyFailure {
  id: string;
  message?: string;
}
