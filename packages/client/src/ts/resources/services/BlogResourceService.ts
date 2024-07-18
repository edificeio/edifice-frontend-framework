import { IResource, ResourceType } from "../..";
import {
  BlogUpdate,
  CreateParameters,
  CreateResult,
  UpdateResult,
} from "../interface";
import { ResourceService } from "../ResourceService";

const APP = "blog";
const RESOURCE = "blog";

export class BlogResourceService extends ResourceService {
  getEditUrl(resourceId?: string | undefined): string {
    throw new Error("Method not implemented.");
  }
  async create(parameters: CreateParameters): Promise<CreateResult> {
    const thumbnail = parameters.thumbnail
      ? await this.getThumbnailPath(parameters.thumbnail)
      : "";

    const apiPath = parameters.public ? "/blog/pub" : "/blog";

    const res = await this.http.post<CreateResult>(apiPath, {
      "title": parameters.name,
      "description": parameters.description,
      "visibility": parameters.public ? "PUBLIC" : "OWNER",
      thumbnail,
      "trashed": false,
      "folder": parameters.folder,
      "slug": parameters.public ? parameters.slug : "",
      "publish-type": parameters.publishType || "RESTRAINT",
      "comment-type": "IMMEDIATE",
    });

    this.checkHttpResponse(res);

    return res;
  }

  async update(parameters: BlogUpdate): Promise<UpdateResult> {
    const thumbnail = parameters.thumbnail
      ? await this.getThumbnailPath(parameters.thumbnail)
      : "";
    const res = await this.http.put<IResource>(`/blog/${parameters.entId}`, {
      "trashed": parameters.trashed,
      "_id": parameters.entId,
      "title": parameters.name,
      thumbnail,
      "description": parameters.description,
      "visibility": parameters.public ? "PUBLIC" : "OWNER",
      "slug": parameters.public ? parameters.slug : "",
      "publish-type": parameters["publish-type"] || "RESTRAINT",
      "comment-type": "IMMEDIATE",
    });
    this.checkHttpResponse(res);
    return { thumbnail, entId: parameters.entId } as UpdateResult;
  }
  getResourceType(): ResourceType {
    return RESOURCE;
  }
  getApplication(): string {
    return APP;
  }
  getFormUrl(folderId?: string): string {
    return folderId
      ? `/blog?folderid=${folderId}#/edit/new`
      : `/blog#/edit/new`;
  }
  getViewUrl(resourceId: string): string {
    return `/blog/id/${resourceId}`;
  }
  getPrintUrl(resourceId: string): string {
    return `/blog/print/${resourceId}`;
  }
}
ResourceService.register(
  { application: APP, resourceType: RESOURCE },
  (context) => new BlogResourceService(context),
);
