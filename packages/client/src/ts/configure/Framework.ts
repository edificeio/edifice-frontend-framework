import { IConfigurationFramework } from './interfaces';
import { Theme } from './Theme';
import { Idiom } from '../idiom/Idiom';
import { User } from './User';
import { AppConf } from './AppConf';
import { transport } from '../transport/Framework';
import { Analytics } from './Analytics';
import { notify } from '../notify/Framework';
import { setDeviceCookies } from '../utilities/deviceDetection';

//-------------------------------------
export class ConfigurationFramework implements IConfigurationFramework {
  //-------------------------------------
  readonly Platform = {
    deploymentTag: '',
    cdnDomain: '',
    apps: new AppConf(),
    theme: new Theme(),
    analytics: new Analytics(),
    idiom: new Idiom(),
    listLanguages: () => {
      return transport.http.get('/languages');
    },
  };
  readonly School = {
    //apps; -> pinnedApps;
  };
  readonly User = new User();

  constructor() {
    // detect device info and set cookies (needed for stats)
    setDeviceCookies();
  }

  async initialize(
    version?: string | null,
    cdnDomain?: string | null,
  ): Promise<void> {
    // If version is undefined, default to a new tag every day.
    if (!version) {
      const padWith0 = (val: number): string =>
        (val < 10 ? '0' : '') + val.toFixed(0);
      const now = new Date();
      const y = now.getFullYear();
      const m = now.getMonth() + 1;
      const d = now.getDate();
      version = `${y}${padWith0(m)}${padWith0(d)}`; //FIXME add ${h.toFixed(0)} to change the tag every 10 minutes
    }
    const v = version;
    this.Platform.deploymentTag = version;

    // Don't overwrite the CDN domain with a null or empty value.
    if (typeof cdnDomain === 'string' && cdnDomain.length > 0) {
      this.Platform.cdnDomain = cdnDomain;
    }
    transport.http.setCdn(this.Platform.cdnDomain);
    //
    await Promise.all([
      this.Platform.theme.initialize(v),
      notify
        .onSessionReady()
        .promise.then((userInfo) =>
          this.Platform.idiom.addBundlePromise('/i18n'),
        ),
      //TODO this.School.initialize( v ),
      this.User.initialize(v),
    ]);
  }

  // async mount(
  //   version?: string | null,
  //   cdnDomain?: string | null,
  // ): Promise<void> {
  //   // If version is undefined, default to a new tag every day.
  //   if (!version) {
  //     const padWith0 = (val: number): string =>
  //       (val < 10 ? "0" : "") + val.toFixed(0);
  //     const now = new Date();
  //     const y = now.getFullYear();
  //     const m = now.getMonth() + 1;
  //     const d = now.getDate();
  //     version = `${y}${padWith0(m)}${padWith0(d)}`; //FIXME add ${h.toFixed(0)} to change the tag every 10 minutes
  //   }
  //   const v = version;
  //   this.Platform.deploymentTag = version;

  //   // Don't overwrite the CDN domain with a null or empty value.
  //   if (typeof cdnDomain === "string" && cdnDomain.length > 0) {
  //     this.Platform.cdnDomain = cdnDomain;
  //   }
  //   transport.http.setCdn(this.Platform.cdnDomain);
  //   //
  //   await this.Platform.idiom.addBundlePromise("/i18n");
  // }
}

/** The whole framework is a singleton. */
export const configure: ConfigurationFramework = new ConfigurationFramework();
