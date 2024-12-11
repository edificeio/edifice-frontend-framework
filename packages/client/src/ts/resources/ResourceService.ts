import {
  App,
  CreateFolderParameters,
  CreateFolderResult,
  DeleteParameters,
  GetContextParameters,
  GetContextResult,
  GetSubFoldersResult,
  IActionResult,
  ID,
  ISearchResults,
  MoveParameters,
  PublishParameters,
  PublishResult,
  ResourceType,
  UpdateFolderParameters,
} from '..';
import { IOdeServices } from '../services/OdeServices';
import { ServiceRegistry } from './ServiceRegistry';
import {
  CopyParameters,
  CopyResult,
  CreateParameters,
  CreateResult,
  GetResourceParameters,
  IResource,
  IResourceService,
  IWebResourceService,
  UpdateParameters,
  UpdateResult,
} from './interface';

export abstract class ResourceService
  implements IResourceService, IWebResourceService
{
  //
  // STATIC REGISTRY
  //
  private static registry = new ServiceRegistry<
    IResourceService & IWebResourceService
  >();
  // Expose some useful functions
  static register = this.registry.register.bind(this.registry);
  static findService = this.registry.findService.bind(this.registry);
  static findMainService = this.registry.findMainService.bind(this.registry);
  static isRegistered = this.registry.isRegistered.bind(this.registry);

  //
  // IMPLEMENTATION
  //
  constructor(protected context: IOdeServices) {}

  protected get http() {
    return this.context.http();
  }

  //
  // ABSTRACT METHOD
  //
  abstract getApplication(): App | string;

  abstract getPrintUrl(resourceId: string): string;

  abstract getViewUrl(resourceId: string): string;

  abstract getFormUrl(folderId?: string): string;

  abstract getEditUrl(resourceId?: string): string;

  abstract create<T extends CreateParameters>(
    parameters: T,
  ): Promise<CreateResult>;

  abstract update<T extends UpdateParameters>(
    parameters: T,
  ): Promise<UpdateResult>;

  abstract getResourceType(): ResourceType;

  async copy(parameters: CopyParameters): Promise<CopyResult> {
    const res = await this.http.post<CopyResult>('/archive/duplicate', {
      application: parameters.application,
      resourceId: parameters.resourceId,
    });
    return this.checkHttpResponse(res);
  }

  async publish(parameters: PublishParameters): Promise<PublishResult> {
    const publicationAsFormData = new FormData();
    publicationAsFormData.append('title', parameters.title);
    publicationAsFormData.append('cover', parameters.cover);
    publicationAsFormData.append('coverName', (parameters.cover as File).name);
    publicationAsFormData.append('coverType', parameters.cover.type);
    publicationAsFormData.append('teacherAvatar', parameters.teacherAvatar);
    publicationAsFormData.append(
      'teacherAvatarName',
      (parameters.teacherAvatar as File).name ||
        `teacherAvatar_${parameters.userId}`,
    );
    publicationAsFormData.append(
      'teacherAvatarType',
      parameters.teacherAvatar.type,
    );
    publicationAsFormData.append('language', parameters.language);
    parameters.activityType.forEach((activityType) => {
      publicationAsFormData.append('activityType[]', activityType);
    });
    parameters.subjectArea.forEach((subjectArea) => {
      publicationAsFormData.append('subjectArea[]', subjectArea);
    });
    parameters.age.forEach((age) => {
      publicationAsFormData.append('age[]', age.toString());
    });
    publicationAsFormData.append('description', parameters.description);
    const keyWordsArray = parameters.keyWords.split(',');
    keyWordsArray.forEach((keyWord) => {
      publicationAsFormData.append('keyWords[]', keyWord.trim());
    });
    publicationAsFormData.append('licence', parameters.licence);
    publicationAsFormData.append(
      'pdfUri',
      `${window.location.origin}${this.getPrintUrl(parameters.resourceEntId)}`,
    );
    publicationAsFormData.append(
      'application',
      parameters.application ? parameters.application : '',
    );
    publicationAsFormData.append('resourceId', parameters.resourceId);
    publicationAsFormData.append('teacherSchool', parameters.userStructureName);
    const res = await this.http.post<PublishResult>(
      '/appregistry/library/resource',
      publicationAsFormData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );

    // #WB2-1747: "checkHttpResponse" is intentionally not called here because, in case of HTTP "Content Too Large" error, we need to return response with code 413.
    return res;
  }

  //
  // FOLDER METHODS
  //
  async createContext(
    parameters: GetContextParameters,
  ): Promise<GetContextResult> {
    const result = await this.http.get<GetContextResult>('/explorer/context', {
      queryParams: this.toQueryParams(parameters),
    });
    return this.checkHttpResponse(result);
  }

  async searchContext(
    parameters: GetContextParameters,
  ): Promise<ISearchResults> {
    const result = await this.http.get<GetContextResult>(
      '/explorer/resources',
      {
        queryParams: this.toQueryParams(parameters),
      },
    );
    return this.checkHttpResponse(result);
  }

  async searchResource(parameters: GetResourceParameters): Promise<IResource> {
    const result = await this.http.get<IResource>(
      `/explorer/resources/${parameters.id}`,
      {
        queryParams: this.getResourceParams(parameters),
      },
    );
    return this.checkHttpResponse(result);
  }

  async createFolder(
    parameters: CreateFolderParameters,
  ): Promise<CreateFolderResult> {
    const result = await this.http.post<CreateFolderResult>(
      '/explorer/folders',
      this.createFolderToBodyParams(parameters),
    );
    return this.checkHttpResponse(result);
  }

  async updateFolder(
    parameters: UpdateFolderParameters,
  ): Promise<CreateFolderResult> {
    const result = await this.http.put<CreateFolderResult>(
      `/explorer/folders/${parameters.folderId}`,
      this.createFolderToBodyParams(parameters),
    );
    return this.checkHttpResponse(result);
  }

  async moveToFolder(
    parameters: MoveParameters,
    useAssetId = false,
  ): Promise<IActionResult> {
    parameters.resourceIds = useAssetId
      ? await this.mapAssetIdToIds({
          application: parameters.application,
          assetIds: parameters.resourceIds,
        })
      : parameters.resourceIds;
    const result = await this.http.post<IActionResult>(
      `/explorer/folders/${parameters.folderId}/move`,
      this.moveToBodyParams(parameters),
    );
    return this.checkHttpResponse(result);
  }

  async listSubfolders(folderId: ID): Promise<GetSubFoldersResult> {
    const result = await this.http.get<GetSubFoldersResult>(
      `/explorer/folders/${folderId}`,
    );
    return this.checkHttpResponse(result);
  }

  async deleteAll(
    parameters: DeleteParameters,
    useAssetId = false,
  ): Promise<IActionResult> {
    parameters.resourceIds = useAssetId
      ? await this.mapAssetIdToIds({
          application: parameters.application,
          assetIds: parameters.resourceIds,
        })
      : parameters.resourceIds;
    const result = await this.http.deleteJson<IActionResult>(
      `/explorer`,
      parameters,
    );
    return this.checkHttpResponse(result);
  }

  async trashAll(
    { resourceType, ...parameters }: DeleteParameters,
    useAssetId = false,
  ): Promise<IActionResult> {
    parameters.resourceIds = useAssetId
      ? await this.mapAssetIdToIds({
          application: parameters.application,
          assetIds: parameters.resourceIds,
        })
      : parameters.resourceIds;
    const result = await this.http.putJson<IActionResult>(
      `/explorer/trash`,
      parameters,
    );
    return this.checkHttpResponse(result);
  }
  /** Trash folders and/or resources. */
  async restoreAll(
    { resourceType, ...parameters }: DeleteParameters,
    useAssetId = false,
  ): Promise<IActionResult> {
    parameters.resourceIds = useAssetId
      ? await this.mapAssetIdToIds({
          application: parameters.application,
          assetIds: parameters.resourceIds,
        })
      : parameters.resourceIds;
    const result = await this.http.putJson<IActionResult>(
      `/explorer/restore`,
      parameters,
    );
    return this.checkHttpResponse(result);
  }
  //
  // PROTECTED HELPERS
  //
  protected checkHttpResponse: <R>(result: R) => R = (result) => {
    if (this.http.latestResponse.status >= 300) {
      throw this.http.latestResponse.statusText;
    }
    return result;
  };

  private async mapAssetIdToIds({
    application,
    assetIds,
  }: {
    assetIds: ID[];
    application: App | string;
  }) {
    const resources = await this.searchContext({
      application,
      pagination: { startIdx: 0, pageSize: assetIds.length + 1 },
      types: [],
      filters: {},
      asset_id: assetIds,
    });
    return assetIds.map((assetId) => {
      const resource = resources.resources.find(
        (resource) => resource.assetId === assetId,
      );
      if (resource === undefined) {
        throw 'explorer.assetid.notfound';
      }
      return resource.id;
    });
  }

  protected async getThumbnailPath(file: string | Blob | File | undefined) {
    if (typeof file === 'undefined') {
      return file;
    } else if (typeof file === 'string') {
      if (file.startsWith('blob:')) {
        const blob = await fetch(file).then((r) => r.blob());
        const res = await this.context.workspace().saveFile(blob, {
          visibility: 'protected',
          application: this.getApplication(),
        });

        return `/workspace/document/${res._id}`;
      } else {
        return file;
      }
    } else {
      const res = await this.context.workspace().saveFile(file, {
        visibility: 'protected',
        application: this.getApplication(),
      });
      return `/workspace/document/${res._id}`;
    }
  }

  //
  // PRIVATE HELPERS
  //
  private toQueryParams(
    parameters: GetContextParameters,
  ): Record<string, string> {
    const ret = {
      application: parameters.application,
      start_idx: parameters.pagination.startIdx,
      page_size: parameters.pagination.pageSize,
      trashed: parameters.trashed,
    } as any;
    if (parameters.types.length > 0) {
      ret.resource_type = parameters.types[0];
    }
    if (parameters.orders && Object.entries(parameters.orders).length) {
      // axios serialize array as name[] (not compatible with current api)
      const [[key, value]] = Object.entries(parameters.orders);
      ret.order_by = `${key}:${value}`;
    }
    if (parameters.filters) {
      Object.assign(ret, parameters.filters);
    }
    if (typeof parameters.search === 'string') {
      ret.search = parameters.search;
    }
    if (typeof parameters.asset_id !== 'undefined') {
      ret.asset_id = [...parameters.asset_id];
    }
    if (typeof parameters.id !== 'undefined') {
      ret.id = parameters.id;
    }
    return ret;
  }

  private getResourceParams(parameters: GetResourceParameters) {
    return {
      application: parameters.application,
    };
  }

  private createFolderToBodyParams(parameters: CreateFolderParameters) {
    return {
      application: parameters.application,
      resourceType: parameters.type,
      parentId: parameters.parentId,
      name: parameters.name,
    };
  }

  private moveToBodyParams(parameters: MoveParameters) {
    return {
      application: parameters.application,
      resourceType: this.getResourceType(),
      resourceIds: parameters.resourceIds,
      folderIds: parameters.folderIds,
    };
  }
}
