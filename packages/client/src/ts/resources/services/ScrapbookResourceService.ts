import { IResource, ResourceType } from '../..';
import {
  CreateParameters,
  CreateResult,
  ScrapbookUpdate,
  UpdateResult,
} from '../interface';
import { ResourceService } from '../ResourceService';

const APP = 'scrapbook';
const RESOURCE = 'scrapbook';

export class ScrapbookResourceService extends ResourceService {
  create<T extends CreateParameters>(parameters: T): Promise<CreateResult> {
    throw new Error('Method not implemented.');
  }
  async update(parameters: ScrapbookUpdate): Promise<UpdateResult> {
    const thumbnail = await this.getThumbnailPath(parameters.thumbnail);
    const res = await this.http.put<IResource>(
      `/scrapbook/${parameters.entId}`,
      {
        trashed: parameters.trashed ? 1 : 0,
        title: parameters.name,
        icon: thumbnail,
        subTitle: parameters.description,
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
      ? `/scrapbook?folderid=${folderId}#/create-scrapbook/`
      : `/scrapbook#/create-scrapbook/`;
  }
  getViewUrl(resourceId: string): string {
    return `/scrapbook#/view-scrapbook/${resourceId}`;
  }
  getPrintUrl(resourceId: string): string {
    return `/scrapbook/print#/print-scrapbook/${resourceId}`;
  }
  getEditUrl(resourceId: string): string {
    return `/scrapbook#/edit-scrapbook/${resourceId}`;
  }
  getExportUrl(resourceId: string): string {
    return `/scrapbook/exportHtml/${resourceId}`;
  }
}

ResourceService.register(
  { application: RESOURCE, resourceType: RESOURCE },
  (context) => new ScrapbookResourceService(context),
);
