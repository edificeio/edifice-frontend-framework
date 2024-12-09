import { transport } from '../transport/Framework';
import { App } from '../globals';
import { configure } from './Framework';
import { notify } from '../notify/Framework';
import { IWebApp } from '../session/interfaces';

const http = transport?.http;

//-------------------------------------
export class AppConf {
  //-------------------------------------
  private _publicConf: { [key in App]?: any } = {};
  private _currentApp?: App;
  private _appConf: { [key in App]?: IWebApp } = {};

  /**
   * Get the currently initialized App.
   * @see getter SessionFramework.currentApp
   */
  get currentApp(): App | null {
    return this._currentApp ?? null;
  }

  setCurrentApp(app: App): AppConf {
    this._currentApp = app;
    return this;
  }

  async initialize(app: App, alternativeApp: boolean = false): Promise<void> {
    if (!alternativeApp) {
      this.setCurrentApp(app);
    }
    await Promise.all([this.getPublicConf(app), this.loadI18n(app)]);
  }

  public async getPublicConf(app: App): Promise<any> {
    if (!this._publicConf[app]) {
      this._publicConf[app] = await http.get<any>(`/${app}/conf/public`, {
        queryParams: { _: configure.Platform.deploymentTag },
      });
    }
    return this._publicConf[app];
  }

  public async getWebAppConf(app: App): Promise<IWebApp | undefined> {
    let found: IWebApp | undefined;
    if (!this._appConf[app]) {
      const list = await http.get<{ apps: Array<IWebApp> }>(
        `/applications-list`,
      );
      list.apps.forEach((conf) => {
        if (conf?.prefix) {
          const a: App = conf.prefix.replace('/', '') as App;
          this._appConf[a] = conf;
        } else if (conf?.name) {
          /* Try to extract name from another field than prefix. */
          if (conf.name.toLowerCase() == app) {
            found = conf;
          }
        }
      });
    }
    return this._appConf[app] ?? found;
  }

  public async loadI18n(app: App): Promise<void> {
    await notify.onLangReady().promise;
    const i18n = configure.Platform.idiom;
    return i18n.addBundlePromise(`/${app}/i18n`);
  }
}
