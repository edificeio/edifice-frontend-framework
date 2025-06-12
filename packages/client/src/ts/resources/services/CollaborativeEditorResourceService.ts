import { IResource, ResourceType } from '../..';
import {
  CollaborativeEditorUpdate,
  CreateParameters,
  CreateResult,
  UpdateResult,
} from '../interface';
import { ResourceService } from '../ResourceService';

const APP = 'collaborativeeditor';
const RESOURCE = 'collaborativeeditor';

export class CollaborativeEditorResourceService extends ResourceService {
  async create(parameters: CreateParameters): Promise<CreateResult> {
    const { name, description, thumbnail, folder } = parameters;

    const thumbnailPath = thumbnail
      ? await this.getThumbnailPath(thumbnail)
      : '';

    const res = await this.http.post<CreateResult>('/collaborativeeditor', {
      name,
      description,
      thumbnail: thumbnailPath,
      folder,
    });

    this.checkHttpResponse(res);

    return res;
  }

  async update(parameters: CollaborativeEditorUpdate): Promise<UpdateResult> {
    const { name, description, thumbnail, entId } = parameters;

    const thumbnailPath = await this.getThumbnailPath(thumbnail);

    const res = await this.http.put<IResource>(
      `/collaborativeeditor/${entId}`,
      {
        name,
        description,
        thumbnail: thumbnailPath,
      },
    );

    this.checkHttpResponse(res);

    return { thumbnail: thumbnailPath, entId } as UpdateResult;
  }

  getResourceType(): ResourceType {
    return RESOURCE;
  }

  getApplication(): string {
    return APP;
  }

  getFormUrl(): string {
    // we're using Explorer ResourceModal
    throw new Error('Method not implemented.');
  }

  getViewUrl(resourceId: string): string {
    return `/collaborativeeditor#/view/${resourceId}`;
  }

  getPrintUrl(): string {
    // no print
    throw new Error('Method not implemented.');
  }

  getEditUrl(): string {
    // we're using Explorer ResourceModal
    throw new Error('Method not implemented.');
  }

  getExportUrl(): string {
    // no export
    throw new Error('Method not implemented.');
  }
}

ResourceService.register(
  { application: RESOURCE, resourceType: RESOURCE },
  (context) => new CollaborativeEditorResourceService(context),
);
