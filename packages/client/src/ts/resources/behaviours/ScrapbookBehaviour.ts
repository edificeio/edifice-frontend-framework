import { AbstractBehaviourService } from './AbstractBehaviourService';

type ScrapbookData = {
  _id: string;
  title: string;
  subTitle: string;
  icon: string;
  trashed: number;
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
  coverColor: string;
  shared?: [];
};

export class ScrapbookBehaviour extends AbstractBehaviourService {
  APP = 'scrapbook';
  RESOURCE = 'scrapbook';

  async loadResources() {
    const scrapbooks = await this.httpGet<ScrapbookData[]>(
      '/scrapbook/list/all',
    );
    return scrapbooks.map((data) => {
      const icon = data.icon || '/img/illustrations/scrapbook.svg';
      return this.dataToResource({
        title: data.name,
        owner: data.owner.userId,
        ownerName: data.owner.displayName,
        icon: icon,
        path: '/scrapbook#/view-scrapbook/' + data._id,
        _id: data._id,
        shared: data.shared && data.shared.length >= 0 ? true : false,
        modified: data.modified,
      });
    });
  }
}
