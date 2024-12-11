import { App, ERROR_CODE } from '../globals';
import {
  GetUserProfileOptions,
  IGetSession,
  IQuotaAndUsage,
  IUserDescription,
  IUserInfo,
  IWebApp,
  UserProfile,
} from './interfaces';

import { IOdeServices } from '../services/OdeServices';

export class SessionService {
  constructor(private context: IOdeServices) {}

  get http() {
    return this.context.http();
  }
  get cache() {
    return this.context.cache();
  }

  private get conf() {
    return this.context.conf();
  }

  /**
   * Callback to call when user logout
   */
  onLogout() {
    this.cache.clearCache();
  }

  /**
   * Callback to call when session change
   */
  onRefreshSession() {
    this.cache.clearCache();
  }

  async getSession(): Promise<IGetSession> {
    const user = await this.getUser();

    const [
      currentLanguage,
      quotaAndUsage,
      userDescription,
      userProfile,
      bookmarkedApps,
    ] = await Promise.all([
      this.getCurrentLanguage(user),
      this.latestQuotaAndUsage(user),
      this.loadDescription(user),
      this.getUserProfile(),
      this.getBookmarks(user),
    ]);

    return {
      user,
      quotaAndUsage,
      currentLanguage,
      userDescription,
      userProfile,
      bookmarkedApps,
    };
  }

  public login(
    email: string,
    password: string,
    rememberMe?: boolean,
    secureLocation?: boolean,
  ): Promise<void> {
    const data = new FormData();
    data.append('email', email);
    data.append('password', password);
    if (typeof rememberMe !== 'undefined') {
      data.append('rememberMe', '' + rememberMe);
    }
    if (typeof secureLocation !== 'undefined') {
      data.append('secureLocation', '' + secureLocation);
    }

    return this.http
      .post<void>('/auth/login', data, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      })
      .finally(() => {
        switch (this.http.latestResponse.status) {
          case 200: // error, TODO look for error message in returned html...
            throw ERROR_CODE.MALFORMED_DATA;
          case 302: // success TODO redirects cannot be intercepted with axios in a browser !!!
          default:
            break;
        }
      });
  }

  async logout(): Promise<void> {
    const logoutCallback = await this.conf.getLogoutCallback();

    return this.http
      .get<void>('/auth/logout?callback=' + logoutCallback)
      .finally(() => {
        // void, always successful
      });
  }

  async latestQuotaAndUsage(
    user: IUserInfo | undefined,
  ): Promise<IQuotaAndUsage> {
    const defaultQuota = { quota: 0, storage: 0 };
    if (!user) return defaultQuota;

    try {
      const infos = await this.http.get<IQuotaAndUsage>(
        `/workspace/quota/user/${user?.userId}`,
      );
      return infos;
    } catch (error) {
      console.error(error);
      return defaultQuota;
    }
  }

  async getCurrentLanguage(
    user: IUserInfo | undefined,
  ): Promise<string | undefined> {
    const isUserSignin = user?.sessionMetadata && user?.sessionMetadata.userId;

    try {
      let response;

      if (isUserSignin) {
        response = await this.loadUserLanguage();
      } else {
        response = await this.loadDefaultLanguage();
      }
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  private async loadUserLanguage(): Promise<string> {
    try {
      // don't cache preference it could change
      const response = await this.http.get<{ preference: any }>(
        '/userbook/preference/language',
      );
      return JSON.parse(response.preference)['default-domain'];
    } catch (error) {
      const response = await this.loadDefaultLanguage();
      return response;
    }
  }

  private async loadDefaultLanguage(): Promise<string> {
    // locale does not change until onLogout
    const response = await this.cache.httpGetJson<{ locale: string }>(
      '/locale',
    );
    return response.locale;
  }

  public async getUser(): Promise<IUserInfo | undefined> {
    // session does not change until onLogout
    const { response, value } = await this.cache.httpGet<IUserInfo>(
      '/auth/oauth2/userinfo',
    );
    if (
      !(response.status < 200 || response.status >= 300) &&
      typeof value === 'object'
    ) {
      return value;
    } else {
      // Utilisateur non-connecté.
      // /!\ WARNING /!\ ne pas modifier ce `throw` sous peine de casser
      // la redirection auto vers la page d'accueil, depuis une application React.
      throw ERROR_CODE.NOT_LOGGED_IN;
    }
  }

  hasWorkflow({
    workflowName,
    user,
  }: {
    workflowName: string;
    user: IUserInfo;
  }): boolean {
    return (
      workflowName === undefined ||
      user?.authorizedActions.findIndex((workflowRight) => {
        return workflowRight.name === workflowName;
      }) !== -1
    );
  }

  private async loadDescription(
    user: IUserInfo | undefined,
  ): Promise<Partial<IUserDescription>> {
    if (!user) return {};

    try {
      const [data, userbook] = await Promise.all([
        // FIXME The full user's description should be obtainable from a single endpoint in the backend.
        this.getUserProfile({
          options: { requestName: 'refreshAvatar' },
        }),
        this.http.get<IUserDescription>('/directory/userbook/' + user?.userId),
      ]);

      return { ...userbook, profiles: data };
    } catch (error) {
      console.error(error);
      return {};
    }
  }

  private async getBookmarks(user: IUserInfo | undefined) {
    // Not logged-in users have no bookmarks.
    if (!user) return [];

    const data = await this.http.get('/userbook/preference/apps');

    if (!data.preference) {
      data.preference = null;
    }

    const tmp = JSON.parse(data.preference) as Array<IWebApp>;
    let myApps: {
      bookmarks: Array<string>; // Array of app names
      applications: [];
    };

    myApps = tmp as unknown as { bookmarks: string[]; applications: [] };

    if (!myApps) {
      myApps = {
        bookmarks: [],
        applications: [],
      };
    }

    const bookmarkedApps: IWebApp[] = [];
    myApps.bookmarks.forEach((appName, index) => {
      const foundApp = (user?.apps || []).find(
        (app: IWebApp) => app.name === appName,
      );
      if (foundApp) {
        const app = Object.assign({}, foundApp);
        bookmarkedApps.push(app);
      }
    });

    return bookmarkedApps;
  }

  async getUserProfile(
    options: Partial<GetUserProfileOptions> = {},
  ): Promise<UserProfile> {
    const { options: httpOptions = {}, params = {} } = options;

    const queryParams = new URLSearchParams(params).toString();
    const url = `/userbook/api/person${queryParams ? `?${queryParams}` : ''}`;

    const { response, value } = await this.cache.httpGet<any>(url, httpOptions);
    if (
      response.status < 200 ||
      response.status >= 300 ||
      typeof value === 'string'
    ) {
      // Backend tries to redirect the user => not logged in !
      return ['Guest'];
    }
    return value?.result?.[0]?.type || ['Guest'];
  }

  public async isAdml(): Promise<boolean> {
    // session does not change until onLogout
    const user = await this.getUser();
    return user?.functions.ADMIN_LOCAL !== undefined;
  }

  /**
   * Get details of an application if the user can access it.
   * @return undefined if no access, or app not found
   */
  public async getWebApp(application: App): Promise<IWebApp | undefined> {
    const user = await this.getUser();
    return user?.apps.find((app) => {
      if (app?.prefix) {
        return app?.prefix.replace('/', '') === application || false;
      } else if (app?.address) {
        return app.address?.split('/')[1] === application || false;
      }
      return false;
    });
  }
}
