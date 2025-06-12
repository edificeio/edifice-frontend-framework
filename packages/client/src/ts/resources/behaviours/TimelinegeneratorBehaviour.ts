import {
  AbstractBehaviourService,
  ILinkedResource,
} from './AbstractBehaviourService';

type TimelineData = {
  icon: string;
  created: { $date: number };
  headline: string;
  modified: { $date: number };
  owner: { userId: string; displayName: string };
  text: string;
  textPlain: string;
  type: string;
  _id: string;
  trashed?: boolean;
  shared?: any;
};

export class TimelinegeneratorBehaviour extends AbstractBehaviourService {
  APP = 'timelinegenerator';
  RESOURCE = 'timelinegenerator';

  loadResources() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<ILinkedResource[]>(async (resolve, reject) => {
      try {
        const datas = await this.httpGet<TimelineData[]>(
          '/timelinegenerator/timelines',
        );
        const resources = datas.map((data) => {
          const icon = data.icon || '/img/illustrations/timeline-default.png';
          return this.dataToResource({
            title: data.headline,
            ownerName: data.owner.displayName,
            owner: data.owner.userId,
            icon: icon,
            path: '/timelinegenerator#/view/' + data._id,
            _id: data._id,
            shared: typeof data.shared !== 'undefined',
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
