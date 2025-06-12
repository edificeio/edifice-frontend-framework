import { ID } from '../../globals';
import { GetContextParameters } from '../interface';
import {
  AbstractBehaviourService,
  ILinkedResource,
} from './AbstractBehaviourService';

type Data = {
  _id: ID;
  modified: string;
  owner: ID;
  ownerName: string;
  name: string;
  metadata: {
    'content-type'?: string;
    'size': number;
  };
  file: ID;
  thumbnails: {
    [resolution: string]: string;
  };
  ancestors: [];
  deleted?: boolean;
  shared?: [];
};

export class WorkspaceBehaviour extends AbstractBehaviourService {
  APP = 'workspace';
  RESOURCE = 'workspace';

  loadResources({ search, asset_id }: GetContextParameters) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<ILinkedResource[]>(async (resolve, reject) => {
      try {
        let url = '/workspace/documents?filter=all&hierarchical=true';
        if (asset_id && asset_id.length) url += `&search=${search}`;
        else if (search && search.length) url += `&search=${search}`;
        const datas = await this.httpGet<Data[]>(url);

        const resources = datas
          .filter((doc) => !doc.deleted)
          .map((data) => {
            const icon =
              data.metadata['content-type'] &&
              data.metadata['content-type'].indexOf('image') !== -1
                ? `/workspace/document/${data._id}?thumbnail=120x120`
                : '/img/icons/unknown-large.png';
            return this.dataToResource({
              title: data.name,
              ownerName: data.ownerName,
              owner: data.owner,
              icon,
              path: `/workspace/document/${data._id}`,
              _id: data._id,
              shared: data.shared && data.shared.length >= 0 ? true : false,
              modified: data.modified,
            });
          });
        resolve(resources);
      } catch (error) {
        reject(error);
      }
    });
  }
}
