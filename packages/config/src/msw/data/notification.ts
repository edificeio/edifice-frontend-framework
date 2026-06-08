export * from './notification/systemNotifications';
export * from './notification/userNotifications';

import { NotificationModel } from '../../../../client';
import {
  supportNotification,
  systemNotificationCollaborativeEditor,
} from './notification/systemNotifications';
import {
  bookingNotificationArgus,
  bookingNotificationJaune,
  calendarCreateNotification1,
  calendarShareNotification1,
  infosNotification,
  messageNotification,
  userMoodNotificationLoison,
  userNotificationCollaborativeWall,
  userNotificationForm,
} from './notification/userNotifications';

export const mockNotifications: NotificationModel[] = [
  bookingNotificationArgus,
  infosNotification,
  systemNotificationCollaborativeEditor,
  bookingNotificationJaune,
  userNotificationCollaborativeWall,
  userMoodNotificationLoison,
  userNotificationForm,
  messageNotification,
  supportNotification,
  calendarShareNotification1,
  calendarCreateNotification1,
];

export const mockNotificationTypes: string[] = [
  'ARCHIVE',
  'BLOG',
  'CALENDAR',
  'COLLABORATIVEEDITOR',
  'COLLABORATIVEWALL',
  'COMMUNITY',
  'EXERCIZER',
  'FORMULAIRE',
  'FORUM',
  'HOMEWORKS',
  'MESSAGERIE',
  'MINDMAP',
  'NEWS',
  'PAGES',
  'POLL',
  'PRESENCES',
  'RACK',
  'RBS',
  'SCHOOLBOOK',
  'SCRAPBOOK',
  'SHAREBIGFILES',
  'SUPPORT',
  'TIMELINE',
  'TIMELINEGENERATOR',
  'USERBOOK',
  'USERBOOK_MOOD',
  'USERBOOK_MOTTO',
  'VIESCOLAIRE',
  'WIKI',
  'WORKSPACE',
];
