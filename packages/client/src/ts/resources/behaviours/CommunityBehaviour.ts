import { AbstractBehaviourService } from './AbstractBehaviourService';

type CommunityData = {
  thumbnail: string;
  //  description: string;
  name: string;
  id: string;
  shared?: [];
  owner: {
    userId: string;
    displayName: string;
  };
};

export class CommunityBehaviour extends AbstractBehaviourService {
  APP = 'community';
  RESOURCE = 'community';

  async loadResources() {
    const communities = await this.httpGet<CommunityData[]>(
      '/community/listallpages',
    );
    return communities.map((data) => {
      let communityIcon;
      if (typeof data.thumbnail === 'undefined' || data.thumbnail === '') {
        communityIcon = '/img/icons/glyphicons_036_file.png';
      } else {
        communityIcon = data.thumbnail + '?thumbnail=48x48';
      }

      return this.dataToResource({
        title: data.name,
        icon: communityIcon,
        path: '/community#/view/' + data.id,
        _id: data.id,
        owner: '',
        ownerName: '',
        shared: data.shared && data.shared.length >= 0 ? true : false,
        modified: data.name, // FIXME date ?
      });
    });
  }
}
