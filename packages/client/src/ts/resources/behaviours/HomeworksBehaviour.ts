import { AbstractBehaviourService } from './AbstractBehaviourService';

type HomeworkData = {
  _id: string;
  title: string;
  thumbnail: string;
  owner: {
    userId: string;
    displayName: string;
  };
  modified: { $date: number };
  created: { $date: number };
  trashed: number;
  shared?: [];
  // repeats: [];
  // entriesModified: { $date: number };
  // ... probably more, idc
};

export class HomeworksBehaviour extends AbstractBehaviourService {
  APP = 'homeworks';
  RESOURCE = 'homeworks';

  async loadResources() {
    return (await this.httpGet<HomeworkData[]>('/homeworks/list'))
      .filter((homework) => homework.owner && homework.trashed === 0)
      .map((homework) => {
        return this.dataToResource({
          title: homework.title,
          ownerName: homework.owner.displayName,
          owner: homework.owner.userId,
          icon: homework.thumbnail || '/img/illustrations/homeworks.svg',
          path: '/homeworks#/view-homeworks/' + homework._id,
          _id: '' + homework._id,
          shared: typeof homework.shared !== 'undefined',
          modified: homework.modified,
        });
      });
  }
}
