import { IResource, ResourceType } from '../..';
import {
  CreateParameters,
  CreateResult,
  TimelineGeneratorUpdate,
  UpdateResult,
} from '../interface';
import { ResourceService } from '../ResourceService';

const APP = 'timelinegenerator';
const RESOURCE = 'timelinegenerator';

export class TimelineGeneratorResourceService extends ResourceService {
  async create(parameters: CreateParameters): Promise<CreateResult> {
    const thumbnail = parameters.thumbnail
      ? await this.getThumbnailPath(parameters.thumbnail)
      : '';

    const res = await this.http.post<CreateResult>(
      '/timelinegenerator/timelines',
      {
        headline: parameters.name,
        text: parameters.description,
        icon: thumbnail,
        type: 'default',
        folder: parameters.folder,
      },
    );

    this.checkHttpResponse(res);

    return res;
  }

  async update(parameters: TimelineGeneratorUpdate): Promise<UpdateResult> {
    const thumbnail = await this.getThumbnailPath(parameters.thumbnail);
    const res = await this.http.put<IResource>(
      `/timelinegenerator/timeline/${parameters.entId}`,
      {
        headline: parameters.name,
        text: parameters.description,
        icon: thumbnail,
        trashed: parameters.trashed ? true : false,
        _id: parameters.entId,
        type: 'default',
      },
    );
    this.checkHttpResponse(res);
    return { thumbnail: thumbnail, entId: parameters.entId } as UpdateResult;
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
    return `/timelinegenerator#/view/${resourceId}`;
  }
  getPrintUrl(resourceId: string): string {
    return `/timelinegenerator/print#/print/${resourceId}`;
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
  (context) => new TimelineGeneratorResourceService(context),
);
