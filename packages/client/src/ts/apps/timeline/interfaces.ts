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
  '_id': string; // "aaaa-aaa-aaa-adfdf"
  'type': string; // "BLOG",
  'eventType'?: string; // "SHARE",
  'event-type'?: string; // 'BOOKING-CREATED',
  'sub-resource'?: string; // '9169',
  'resource'?: string; // "732ba669-fead-44e5-a9d6-442a9352573a",
  'sender'?: string; //"16e39809-f5e7-4e85-8244-ab5a199e4e0b",
  'params': Record<string, string | number | undefined | null> & {
    uri?: string; //"/userbook/annuaire#16e39809-f5e7-4e85-8244-ab5a199e4e0b#Teacher",
    username?: string; //"BAILLY Catherine",
    blogTitle?: string; //"test 9/04",
    resourceUri?: string; //"/blog#/view/732ba669-fead-44e5-a9d6-442a9352573a"
    resourcename?: string; // "test 9/04"
    messageUri?: string; // '/conversation/conversation#/read-mail/90311e61-32a0-44c5-9cc1-3ea96057d29e',
    bookingUri?: string; // '/rbs#/booking/9171/2026-04-16',
    startdate?: string; // '16/04/26 11:00';
    enddate?: string; // '16/04/26 12:00';
    motto?: string | null; // 'Venez à ma rencontre !';
    subject?: string; // 'Demande de rendez-vous';
    issueId?: number | string; // '123456';
    ticketId?: number; // 168
    ticketUri?: string; // '/support#/ticket/168'
    eventUri?: string; // '/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504/event/9b1c8a5c-7d0b-4c8e-9a1e-2b6e5f0d8c3e',
    profilUri?: string; // '/userbook/annuaire#16e39809-f5e7-4e85-8244-ab5a199e4e0b#Teacher'
    CalendarTitle?: string; // 'Emploi du temps de Catherine BAILLY'
    calendarUri?: string; // '/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504',
    postTitle?: string; // 'Test récurence partagé'
  };
  'date': {
    $date: number | string;
  };
  'message': string; // "<a href=\"http://localhost:8090/userbook/annuaire#16e39809-f5e7-4e85-8244-ab5a199e4e0b#Teacher\">BAILLY Catherine</a>\n<br />\n<span>\n\t<span>vous a donné accès au blog</span> <a href=\"http://localhost:8090/blog#/view/732ba669-fead-44e5-a9d6-442a9352573a\">test 9/04</a>.\n</span>\n"

  'recipients'?: Array<Recipient>;
  'reported'?: boolean;
  'reporters'?: any;
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
  readonly contents?: { [key: string]: string };
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
