import { ID, IHttpParams, ResourceType } from '../..';
import { CacheService } from '../../cache/Service';
import { IOdeServices } from '../../services/OdeServices';
import {
  GetContextParameters,
  IBehaviourService,
  IResource,
} from '../interface';

export interface LinkerModel {
  _id: ID;
  title: string;
  ownerName: string;
  owner: string;
  icon: string;
  shared: boolean;
  path?: string;
  modified:
    | string
    | {
        $date: number | string;
      };
}

/**
 * Share detail interface for fine-grained sharing information
 */
export interface ShareDetail {
  [rightOrId: string]: boolean | string;
}

export interface ILinkedResource extends IResource {
  path: string;
  /** Optional detailed sharing information with users/groups and their specific rights */
  shareDetails?: ShareDetail[];
}

/**
 * TO BE DEPRECATED. DO NOT USE UNLESS YOU KNOW WHAT YOU ARE DOING.
 */
export abstract class AbstractBehaviourService implements IBehaviourService {
  abstract APP: string;
  abstract RESOURCE: ResourceType;
  /** Adapter function to be implemented by subclasses. */
  abstract loadResources(
    parameters?: GetContextParameters,
  ): Promise<ILinkedResource[]>;

  //
  // IMPLEMENTATION
  //
  constructor(protected context: IOdeServices) {
    this._cache = new CacheService(this.context);
  }

  getApplication(): string {
    return this.APP;
  }
  getResourceType(): ResourceType {
    return this.RESOURCE;
  }

  //-----------------
  //--- Utilities ---
  //-----------------
  private _cache: CacheService;

  protected httpGet<R>(url: string, params?: IHttpParams | undefined) {
    return this._cache.httpGetJson<R>(url, params);
  }
  /* Utility to map data between linker model and search model. */
  protected dataToResource({
    modified,
    ...resource
  }: LinkerModel): ILinkedResource {
    const modifiedAt =
      typeof modified === 'string'
        ? modified
        : modified?.$date
          ? '' + modified.$date
          : '';
    return {
      application: this.RESOURCE,
      name: resource.title,
      creatorId: resource.owner,
      creatorName: resource.ownerName,
      thumbnail: resource.icon,
      assetId: resource._id,
      modifiedAt,
      shared: resource.shared,
      path: resource.path,
    } as ILinkedResource;
  }
}
