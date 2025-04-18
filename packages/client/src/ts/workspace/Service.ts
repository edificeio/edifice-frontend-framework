import { ID } from '../globals';
import { IOdeServices } from '../services/OdeServices';
import { DocumentHelper } from '../utilities/DocumentHelper';
import {
  WorkspaceElement,
  WorkspaceSearchFilter,
  WorkspaceVisibility,
} from './interface';

interface ElementQuery {
  /**
   * Keep only results having this criteria.
   * Defaults to "owner" in backend but must be specified here for clarity.
   */
  filter: WorkspaceSearchFilter;
  /** Restrict results to this element id only (kind of get). */
  id?: ID;
  /** Restrict results to element having this direct parent (folder). */
  parentId?: ID;
  /** Restrict results to elements having this ancestor (folder) at any level. */
  ancestorId?: string;
  /** Restrict results to the 1st folder hierarchy level. */
  onlyRoot?: boolean;
  /** Restrict results to this app. */
  application?: string;
  /** Restrict results to elements containing this text. */
  search?: string;
  /** Extend results to files AND folders. Defaults to false, with file results only. */
  includeall?: boolean;
  /** Max number of results needed. */
  limit?: number;
  /**
   * Skip the first N results.
   * Allows for pagination when used with the `limit` parameter.
   */
  skip?: number;
  /**
   * Restrict results to elements directly shared with the user.
   * => Handle this param through a dedicated method. Do not expose it directly.
   */
  directShared?: boolean;
  /**
   * Truthy when result is a tree ?
   * => Handle this param through a dedicated method. Do not expose it directly.
   */
  hierarchical?: boolean;
}

export class WorkspaceService {
  constructor(private context: IOdeServices) {}
  private get http() {
    return this.context.http();
  }

  private extractMetadata(file: Blob | File) {
    const tmpName = (file as File).name || '';
    const nameSplit = tmpName.split('.');
    const contentType = file.type || 'application/octet-stream';
    const extension =
      nameSplit.length > 1 ? nameSplit[nameSplit.length - 1] : '';
    const metadata = {
      'content-type': contentType,
      'filename': tmpName,
      'size': file.size,
      extension,
      'role': DocumentHelper.role(contentType, false, extension),
    };
    const basename = tmpName.replace('.' + metadata.extension, '');
    const fullname = metadata.extension
      ? basename + '.' + metadata.extension
      : basename;
    return { basename, fullname, metadata };
  }

  async saveFile(
    file: Blob | File,
    params?: {
      parentId?: string;
      visibility?: WorkspaceVisibility;
      application?: string;
    },
  ) {
    //prepare metadata
    const { fullname, metadata } = this.extractMetadata(file);
    //prepare form data
    const formData = new FormData();
    formData.append('file', file, fullname);
    //add query params
    const args = [];
    if (params?.visibility === 'public' || params?.visibility === 'protected') {
      args.push(`${params.visibility}=true`);
    }
    if (params?.application) {
      args.push(`application=${params.application}`);
    }
    if (metadata.role === 'img') {
      args.push(`quality=1`);
    }
    if (params?.parentId) {
      args.push(`parentId=${params.parentId}`);
    }
    //make query
    const res = await this.http.postFile<WorkspaceElement>(
      `/workspace/document?${args.join('&')}`,
      formData,
    );
    if (this.http.isResponseError()) {
      throw this.http.latestResponse.statusText;
    }
    return res;
  }

  async updateFile(
    id: string,
    file: Blob | File,
    params?: {
      alt?: string;
      legend?: string;
      name?: string;
    },
  ) {
    //prepare metadata
    const { fullname, metadata } = this.extractMetadata(file);
    //prepare form data
    const formData = new FormData();
    formData.append('file', file, fullname);
    //add query params
    const args = [];
    if (metadata.role === 'img') {
      args.push(`quality=1`);
    }
    if (params?.alt) {
      args.push(`alt=${params.alt}`);
    }
    if (params?.legend) {
      args.push(`legend=${params.legend}`);
    }
    if (params?.name) {
      args.push(`name=${params.name}`);
    }
    //make query
    const res = await this.http.putFile<WorkspaceElement>(
      `/workspace/document/${id}?${args.join('&')}`,
      formData,
    );
    if (this.http.isResponseError()) {
      throw this.http.latestResponse.statusText;
    }
    return res;
  }

  async deleteFile(elements: WorkspaceElement[]) {
    const ids = elements.map((element) => element._id);
    if (ids.length == 0) {
      Promise.resolve(null) as any;
    } else {
      await this.http.deleteJson<WorkspaceElement>(`/workspace/documents`, {
        ids,
      });
      if (this.http.isResponseError()) {
        throw this.http.latestResponse.statusText;
      }
    }
  }

  private async acceptDocuments(params: ElementQuery) {
    const userInfo = await this.context.session().getUser();
    return (current: WorkspaceElement) => {
      //filter by trasherid
      if (current.deleted && current.trasher) {
        return userInfo?.userId == current.trasher;
      }
      //in case of directShared document => hide doc that are visible inside a folder
      //FIXME no more cache, how to do this ?
      // if(params.directShared && current.eParent){
      //   const isParentVisible = workspaceService._cacheFolders.find(folder => folder._id == current.eParent);
      //   if(isParentVisible){
      //       return false;
      //   }
      // }
      return true;
    };
  }

