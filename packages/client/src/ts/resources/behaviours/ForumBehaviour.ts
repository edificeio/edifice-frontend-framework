import { AbstractBehaviourService } from './AbstractBehaviourService';

type ForumData = {
  _id: string;
  name: string;
  icon: string;
  owner: {
    userId: string;
    displayName: string;
  };
  created: {
    $date: number;
  };
  modified: {
    $date: number;
  };
  shared?: [];
};

export class ForumBehaviour extends AbstractBehaviourService {
  APP = 'forum';
  RESOURCE = 'forum';

  async loadResources() {
    const categories = await this.httpGet<ForumData[]>('/forum/categories');
    return categories.map((data) =>
      this.dataToResource({
        _id: data._id,
        title: data.name,
        icon: data.icon || '/img/illustrations/forum.svg',
        path: '/forum#/view/' + data._id,
        ownerName: data.owner.displayName,
        owner: data.owner.userId,
        shared: data.shared && data.shared.length >= 0 ? true : false,
        modified: data.modified,
      }),
    );
  }
}
