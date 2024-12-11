import { AbstractBehaviourService } from './AbstractBehaviourService';

type CollaborativewallData = {
  _id: string;
  icon: string;
  name: string;
  description: string;
  background: string;
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
  nbnotes: number;
};

export class CollaborativewallBehaviour extends AbstractBehaviourService {
  APP = 'collaborativewall';
  RESOURCE = 'collaborativewall';

  async loadResources() {
    const walls = await this.httpGet<CollaborativewallData[]>(
      '/collaborativewall/list/all',
    );
    return walls.map((data) =>
      this.dataToResource({
        title: data.name,
        ownerName: data.owner.displayName,
        owner: data.owner.userId,
        icon: data.icon
          ? data.icon
          : '/img/illustrations/collaborative-wall-default.png',
        path: '/collaborativewall#/view/' + data._id,
        _id: data._id,
        shared: data.shared && data.shared.length >= 0 ? true : false,
        modified: data.modified,
      }),
    );
  }
}
