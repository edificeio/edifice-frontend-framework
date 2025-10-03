import { notify } from '../notify/Framework';
import { session } from '../session/Framework';
import { transport } from '../transport/Framework';
import { configure } from './Framework';
import {
  ITheme,
  IThemeConf,
  IThemeDesc,
  IThemeOverrides,
  IThemeConfOverriding,
} from './interfaces';

export class Theme implements ITheme {
  private _conf?: IThemeConf;
  private _loaded?: Promise<void>;

  // legacy (readonly)
  skinName = '';
  themeName = '';
  skin = 'raw';
  themeUrl = '/assets/themes/raw/default/';
  templateOverrides: IThemeOverrides = {};
  portalTemplate = '/assets/themes/raw/portal.html';
  basePath = '';
  logoutCallback = '';
  skins: Array<IThemeConfOverriding> = [];

  is1D = false;
  is2D = false;

  initialize(version?: string) {
    return notify.onSessionReady().promise.then(() => this.load(version));
  }

  private get version(): string {
    return configure.Platform.deploymentTag;
  }

  private get cdnDomain(): string {
    return configure.Platform.cdnDomain;
  }

  async onFullyReady(): Promise<ITheme> {
    await this._loaded;
    return this;
  }

  private _onSkinReady = notify.onSkinReady();
  onSkinReady(): Promise<ITheme> {
    return this._onSkinReady.promise;
  }
  private _onOverrideReady = notify.onOverridesReady();
  onOverrideReady(): Promise<IThemeOverrides> {
    return this._onOverrideReady.promise;
  }

  async getConf(version?: string): Promise<IThemeConf> {
    this._conf =
      this._conf ??
      (await transport.http.getScript<IThemeConf>(
        '/assets/theme-conf.js',
        { queryParams: { v: version ?? this.version } },
        'exports.conf',
      ));
    return this._conf;
  }

  load(version?: string): Promise<void> {
    version = version ?? this.version;
    if (!this._loaded) {
      this._loaded = (
        session.session.notLoggedIn
          ? this.loadDisconnected(version)
          : this.loadConnected(version)
      ).then(async () => {
        // List skins to determine if current theme is 1D or 2D.
        const skins = await this.listSkins();
        this.is1D =
          skins.find((s) => s.child === this.skin)?.parent === 'panda';
        this.is2D =
          skins.find((s) => s.child === this.skin)?.parent === 'theme-open-ent';
      });
    }
    return this._loaded;
  }

  private loadDisconnected(version: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      transport.http
        .get('/skin', { queryParams: { v: this.version } })
        .then((data) => {
          this.skin = data.skin;
          this.themeUrl = `${this.cdnDomain}/assets/themes/${data.skin}/skins/default/`;
          this.basePath = this.themeUrl + '../../';
          this._onSkinReady.resolve(this);
          transport.http
            .get(`/assets/themes/${data.skin}/template/override.json`, {
              disableNotifications: true,
              queryParams: { v: version },
            })
            .then((override) => {
              this.templateOverrides = override;
              this._onOverrideReady.resolve(override);
              resolve();
            })
            .catch((e) => {
              if (transport.http.latestResponse.status === 404) {
                resolve();
              } else {
                throw e;
              }
            });
        })
        .catch((e) => {
          this._onSkinReady.reject(e);
          this._onOverrideReady.reject(e);
          reject();
        });
    });
  }

  private loadConnected(version: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.loadDefaultTheme(version).then(() => {
        this._onSkinReady.resolve(this);
        transport.http
          .get(`/assets/themes/${this.skin}/template/override.json`, {
            disableNotifications: true,
            queryParams: { v: version },
          })
          .then((override) => {
            this.templateOverrides = override;
            this._onOverrideReady.resolve(override);
            resolve();
          })
          .catch((e) => {
            if (transport.http.latestResponse.status === 404) {
              resolve();
              this._onSkinReady.reject(e); // FIXME semble mal placé car a peut-être déjà été résolu !
              this._onOverrideReady.reject(e);
            } else {
              throw e;
            }
          });
      });
    });
  }

  /** Load the user's configured theme. */
  private async loadDefaultTheme(version: string) {
    if (!session.session.notLoggedIn) {
      return transport.http
        .get('/theme', { queryParams: { _: version } })
        .then((data) => {
          this.skinName = data.skinName;
          this.themeName = data.themeName;
          this.themeUrl = data.skin;
          this.basePath = `${this.cdnDomain}${this.themeUrl}../../`;
          this.skin = this.themeUrl.split('/assets/themes/')[1].split('/')[0];
          this.portalTemplate = `${this.cdnDomain}/assets/themes/${this.skin}/portal.html`;
          this.logoutCallback = data.logoutCallback;
        });
    }
    return Promise.reject();
  }

  listThemes(): Promise<IThemeDesc[]> {
    return transport.http.get<IThemeDesc[]>('/themes');
  }

  async setDefaultTheme(theme: IThemeDesc) {
    await transport.http.get(
      '/userbook/api/edit-userbook-info?prop=theme-' +
        this.skin +
        '&value=' +
        theme._id,
    );
    await this.loadDefaultTheme(this.version);
  }

  listSkins(): Promise<IThemeConfOverriding[]> {
    return this.skins.length > 0
      ? Promise.resolve(this.skins)
      : this.getConf().then((conf) => {
          const currentTheme = conf.overriding.find(
            (t) => t.child === this.skin,
          );
          if (currentTheme?.group) {
            this.skins = this.skins.concat(
              conf.overriding.filter((t) => t.group === currentTheme.group),
            );
          } else {
            this.skins = this.skins.concat(conf.overriding);
          }
          return this.skins;
        });
  }

  async getHelpPath(): Promise<string> {
    const overrides = await this.listSkins();
    const override = overrides.find((t) => t.child === this.skin);
    return override?.help ?? '/help';
  }
}

