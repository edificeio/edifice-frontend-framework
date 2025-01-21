import { APP } from '../../globals';
import {
  IFlashMessageModel,
  ITimelineApp,
  NotificationModel,
} from './interfaces';
import { configure } from '../../configure/Framework';
import { transport } from '../../transport/Framework';
import { Notification } from './Notification.model';

//-------------------------------------
export class TimelineApp implements ITimelineApp {
  //-------------------------------------

  private _notifications: Array<Notification> = [];
  private _notificationTypes: Array<string> = []; // ex: ["BLOG"]
  private _flashMessages: Array<IFlashMessageModel> = [];
  private _pageNumber = 0;
  private _lastPage = false;
  private _loading = false;

  public showMine: boolean = false;

  get notifications(): Array<Notification> {
    return this._notifications;
  }
  get isLoading(): boolean {
    return this._loading;
  }
  get page(): number {
    return this._pageNumber;
  }
  get hasMorePage(): boolean {
    return !this._lastPage;
  }
  get notificationTypes(): Array<string> {
    return this._notificationTypes;
  }
  get selectedNotificationTypes(): Array<string> {
    this.preferences.type = this.preferences.type || [];
    return this.preferences.type;
  }
  get preferences(): any {
    return configure.User.preferences.get(APP.TIMELINE);
  }
  get flashMessages() {
    return this._flashMessages;
  }

  public savePreferences() {
    return configure.User.saveAppPrefs(APP.TIMELINE);
  }

  public resetPagination(): void {
    this._pageNumber = 0;
    this._lastPage = false;
    this._loading = false;
  }

  initialize(): Promise<void> {
    return Promise.all([
      configure.User.loadAppPrefs(APP.TIMELINE),
      transport.http.get('/timeline/types'),
    ]).then((result) => {
      this._notificationTypes = result[1];
    });
  }

  public loadNotifications(force?: boolean): Promise<void> {
    const paginate = true; // Let's paginate, that's all.
    if (this._loading || (paginate && this._lastPage)) {
      return Promise.resolve();
    }

    if (force) {
      this._pageNumber++;
      this._lastPage = false;
    }

    const types = this.selectedNotificationTypes;
    // if(types.length===0) {
    //     types = this._notificationTypes;
    // }

    if (types.length === 0) {
      this._lastPage = true;
      return Promise.resolve();
    }

    const params: { page: number; mine?: number } = {
      page: this.page,
      mine: 1,
    };

    if (!this.showMine) {
      delete params.mine;
    }

    if (paginate) {
      this._loading = true;
    }

    return transport.http
      .get(`/timeline/lastNotifications?type=${types.join('&type=')}`, {
        queryParams: params,
      })
      .then(
        (response: {
          status: string;
          number: number;
          results: Array<NotificationModel>;
        }) => {
          this._loading = false;

          if (response.status !== 'ok') {
            //TODO notify error
            return;
          }

          if (response.number && response.results) {
            //#36034, add only non existing notification (avoid duplicate)
            const toAdd = response.results
              .filter(
                (result) =>
                  this._notifications.findIndex(
                    (_notification) => _notification._id === result._id,
                  ) === -1,
              )
              .map((notification) => new Notification(notification));
            this._notifications = this._notifications.concat(toAdd);
            this._pageNumber++;
          } else {
            this._lastPage = true;
            //FIXME model.trigger('notifications.change')
          }
        },
      )
      .catch((data) => {
        this._loading = false;
        //FIXME notify.error(data);
      });
  }

  loadFlashMessages(): Promise<void> {
    return transport.http
      .get<Array<IFlashMessageModel>>('/timeline/flashmsg/listuser')
      .then((results) => {
        this._flashMessages = results;
      });
  }

  markAsRead(msg: IFlashMessageModel): Promise<void> {
    return transport.http.put('/timeline/flashmsg/' + msg.id + '/markasread');
  }
}
