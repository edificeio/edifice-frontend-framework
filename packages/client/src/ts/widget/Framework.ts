import {
  IWidgetFramework,
  IWidget,
  WidgetUserPref,
  WidgetName,
} from './interfaces';
import {
  IWidgetModel,
  WidgetPosition,
  WIDGET_POSITION,
} from '../session/interfaces';
import { notify, Promisified } from '../notify/Framework';
import { IPromisified, EVENT_NAME, LAYER_NAME } from '../notify/interfaces';
import { configure } from '../configure/Framework';
import { Idiom } from '../idiom/Idiom';

// Widgets for 1D ONLY
const firstLevelWidgets: Array<WidgetName> = [
  'birthday',
  'mood',
  'calendar-widget',
  'notes',
];
// Widgets for 2D ONLY
const secondLevelWidgets: Array<WidgetName> = [
  'agenda-widget',
  'carnet-de-bord',
  'my-apps',
  'rss-widget',
  'bookmark-widget',
  'cursus-widget',
  'maxicours-widget',
  'school-widget',
];

// Default position for widgets.
const defaultWidgetPosition: { [name in WidgetName]: WidgetPosition } = {
  'last-infos-widget': WIDGET_POSITION.LEFT, // Actualités
  'birthday': WIDGET_POSITION.LEFT,
  'calendar-widget': WIDGET_POSITION.RIGHT, // Calendrier
  'carnet-de-bord': WIDGET_POSITION.LEFT,
  'record-me': WIDGET_POSITION.RIGHT, // Dictaphone
  'mood': WIDGET_POSITION.LEFT,
  'my-apps': WIDGET_POSITION.RIGHT,
  'notes': WIDGET_POSITION.RIGHT,
  'rss-widget': WIDGET_POSITION.LEFT,
  'bookmark-widget': WIDGET_POSITION.RIGHT,
  'qwant': WIDGET_POSITION.RIGHT,
  'qwant-junior': WIDGET_POSITION.LEFT,
  'agenda-widget': WIDGET_POSITION.LEFT, // Agenda
  'cursus-widget': WIDGET_POSITION.LEFT,
  'maxicours-widget': WIDGET_POSITION.RIGHT,
  'universalis-widget': WIDGET_POSITION.RIGHT,
  'briefme-widget': WIDGET_POSITION.LEFT,
  'school-widget': WIDGET_POSITION.LEFT,
};

// Default sort order for widgets, then overriden by user preferences, if any.
const defaultWidgetOrder: { [name in WidgetName]: number } = {
  'school-widget': 0,
  'my-apps': 10,
  'record-me': 15,
  'last-infos-widget': 20, // Actualités
  'qwant': 30,
  'qwant-junior': 30,
  'universalis-widget': 35,
  'agenda-widget': 40, // Agenda
  'bookmark-widget': 50,
  'carnet-de-bord': 60,
  'maxicours-widget': 70,
  'cursus-widget': 80, // Dictaphone
  'briefme-widget': 90,
  'rss-widget': 100,
  'mood': 110,
  'birthday': 120,
  'calendar-widget': 130, // Calendrier
  'notes': 140,
};

//-------------------------------------
export class WidgetFramework implements IWidgetFramework {
  //-------------------------------------
  private _initialized?: IPromisified<void>;
  private _widgets: Array<Widget> = [];

  initialize(version: string | null, cdnDomain: string | null): Promise<void> {
    if (!this._initialized) {
      this._initialized = new Promisified<void>();

      // Wait for /auth/oauth2/userinfo and read the widget conf.
      notify.onSessionReady().promise.then((userInfo) => {
        if (userInfo && userInfo.widgets) {
          userInfo.widgets.forEach((w) => {
            this._widgets.push(new Widget(w));
          });
          this.loadUserPrefs()
            .then(() => {
              this._initialized?.resolve();
            })
            .catch((e) => {
              this._initialized?.reject();
            });
        } else {
          this._initialized?.reject();
        }
      });
    }
    return this._initialized.promise;
  }

  ////////////////////////////////////// ACCESSORS
  get list(): Widget[] {
    return this._widgets;
  }

  lookup(widgetName: string): IWidget | undefined {
    return this._widgets.find((w) => w.platformConf.name === widgetName);
  }

