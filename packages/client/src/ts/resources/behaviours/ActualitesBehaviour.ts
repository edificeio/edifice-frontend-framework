import { AbstractBehaviourService } from './AbstractBehaviourService';

type InfoData = {
  id: number;
  status: 'PUBLISHED';
  title: string;
  content: string;
  threadId: number;
  headline: boolean;
  owner: { id: string; displayName: string; deleted: boolean };
  numberOfComments: number;
  shared?: any;
  created: string;
  modified: string;
  threadIcon: string;
};

type ThreadData = {
  id: number;
  title: string;
  icon: string;
};

export class ActualitesBehaviour extends AbstractBehaviourService {
  APP = 'actualites';
  RESOURCE = 'actualites';

  async loadResources() {
    const [infos, threads] = await Promise.all([
      this.httpGet<InfoData[]>('/actualites/api/v1/infos/linker'),
      this.httpGet<ThreadData[]>('/actualites/api/v1/threads?viewHidden=true'),
    ]);

    const threadsMap: Map<number, ThreadData> = threads.reduce(
      (map, thread) => map.set(thread.id, thread),
      new Map<number, ThreadData>(),
    );

    return infos.map((data) => {
      let threadIcon;
      if (!data.threadIcon) {
        threadIcon = '/img/icons/glyphicons_036_file.png';
      } else {
        threadIcon = data.threadIcon + '?thumbnail=48x48';
      }
      return this.dataToResource({
        title: data.title + ' [' + threadsMap.get(data.threadId)?.title + ']',
        ownerName: data.owner.displayName,
        owner: data.owner.id,
        icon: threadIcon,
        path: '/actualites/threads/' + data.threadId + '?info=' + data.id,
        _id: `${data.threadId}#${data.id}`,
        shared: data.shared && data.shared.length >= 0 ? true : false,
        modified: data.modified,
      });
    });
  }
}
