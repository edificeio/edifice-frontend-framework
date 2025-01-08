import { IResource, ResourceType } from '../..';
import {
  CreateParameters,
  CreateResult,
  HomeworksUpdate,
  UpdateResult,
} from '../interface';
import { ResourceService } from '../ResourceService';

const APP = 'homeworks';
const RESOURCE = 'homeworks';

export class HomeworksResourceService extends ResourceService {
  create<T extends CreateParameters>(parameters: T): Promise<CreateResult> {
    throw new Error('Method not implemented.');
  }
  async update(parameters: HomeworksUpdate): Promise<UpdateResult> {
    const thumbnail = await this.getThumbnailPath(parameters.thumbnail);
    const res = await this.http.put<IResource>(
      `/homeworks/${parameters.entId}`,
      {
        title: parameters.name,
        thumbnail,
        repeats: parameters.repeats,
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
  getFormUrl(folderId?: string): string {
    return folderId
      ? `/homeworks?folderid=${folderId}#/create-homeworks/`
      : `/homeworks#/create-homeworks/`;
  }
  getViewUrl(resourceId: string): string {
    return `/homeworks#/view-homeworks/${resourceId}`;
  }
  getPrintUrl(resourceId: string): string {
    return `/homeworks/print#/print-homeworks/${resourceId}`;
  }
  getEditUrl(resourceId: string): string {
    return `/homeworks#/edit-homeworks/${resourceId}`;
  }
  getExportUrl(): string {
    throw new Error('Export not implemented.');
  }
}

ResourceService.register(
  { application: RESOURCE, resourceType: RESOURCE },
  (context) => new HomeworksResourceService(context),
);
