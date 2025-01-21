import { AbstractBehaviourService } from './AbstractBehaviourService';

type ExercizerData = {
  id: number;
  subject_id: number;
  owner: string;
  owner_username: string;
  created: string;
  modified: string;
  title: string;
  description: string;
  picture: string;
  max_score: number;
  begin_date: string;
  due_date: string;
  estimated_duration: string;
  is_over: boolean;
  is_one_shot_submit: boolean;
  has_automatic_display: boolean;
  is_deleted: boolean;
  scheduled_at: string;
  corrected_date: string;
  type: string;
  is_notify: boolean;
  is_archived: boolean;
  use_time: boolean;
  locale: string;
  random_display: boolean;
  correction_notify: boolean;
  is_training_mode: boolean;
  is_training_permitted: boolean;
  files: [];
};

export class ExercizerBehaviour extends AbstractBehaviourService {
  APP = 'exercizer';
  RESOURCE = 'exercizer';

  async loadResources() {
    const exercices = await this.httpGet<ExercizerData[]>(
      '/exercizer/subjects-scheduled',
    );
    return exercices.map((data) => {
      const icon = data.picture
        ? data.picture + '?thumbnail=48x48'
        : '/img/illustrations/exercizer.svg';
      let recipient;
      let shared = false;
      const scheduled_at = JSON.parse(data.scheduled_at);
      if (scheduled_at.groupList.length > 0) {
        shared = true;
        recipient = scheduled_at.groupList[0].name;
      } else if (scheduled_at.userList.length > 0) {
        shared = true;
        recipient = scheduled_at.userList[0].name;
      } else {
        recipient = '';
      }
      if (scheduled_at.groupList.length + scheduled_at.userList.length > 1) {
        recipient += '...';
      }
      return this.dataToResource({
        title: data.title,
        owner: data.owner,
        ownerName: recipient,
        icon,
        path: '/exercizer#/linker/' + data.id,
        _id: '' + data.id,
        shared,
        modified: data.modified,
      });
    });
  }
}
