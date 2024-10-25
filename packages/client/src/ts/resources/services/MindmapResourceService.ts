import { App, IResource, ResourceType } from "../..";
import {
  CreateParameters,
  CreateResult,
  MindmapUpdate,
  UpdateResult,
} from "../interface";
import { ResourceService } from "../ResourceService";

const APP = "mindmap";
const RESOURCE = "mindmap";

export class MindmapResourceService extends ResourceService {
  getEditUrl(resourceId?: string | undefined): string {
    throw new Error("Method not implemented.");
  }
  async create(parameters: CreateParameters): Promise<CreateResult> {
    const thumbnail = parameters.thumbnail
      ? await this.getThumbnailPath(parameters.thumbnail)
      : "";

    const res = await this.http.post<{ _id: string }>(`/mindmap`, {
      name: parameters.name,
      description: parameters.description,
      thumbnail,
      folder: parameters.folder,
      map: `<map version="tango" theme="prism"><topic central="true" text="${parameters.name}"/></map>`,
      trashed: false,
      visibility: "OWNER",
    });

    this.checkHttpResponse(res);

    return { entId: res._id, thumbnail };
  }

  async update(parameters: MindmapUpdate): Promise<UpdateResult> {
    const thumbnail = parameters.thumbnail
      ? await this.getThumbnailPath(parameters.thumbnail)
      : "";
    const res = await this.http.put<IResource>(`/mindmap/${parameters.entId}`, {
      trashed: parameters.trashed,
      _id: parameters.entId,
      name: parameters.name,
      thumbnail,
      description: parameters.description,
      visibility: parameters.public ? "PUBLIC" : "OWNER",
    });
    this.checkHttpResponse(res);
    return { thumbnail, entId: parameters.entId } as UpdateResult;
  }
  getResourceType(): ResourceType {
    return RESOURCE;
  }
  getApplication(): App | string {
    return APP;
  }
  getFormUrl(folderId?: string): string {
    return folderId ? `/mindmap?folderid=${folderId}/new` : `/mindmap/new`;
  }
  getViewUrl(resourceId: string): string {
    return `/mindmap/id/${resourceId}`;
  }
  getPrintUrl(resourceId: string): string {
    return `/mindmap/print/id/${resourceId}`;
  }
}
ResourceService.register(
  { application: APP, resourceType: RESOURCE },
  (context) => new MindmapResourceService(context),
);