/*
let _skinResolved, _skinRejected = null;
export var skin = {
	private addDirectives: undefined as any,
	private templateMapping: {},

	themeConf: undefined,
	themeConfPromise: undefined,
	loadBookmarks: async function(){
		return new Promise<void>((resolve, reject) => {
			http().get('/userbook/preference/apps').done(function(data){
				if(!data.preference){
					data.preference = null;
				}
				model.me.myApps = JSON.parse(data.preference);
				if (_.isArray(model.me.myApps)) {
					model.me.bookmarkedApps = model.me.myApps;
					model.me.myApps = {
						bookmarks: _.map(model.me.myApps, app => app.name),
						applications: []
					}
					http().putJson('/userbook/preference/apps', model.me.myApps);
					resolve();
					return;
				}
				if (!model.me.myApps){
					model.me.myApps = {
						bookmarks: [],
						applications: []
					}
				}
				model.me.bookmarkedApps = [];
				var upToDate = true;
				let remove = [];
				model.me.myApps.bookmarks.forEach(function(appName, index){
					var foundApp = _.findWhere(model.me.apps, { name: appName });
					if(foundApp){
						var app = {};
						for(var property in foundApp){
							app[property] = foundApp[property];
						}
						model.me.bookmarkedApps.push(app);
					}
					else{
						remove.push(appName);
						upToDate = false;
					}
				});
				remove.forEach(function(app) {
					var index = model.me.myApps.bookmarks.indexOf(app);
					model.me.myApps.bookmarks.splice(index, 1);
				});
				if(!upToDate){
					http().putJson('/userbook/preference/apps', model.me.myApps);
				}
				resolve();
			});
		});
	},
	loadConnected: async function(): Promise<any>{
		const rand = Math.random();
		const that = this;
		return new Promise<void>((resolve, reject) => {
			http().get('/theme').done(function(data){
				that.skinName = data.skinName;
				that.themeName = data.themeName;
				that.theme = data.skin;
				that.basePath = (window as any).CDN_DOMAIN + that.theme + '../../';
				that.skin = that.theme.split('/assets/themes/')[1].split('/')[0];
				that.portalTemplate = (window as any).CDN_DOMAIN + '/assets/themes/' + that.skin + '/portal.html';
				that.logoutCallback = data.logoutCallback;
				skin.skinResolveFunc();
				http().get('/assets/themes/' + that.skin + '/template/override.json', { token: rand }).done(function(override){
					that.templateMapping = override;
					if (window.entcore.template) {
						window.entcore.template.loadPortalTemplates();
					}
					resolve();
				})
				.e404(() => { 
					resolve(); 
					skin.skinRejectedFunc();
				});
			});
		});
	},
};
*/

/*
    export const themeService = {
        loadOldWrappedTheme(oldTheme:string, skinName:string){
            let version = 'dev';
            if((window as any).springboardBuildDate){
                version = (window as any).springboardBuildDate;
            }
            jQuery("#themeOld").remove();
            const style = jQuery('<link>', {
                rel: 'stylesheet',
                type: 'text/css',
                href: (window as any).CDN_DOMAIN+`/assets/themes/${oldTheme}/skins/${skinName}/wrapped.theme.css?version=${version}`,
                id: 'themeOld'
            }).attr("crossorigin", "anonymous");
            jQuery('head').append(style);
        },
        loadThemeJs(theme:string){
            let version = 'dev';
            if((window as any).springboardBuildDate){
                version = (window as any).springboardBuildDate;
            }
            jQuery("#themeJS").remove();
            const style = jQuery('<script>', {
                type: 'text/javascript',
                src: (window as any).CDN_DOMAIN+`/assets/themes/${theme}/js/theme.js?version=${version}`,
                id: 'themeJS'
            });
            jQuery('body').append(style);
        }
    }
*/
