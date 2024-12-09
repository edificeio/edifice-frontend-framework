import { session } from '../../session/Framework';
import { transport } from '../../transport/Framework';
import { ITimelineNotification, NotificationModel } from './interfaces';

/* const http = TransportFrameworkFactory.instance().http;
const me = SessionFrameworkFactory.instance().session.user; */

const http = transport?.http;
const me = session?.session?.user;

export class Notification implements ITimelineNotification {
  constructor(model: NotificationModel) {
    model.reported = model.reporters && model.reporters.length > 0;
    this._id = model._id;
    this.model = model;
  }
  public _id: string;
  public model: NotificationModel;

  isUnread() {
    return (
      this.model.recipients?.find((recipient) => {
        return recipient.userId === me.userId;
      }) !== undefined
    );
  }

  delete() {
    return http.delete('/timeline/' + this._id);
  }

  discard() {
    return http.put('/timeline/' + this._id);
  }

  report() {
    return http.put('/timeline/' + this._id + '/report');
  }
}
