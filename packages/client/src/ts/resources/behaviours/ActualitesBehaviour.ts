import { AbstractBehaviourService } from './AbstractBehaviourService';

type ActualitesData = {
  _id: number;
  status: number;
  title: string;
  content: string;
  thread_id: number;
  is_headline: boolean;
  owner: string;
  username: string;
  number_of_comments: number;
  shared?: any;
  created: string;
  modified: string;
  thread_title: string;
  thread_icon: string;
};

export class ActualitesBehaviour extends AbstractBehaviourService {
  APP = 'actualites';
  RESOURCE = 'actualites';

  async loadResources() {
    const infos = await this.httpGet<ActualitesData[]>(
      '/actualites/linker/infos',
    );

    return infos.map((data) => {
      let threadIcon;
      if (!data.thread_icon) {
        threadIcon = '/img/icons/glyphicons_036_file.png';
      } else {
        threadIcon = data.thread_icon + '?thumbnail=48x48';
      }
      return this.dataToResource({
        title: data.title + ' [' + data.thread_title + ']',
        ownerName: data.username,
        owner: data.owner,
        icon: threadIcon,
        path:
          '/actualites#/view/thread/' + data.thread_id + '/info/' + data._id,
        _id: `${data.thread_id}#${data._id}`,
        shared: data.shared && data.shared.length >= 0 ? true : false,
        modified: data.modified,
      });
    });
  }
}
