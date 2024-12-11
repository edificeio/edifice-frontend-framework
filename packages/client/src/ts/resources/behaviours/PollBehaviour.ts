import { AbstractBehaviourService } from './AbstractBehaviourService';

type PollData = {
  question: string;
  icon: string;
  end: string;
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
  _id: string;
};

export class PollBehaviour extends AbstractBehaviourService {
  APP = 'poll';
  RESOURCE = 'poll';

  async loadResources() {
    const polls = await this.httpGet<PollData[]>('/poll/list/all');
    return polls.map((data) => {
      const threadIcon = !data.icon
        ? '/img/icons/glyphicons_036_file.png'
        : data.icon + '?thumbnail=48x48';
      return this.dataToResource({
        title: data.question,
        ownerName: data.owner.displayName,
        icon: threadIcon,
        path: '/poll#/view/' + data._id,
        _id: data._id,
        owner: data.owner.userId,
        shared: data.shared && data.shared.length >= 0 ? true : false,
        modified: data.modified,
      });
    });
  }
}