  public lookupDefaultPosition(
    widgetName: WidgetName,
  ): WidgetPosition | undefined {
    return defaultWidgetPosition[widgetName];
  }

  ////////////////////////////////////// USER PREFERENCES
  private _userPrefs: IWidgetUserPrefs = {};
  get userPrefs() {
    return this._userPrefs;
  }

  private async loadUserPrefs(): Promise<void> {
    await configure.User.preferences.load('widgets', {}).then((prefs) => {
      return this.applyUserPrefs(prefs as IWidgetUserPrefs);
    });
  }

  saveUserPrefs() {
    return configure.User.preferences
      .update('widgets', this._userPrefs)
      .save('widgets')
      .then(() => {
        notify.events().publish(LAYER_NAME.WIDGETS, {
          name: EVENT_NAME.USERPREF_CHANGED,
        });
      });
  }

  private async applyUserPrefs(prefs: IWidgetUserPrefs): Promise<void> {
    this._userPrefs = prefs ?? this._userPrefs;
    const skin = configure.Platform.theme;
    const i18nFolders: Array<string> = [];

    // List skins to determine if current theme is 1D or 2D.
    skin.listSkins().then((skins) => {
      const widgetsToHide =
        skins.find((s) => s.child === skin.skin)?.parent === 'panda'
          ? secondLevelWidgets
          : firstLevelWidgets;

      // Filter out widgets that do not apply to the current theme,
      // AND prepare userPrefs of remaining widgets.
      this._widgets = this._widgets.filter((w, i) => {
        const widgetName = w.platformConf.name;
        const isHidden = widgetsToHide.indexOf(widgetName) !== -1;
        if (isHidden) return false;

        // Prepare the userPref of this widget.
        if (!this._userPrefs[widgetName]) {
          this._userPrefs[widgetName] = {
            index: defaultWidgetOrder[widgetName] ?? 999,
            show: true,
            position: w.platformConf.position,
          };
        }
        if (w.platformConf.mandatory) {
          this._userPrefs[widgetName].show = true;
          //#WB-48 : mandatory widgets are now sorted by default order.
          this._userPrefs[widgetName].index =
            defaultWidgetOrder[widgetName] ?? 999;
        }
        // Load its translations.
        if (w.platformConf.i18n) {
          i18nFolders.push(w.platformConf.i18n);
        }
        w.applyUserPref(this._userPrefs[widgetName]);
        return true;
      });
      const lang = new Idiom();
      this._widgets = this._widgets.sort((a, b) => {
        const translatedA = lang
          .translate(`timeline.settings.${a.platformConf.name}`)
          .toLowerCase();
        const translatedB = lang
          .translate(`timeline.settings.${b.platformConf.name}`)
          .toLowerCase();
        if (translatedA < translatedB) return -1;
        if (translatedA > translatedB) return 1;
        return 0;
      });
    });
    // FIXME: this is a port of the old code. No longer required by widgets from ode-ngjs-front.
    // .then( () => {
    //     // TODO Wait for the translation to be loaded ? => uncomment "return" below.
    //     /*return*/ configure.Platform.idiom.addAllTranslations( i18nFolders );
    // });
  }
}

//-------------------------------------
class Widget implements IWidget {
  //-------------------------------------
  constructor(private _platformConf: IWidgetModel) {
    // The widget is constructed by WidgetFramework.initialize(), which also sets this._userPref.
    // The following line is a pure typescript fix.
    this._userPref = null as any as WidgetUserPref;
  }
  get platformConf(): IWidgetModel {
    return this._platformConf;
  }

  private _schoolConf = {};
  get schoolConf() {
    return this._schoolConf;
  }

  private _userPref: WidgetUserPref;
  get userPref(): WidgetUserPref {
    // Sanity checks here
    return this._userPref;
  }

  applyUserPref(pref: WidgetUserPref) {
    this._userPref = pref;
    // Sanity checks here
    // Apply default position, left or right.
    this._userPref.position =
      this._userPref.position ??
      widgets.lookupDefaultPosition(this._platformConf.name) ??
      'left';
  }
}

//-------------------------------------
interface IWidgetUserPrefs {
  //-------------------------------------
  [widgetName: string]: WidgetUserPref;
}

/** The whole framework is a singleton. */
export const widgets: WidgetFramework = new WidgetFramework();
