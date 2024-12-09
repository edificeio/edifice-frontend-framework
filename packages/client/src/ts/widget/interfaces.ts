import { IWidgetModel, WidgetPosition } from '../session/interfaces';
import { widgets } from './Framework';

//-- Widgets name
export const WIDGET_NAME = {
  LAST_INFOS: 'last-infos-widget',
  BIRTHDAY: 'birthday',
  CALENDAR: 'calendar-widget',
  CARNET: 'carnet-de-bord',
  RECORD: 'record-me',
  MOOD: 'mood',
  MY_APPS: 'my-apps',
  NOTES: 'notes',
  RSS: 'rss-widget',
  BOOKMARK: 'bookmark-widget',
  QWANT: 'qwant',
  QWANT_JUNIOR: 'qwant-junior',
  AGENDA: 'agenda-widget',
  CURSUS: 'cursus-widget',
  MAXICOURS: 'maxicours-widget',
  UNIVERSALIS: 'universalis-widget',
  BRIEFME: 'briefme-widget',
  SCHOOL: 'school-widget',
} as const;
export type WidgetName = (typeof WIDGET_NAME)[keyof typeof WIDGET_NAME];

//-------------------------------------
export abstract class WidgetFrameworkFactory {
  //-------------------------------------
  static instance(): IWidgetFramework {
    return widgets;
  }
}

//-------------------------------------
export interface IWidgetFramework {
  //-------------------------------------
  /** Loads the widget configuration. */
  initialize(version: string | null, cdnDomain: string | null): Promise<void>;

  /** Save user preferences */
  saveUserPrefs(): Promise<any>;

  /** List widgets that are visible to the connected user. */
  readonly list: IWidget[];

  /** Retrieve a widget by name. */
  lookup(widgetName: string): IWidget | undefined;
}

//-------------------------------------
export interface IWidget {
  //-------------------------------------
  /** The widgets conf at platform level. */
  readonly platformConf: IWidgetModel;
  /* TODO readonly schoolConf:any; */
  /** The widgets conf at user level. */
  readonly userPref: WidgetUserPref;
}

//-------------------------------------
export type WidgetSpecificUserPrefs = 'schoolId'; // lastest selected school id, in school-widget
//-------------------------------------

//-------------------------------------
export type WidgetUserPref = {
  //-------------------------------------
  /** Integer defining the sort order of this widget. */
  index: number;
  /** Boolean indicating wether the user wants to see this widget, or not. */
  show: boolean;
  /** Prefered position on-screen (left, right...). */
  position?: WidgetPosition;
} & {
  [pref in WidgetSpecificUserPrefs]?: any;
};

//-------------------------------------
// WIDGETS
//-------------------------------------
export * from './LastInfos.widget';
