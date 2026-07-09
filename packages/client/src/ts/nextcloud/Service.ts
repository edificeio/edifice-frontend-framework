import { IOdeServices } from '../services/OdeServices';
import { WorkspaceElement } from '../workspace/interface';
import { NextcloudDocument, NextcloudDocumentResponse } from './interface';

/**
 * The backend returns each document's `path` as its full Nextcloud webdav path
 * (e.g. `/remote.php/dav/files/{userId}/Documents/`), but the `path` query
 * param of `listDocuments` expects a path relative to the user's root
 * (e.g. `/Documents/`). Strip the webdav/userId prefix so paths are
 * consistent for both directions.
 */
function toRelativePath(path: string, userId: string): string {
  return path.split(userId).pop() ?? path;
}

function toNextcloudDocument(
  raw: NextcloudDocumentResponse,
  userId: string,
): NextcloudDocument {
  return {
    path: toRelativePath(raw.path, userId),
    name: decodeURIComponent(raw.displayname),
    ownerDisplayName: raw.ownerDisplayName,
    contentType: raw.contentType,
    size: raw.size,
    favorite: raw.favorite,
    etag: raw.etag,
    fileId: raw.fileId,
    isFolder: raw.isFolder,
    lastModified: raw.lastModified,
  };
}

export class NextcloudService {
  constructor(private context: IOdeServices) {}
  private get http() {
    return this.context.http();
  }

  /**
   * List a user's Nextcloud documents and folders at a given path.
   * @param userId - the id of the user whose files are listed.
   * @param path - path to list, relative to the user's Nextcloud root; root when omitted.
   */
  async listDocuments(
    userId: string,
    path?: string,
  ): Promise<NextcloudDocument[]> {
    const res = await this.http.get<{ data: NextcloudDocumentResponse[] }>(
      `/nextcloud/files/user/${userId}`,
      { queryParams: path ? { path } : undefined },
    );
    return res.data.map((raw) => toNextcloudDocument(raw, userId));
  }

  /**
   * Copy Nextcloud documents into the entcore workspace.
   * @param userId - the id of the user whose files are copied.
   * @param paths - paths of the documents to copy, relative to the user's Nextcloud root.
   * @param parentId - the workspace folder to copy into; user's root when omitted.
   */
  async copyDocumentToWorkspace(
    userId: string,
    paths: string[],
    parentId?: string,
  ): Promise<WorkspaceElement[]> {
    const res = await this.http.put<{ data: (WorkspaceElement | null)[] }>(
      `/nextcloud/files/user/${userId}/copy/workspace`,
      undefined,
      { queryParams: parentId ? { path: paths, parentId } : { path: paths } },
    );
    return res.data.filter((doc): doc is WorkspaceElement => !!doc?._id);
  }
}
