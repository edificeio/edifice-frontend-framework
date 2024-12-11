import { AbstractBehaviourService } from './AbstractBehaviourService';

type MindmapData = {
  _id: string;
  name: string;
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
  description: string;
  thumbnail: string;
  shared?: [];
};

export class MindmapBehaviour extends AbstractBehaviourService {
  APP = 'mindmap';
  RESOURCE = 'mindmap';

  async loadResources() {
    const mindmaps = await this.httpGet<MindmapData[]>('/mindmap/list/all');
    return mindmaps.map((data) =>
      this.dataToResource({
        title: data.name,
        ownerName: data.owner.displayName,
        owner: data.owner.userId,
        icon: data.thumbnail || '/img/illustrations/mindmap-default.png',
        path: '/mindmap#/view/' + data._id,
        _id: data._id,
        shared: data.shared && data.shared.length >= 0 ? true : false,
        modified: data.modified,
      }),
    );
  }
}
