import { IOdeServices } from '../services/OdeServices';
import { WorkspaceElement, WorkspaceVisibility } from '../workspace/interface';
import {
  GOOGLE_DRIVE_FOLDER_MIME_TYPE,
  GoogleDriveCopyFailure,
  GoogleDriveCopyResult,
  GoogleDriveDocument,
  GoogleDriveDocumentResponse,
} from './interface';

function toGoogleDriveDocument(
  raw: GoogleDriveDocumentResponse,
): GoogleDriveDocument {
  return {
    id: raw.id,
    name: raw.name,
    ownerDisplayName: raw.ownerDisplayName,
    contentType: raw.mimeType,
    size: raw.size,
    isFolder: raw.mimeType === GOOGLE_DRIVE_FOLDER_MIME_TYPE,
    lastModified: raw.modifiedTime,
    shared: raw.shared,
  };
}

/**
 * Raised when the backend failed to copy at least one document into the
 * workspace. Carries the documents that were copied anyway, so a caller can
 * still use them instead of discarding the whole selection.
 */
export class GoogleDriveCopyError extends Error {
  constructor(
    message: string,
    readonly copied: WorkspaceElement[],
    readonly failures: GoogleDriveCopyFailure[],
  ) {
    super(message);
    this.name = 'GoogleDriveCopyError';
  }
}

export class GoogleDriveService {
  constructor(private context: IOdeServices) {}
  private get http() {
    return this.context.http();
  }

  /**
   * List a user's Google Drive documents and folders inside a given folder.
   *
   * Google Drive addresses its entries by opaque id, not by path: `parentId` is
   * the id of the folder to list. The query param is nonetheless named `path`,
   * as the backend kept the name it uses for Nextcloud.
   *
   * @param userId - the id of the user whose files are listed.
   * @param parentId - id of the folder to list; the Drive root when omitted.
   */
  async listDocuments(
    userId: string,
    parentId?: string,
  ): Promise<GoogleDriveDocument[]> {
    const res = await this.http.get<{ data: GoogleDriveDocumentResponse[] }>(
      `/googledrive/files/user/${userId}`,
      { queryParams: parentId ? { path: parentId } : undefined },
    );
    return res.data.map(toGoogleDriveDocument);
  }

  /**
   * Copy Google Drive documents into the entcore workspace.
   *
   * @param userId - the id of the user whose files are copied.
   * @param ids - Drive ids of the documents to copy.
   * @param parentId - the workspace folder to copy into; user's root when omitted.
   * @param params.application - the application the documents are added from.
   * @param params.visibility - "protected" files the documents under the
   * documents added from applications, the way an upload does.
   * @throws GoogleDriveCopyError when the backend reports at least one failure.
   */
  async copyDocumentToWorkspace(
    userId: string,
    ids: string[],
    parentId?: string,
    params?: {
      application?: string;
      visibility?: WorkspaceVisibility;
    },
  ): Promise<WorkspaceElement[]> {
    // Build the `id` query param manually: the backend reads repeated bare
    // `id=` keys (request.params().getAll("id")), but axios's default array
    // serialization would send `id[]=` instead, which the backend doesn't
    // recognize and rejects with a 400.
    const idQuery = ids.map((id) => `id=${encodeURIComponent(id)}`).join('&');
    const res = await this.http.put<{
      data: GoogleDriveCopyResult<WorkspaceElement>[];
    }>(
      `/googledrive/files/user/${userId}/copy/workspace?${idQuery}`,
      undefined,
      {
        queryParams: {
          ...(parentId ? { parentId } : {}),
          ...(params?.application ? { application: params.application } : {}),
          ...(params?.visibility === 'protected' ? { protected: true } : {}),
        },
      },
    );

    const results = res.data ?? [];
    const copied = results
      .map((result) => result.workspace)
      .filter((doc): doc is WorkspaceElement => !!doc?._id);

    // The legacy implementation silently dropped the entries it could not
    // copy. Report them instead, so callers can tell the user which documents
    // were left behind. An id missing from the response counts as a failure
    // too, since the backend answers one entry per requested id.
    const answered = new Set(results.map((result) => result.id));
    const failures: GoogleDriveCopyFailure[] = [
      ...results
        .filter((result) => result.status === 'error' || !result.workspace?._id)
        .map(({ id, message }) => ({ id, message })),
      ...ids
        .filter((id) => !answered.has(id))
        .map((id) => ({ id, message: undefined })),
    ];

    if (failures.length > 0) {
      throw new GoogleDriveCopyError(
        `Failed to copy ${failures.length} of ${ids.length} Google Drive document(s) to the workspace`,
        copied,
        failures,
      );
    }
    return copied;
  }

  /**
   * Build the URL to download/preview a Google Drive document.
   * There is no dedicated thumbnail endpoint on the backend, so this is also
   * used as an image preview source for image documents.
   * @param userId - the id of the user who owns the file.
   * @param doc - the document to build the URL for.
   */
  getFileUrl(userId: string, doc: GoogleDriveDocument): string {
    return `/googledrive/files/user/${userId}/file/${encodeURIComponent(
      doc.id,
    )}/download?isFolder=${doc.isFolder}`;
  }
}
