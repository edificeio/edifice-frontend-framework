import { TimelineApp } from './Framework';

//-------------------------------------
export abstract class ITimelineFactory {
  //-------------------------------------
  static createInstance(): ITimelineApp {
    return new TimelineApp();
  }
}

//-------------------------------------
export interface ITimelineApp {
  //-------------------------------------
  initialize(): Promise<void>;
  readonly notificationTypes: Array<string>;
  readonly selectedNotificationTypes: Array<string>;

  showMine: boolean;
  /** Load more notifications, or force loading more by virtually incrementing the page. */
  loadNotifications(force?: boolean): Promise<void>;
  readonly notifications: Array<ITimelineNotification>;

  resetPagination(): void;
  readonly isLoading: boolean;
  readonly page: number;
  readonly hasMorePage: boolean;

  savePreferences(): Promise<void>;
  readonly preferences: any;
  // registeredNotifications: any;

  loadFlashMessages(): Promise<void>;
  readonly flashMessages: Array<IFlashMessageModel>;
  markAsRead(msg: IFlashMessageModel): Promise<void>;
}

//-------------------------------------
export interface ITimelineNotification {
  //-------------------------------------
  readonly _id: string;
  readonly model: NotificationModel;
  isUnread(): boolean;
  delete(): Promise<void>;
  discard(): Promise<void>;
  report(): Promise<void>;
}

//-------------------------------------
export type NotificationModel = {
  //-------------------------------------
  _id: string; // "aaaa-aaa-aaa-adfdf"
  type: string; // "BLOG",
  eventType: string; // "SHARE",
  resource: string; // "732ba669-fead-44e5-a9d6-442a9352573a",
  sender: string; //"16e39809-f5e7-4e85-8244-ab5a199e4e0b",
  params: {
    uri: string; //"/userbook/annuaire#16e39809-f5e7-4e85-8244-ab5a199e4e0b#Teacher",
    username: string; //"BAILLY Catherine",
    blogTitle: string; //"test 9/04",
    resourceUri: string; //"/blog#/view/732ba669-fead-44e5-a9d6-442a9352573a"
  };
  date: {
    $date: number;
  };
  message: string; // "<a href=\"http://localhost:8090/userbook/annuaire#16e39809-f5e7-4e85-8244-ab5a199e4e0b#Teacher\">BAILLY Catherine</a>\n<br />\n<span>\n\t<span>vous a donné accès au blog</span> <a href=\"http://localhost:8090/blog#/view/732ba669-fead-44e5-a9d6-442a9352573a\">test 9/04</a>.\n</span>\n"

  recipients?: Array<Recipient>;
  reported?: boolean;
  reporters?: any;
};

//-------------------------------------
export interface Recipient {
  //-------------------------------------
  userId: string;
}

//-------------------------------------
export interface IFlashMessageModel {
  //-------------------------------------
  readonly id: string;
  readonly title?: string;
  readonly contents?: object;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly readCount?: number;
  readonly author?: string;
  readonly profiles?: string[];
  readonly color?: string;
  readonly customColor?: string | null;
  readonly lastModifier?: string;
  readonly structureId?: string;
  readonly subStructures?: string[];
  readonly signature?: string;
  readonly signatureColor?: string;
}
