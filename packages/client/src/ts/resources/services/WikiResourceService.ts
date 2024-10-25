import { ResourceService } from "../ResourceService";
import {
  CreateParameters,
  CreateResult,
  IResource,
  UpdateParameters,
  UpdateResult,
} from "../interface";

const APP = "wiki";
const RESOURCE = "wiki";

export class WikiResourceService extends ResourceService {
  getApplication(): string {
    return APP;
  }

  getPrintUrl(resourceId: string): string {
    return `/wiki/print/id/${resourceId}`;
  }

  getViewUrl(resourceId: string): string {
    return `/wiki/id/${resourceId}`;
  }

  getFormUrl(folderId?: string | undefined): string {
    // TODO ?
    throw new Error("Method not implemented.");
  }

  getEditUrl(resourceId?: string | undefined): string {
    // TODO ?
    throw new Error("Method not implemented.");
  }

  async create(parameters: CreateParameters): Promise<CreateResult> {
    const thumbnail = parameters.thumbnail
      ? await this.getThumbnailPath(parameters.thumbnail)
      : "";

    const res = await this.http.post<{ _id: string }>(`/wiki`, {
      title: parameters.name,
      description: parameters.description,
      thumbnail,
      folder: parameters.folder,
      trashed: false,
    });

    this.checkHttpResponse(res);

    return { entId: res._id, thumbnail };
  }

  async update(parameters: UpdateParameters): Promise<UpdateResult> {
    const thumbnail = parameters.thumbnail
      ? await this.getThumbnailPath(parameters.thumbnail)
      : "";

    const res = await this.http.put<IResource>(`/wiki/${parameters.entId}`, {
      trashed: parameters.trashed,
      title: parameters.name,
      thumbnail,
      description: parameters.description,
    });
    this.checkHttpResponse(res);
    return { thumbnail: thumbnail, entId: parameters.entId } as UpdateResult;
  }

  getResourceType(): string {
    return RESOURCE;
  }
}

ResourceService.register(
  { application: APP, resourceType: RESOURCE },
  (context) => new WikiResourceService(context),
);
