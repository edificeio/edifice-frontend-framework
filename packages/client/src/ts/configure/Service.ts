import { App, ERROR_CODE } from '../globals';
import { IOdeServices } from '../services/OdeServices';
import { IWebApp } from '../session/interfaces';
import { configure } from './Framework';
import { IGetConf, IOdeTheme, IThemeConf } from './interfaces';

export class ConfService {
  constructor(private context: IOdeServices) {}

  private get http() {
    return this.context.http();
  }
  private get cache() {
    return this.context.cache();
  }
  private get cdnDomain(): string {
    return configure.Platform.cdnDomain;
  }
  private get notify() {
    return this.context.notify();
  }

  async getConf(app: App): Promise<IGetConf> {
    const [conf, applications] = await Promise.all([
      this.getThemeConf(),
      this.getApplicationsList(),
    ]);

    const [theme, currentApp] = await Promise.all([
      this.getTheme({ conf, publicTheme: applications === undefined }),
      this.getWebAppConf({ app, applications: applications ?? [] }),
    ]);

    const appConf = {
      app,
      applications: applications ?? [],
      conf,
      currentApp,
      theme,
    };

    this.notify.onAppConfReady().resolve(appConf);

    return appConf;
  }

  async getPublicConf<T>(app: App): Promise<T> {
    // Public confs do not change until redeployed
    const { response, value } = await this.cache.httpGet<any>(
      `/${app}/conf/public`,
      {
        queryParams: { _: configure.Platform.deploymentTag },
      },
    );
    if (response.status < 200 || response.status >= 300)
      throw ERROR_CODE.APP_NOT_FOUND;
    return value;
  }

  getCdnUrl(): string | undefined {
    //TODO to implement
    return undefined;
  }

  async savePreference<T>(key: string, value: T) {
    this.http.putJson(`/userbook/preference/${key}`, value);
  }

  async getPreference<T>(key: string): Promise<T> {
    const res = await this.http.get<{ preference: string }>(
      `/userbook/preference/${key}`,
    );
    if (this.http.isResponseError() || typeof res === 'string') {
      // This is not a JSON object => not logged in !
      return {} as T;
    }
    return JSON.parse(res.preference) as T;
  }

  private async getThemeConf(version?: string): Promise<IThemeConf> {
    const res = await this.http.getScript<IThemeConf>(
      '/assets/theme-conf.js',
      { queryParams: { v: version } },
      'exports.conf',
    );
    return res;
  }

  private async getApplicationsList(): Promise<IWebApp[] | undefined> {
    const response = await this.http.get<{ apps: Array<IWebApp> }>(
      `/applications-list`,
    );
    if (this.http.isResponseError() || typeof response === 'string') {
      // This is not a JSON object => not logged in !
      return undefined;
    }
    return response.apps;
  }

  private async getWebAppConf({
    app,
    applications,
  }: {
    app: App;
    applications: IWebApp[];
  }): Promise<IWebApp | undefined> {
    const find = applications.find((item) => {
      if (item?.prefix) {
        return item?.prefix.replace('/', '') === app;
      }
    });
    return find;
  }

  private async getTheme({
    version,
    conf,
    publicTheme,
  }: {
    version?: string;
    conf: any;
    publicTheme?: boolean;
  }): Promise<IOdeTheme> {
    /* const { value } = await this.cache.httpGet<IOdeTheme>('/theme', {
      queryParams: { _: version },
    }); */

    const theme = await this.http.get<IOdeTheme>('/theme');

    const themeOverride = conf?.overriding?.find(
      (item: { child: string; parent: string; bootstrapVersion: string }) =>
        // Fix #WB2-2660:
        // If Public access => get the neo theme
        // Else get the theme from the user preference
        publicTheme
          ? item.parent === 'theme-open-ent' &&
            item.bootstrapVersion === 'ode-bootstrap-neo'
          : item.child === theme?.themeName,
    );

    // Fix #WB2-2660:
    // If public access => get the default skin
    // Else get the skin from the user preference (if the user preference is not set => get the first skin)
    const skinName = publicTheme
      ? 'default'
      : theme?.skinName || themeOverride?.skins[0];

    const themeUrl =
      theme?.skin ||
      `/assets/themes/${themeOverride?.child}/skins/${skinName}/`;
    const skins = themeOverride?.skins;
    const bootstrapVersion = themeOverride?.bootstrapVersion
      .split('-')
      .slice(-1)[0];
    const is1d = themeOverride?.parent === 'panda';

    return {
      basePath: `${this.cdnDomain}${themeUrl}../../`,
      bootstrapVersion,
      is1d,
      logoutCallback: theme?.logoutCallback || '',
      skin: themeOverride?.child,
      skinName,
      skins,
      themeName: themeOverride?.child,
      themeUrl,
      npmTheme: themeOverride?.npmTheme ?? undefined,
    };
  }

  async getLogoutCallback(version?: string) {
    const { response, value } = await this.cache.httpGet<any>(`/theme`, {
      queryParams: { _: version },
    });

    if (response.status < 200 || response.status >= 300) {
      throw ERROR_CODE.NOT_LOGGED_IN;
    }

    return value.logoutCallback;
  }
}