  async searchDocuments(params: ElementQuery): Promise<WorkspaceElement[]> {
    const filesO: WorkspaceElement[] =
      params.filter !== 'external' || params.parentId
        ? await this.http.get<WorkspaceElement[]>('/workspace/documents', {
            queryParams: { ...params, _: new Date().getTime() },
          })
        : [];
    const filterFn = await this.acceptDocuments(params);
    return filesO.filter(filterFn);
  }

  async listDocuments(
    filter: WorkspaceSearchFilter,
    parentId?: ID,
  ): Promise<WorkspaceElement[]> {
    return this.searchDocuments({ filter, parentId, includeall: true });
  }

  /**
   * Duplicate and transfers documents if needed to a different folder with the specified application and visibility.
   * @param documents - The array of documents to transfer.
   * @param application - The application to associate with the transferred documents.
   * @param visibility - The visibility of the transferred documents. Defaults to "protected".
   * @returns A Promise that resolves to an array of transferred WorkspaceElements.
   */
  async transferDocuments(
    documents: WorkspaceElement[],
    application: string,
    visibility: WorkspaceVisibility = 'protected',
  ): Promise<WorkspaceElement[]> {
    const documentsToTransfer: WorkspaceElement[] = [];
    // Copy files from shared/owner to protected/public
    documents.forEach((document: WorkspaceElement) => {
      if (visibility === 'public' && !document.public) {
        // Copy file to public
        documentsToTransfer.push(document);
      } else if (!document.public && !document.protected) {
        // Copy file to protected
        documentsToTransfer.push(document);
      }
    });
    if (documentsToTransfer.length > 0) {
      const res = await this.http.post<WorkspaceElement[]>(
        `/workspace/documents/transfer`,
        {
          application: application,
          visibility: visibility,
          ids: documentsToTransfer.map((doc) => doc._id),
        },
      );
      if (this.http.isResponseError()) {
        throw this.http.latestResponse.statusText;
      }

      // Update the documents array with the new documents
      documentsToTransfer.forEach((document, index) => {
        const documentIndex = documents.findIndex(
          (doc) => doc._id === document._id,
        );
        if (0 <= documentIndex && documentIndex < documents.length) {
          documents[documentIndex] = res[index];
        }
      });

      // Remove null values from the array (documents that were not copied)
      return documents.filter((document) => !!document);
    }

    return documents;
  }

  /**
   * Get the URL of the thumbnail of a workspace element (or its URL),
   * or `null` if none exists or can be created.
   */
  getThumbnailUrl(
    doc: WorkspaceElement | string,
    width: number = 0,
    height: number = 0,
  ) {
    const thumbnailSize =
      width > 0 || height > 0 ? `${width}x${height}` : '120x120';

    if (typeof doc === 'string') {
      if (doc.includes('data:image') || doc.includes('thumbnail')) {
        return doc;
      }
      return `${doc}${doc.includes('?') ? '&' : '?'}thumbnail=${thumbnailSize}`;
    } else {
      const urlPrefix = `/workspace/${doc.public ? 'pub/' : ''}document/${
        doc._id
      }?thumbnail=`;
      const thumbnails = doc.thumbnails;

      if (doc.metadata?.['content-type']?.includes('video')) {
        // Videos may have only 1 thumbnail, and the backend cannot create new ones at the moment.
        // Return the first thumbnail, or `null` if none is available.
        const firstThumbnail =
          thumbnails && Object.keys(thumbnails).length > 0
            ? Object.keys(thumbnails)[0]
            : null;
        return firstThumbnail ? urlPrefix + firstThumbnail : null;
      } else {
        // Return a thumbnail with requested sizes, or default to 120x120
        return urlPrefix + thumbnailSize;
      }
    }
  }

  /**
   * Get the URL of the file of a workspace element (or its URL),
   * or `null` if none exists or can be created.
   * @param filter - The filter to apply to the workspace element.
   * @param withChildren - If true, include all children folders.
   * @param parentId - The ID of the parent folder to list.
   * @param directShared - If true, include only elements directly shared with the user.
   *
   */
  listFolder(
    filter: WorkspaceSearchFilter,
    withChildren: boolean = false,
    parentId?: ID,
    directShared?: boolean,
  ): Promise<WorkspaceElement[]> {
    const queryParams = {
      filter,
      hierarchical: withChildren,
      parentId,
      directShared,
    };
    return this.http.get('/workspace/folders/list', {
      queryParams,
    });
  }

  /**
   * List all folders in the workspace.
   * @param withChildren - If true, include all children folders.
   * @param parentId - The ID of the parent folder to list.
   * @returns A promise that resolves to an array of WorkspaceElement objects.
   */
  listOwnerFolders(
    withChildren?: boolean,
    parentId?: ID,
  ): Promise<WorkspaceElement[]> {
    return this.listFolder('owner', withChildren, parentId);
  }

  /**
   * List all shared folders in the workspace.
   * @param withChildren - If true, include all children folders.
   * @param parentId - The ID of the parent folder to list.
   * @returns A promise that resolves to an array of WorkspaceElement objects.
   */
  listSharedFolders(
    withChildren?: boolean,
    parentId?: ID,
  ): Promise<WorkspaceElement[]> {
    return this.listFolder('shared', withChildren, parentId, true);
  }

  /**
   * Create a new folder in the workspace.
   * @param name - The name of the new folder.
   * @param parentId - The ID of the parent folder where the new folder will be created.
   * @returns void
   */
  createFolder(name: string, parentId?: string) {
    const formData = new FormData();
    formData.append('name', name);
    if (parentId) {
      formData.append('parentFolderId', parentId);
    }
    return this.http.postFile(`/workspace/folder`, formData);
  }
}
