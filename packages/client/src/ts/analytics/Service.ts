import { ParamsByTrackingSystem, XitiConf } from '../configure/Analytics';
import { configure } from '../configure/Framework';
import { IXitiTrackingParams } from '../configure/interfaces';
import { App, ERROR_CODE } from '../globals';
import { IOdeServices } from '../services/OdeServices';
import { IUserInfo, IWebApp, UserProfile } from '../session/interfaces';

declare let ATInternet: any;
let ATTag: any;

export class AnalyticsService {
  constructor(private context: IOdeServices) {}

  private get http() {
    return this.context.http();
  }

  private get session() {
    return this.context.session();
  }

  /**
   * Xiti tracker for page loading.
   * @param locationPath
   * @param app
   */
  public async trackPageLoad(locationPath: string, app: IWebApp) {
    const [xitiTrackingParams] = await Promise.all([
      // get Xiti configuration
      this.getXitiConfig(app.name.toLowerCase() as App),
      // load Xiti javascript file
      this.loadXitiScript(),
    ]);
    if (!xitiTrackingParams) return;
    if (!ATInternet) return;

    // SERVICE
    let SERVICE = xitiTrackingParams.LIBELLE_SERVICE.default || null;
    for (const prop in xitiTrackingParams.LIBELLE_SERVICE) {
      if (prop !== 'default' && locationPath.indexOf(prop) >= 0) {
        SERVICE = xitiTrackingParams.LIBELLE_SERVICE[prop];
        break;
      }
    }
    ATTag = new ATInternet.Tracker.Tag({ site: xitiTrackingParams.STRUCT_ID });
    ATTag.setProps(
      {
        SERVICE: SERVICE,
        TYPE: xitiTrackingParams.TYPE,
        OUTIL: xitiTrackingParams.OUTIL,
        UAI: xitiTrackingParams.STRUCT_UAI,
        PROJET: xitiTrackingParams.PROJET,
        EXPLOITANT: xitiTrackingParams.EXPLOITANT,
        PLATEFORME: xitiTrackingParams.PLATFORME,
        PROFIL: xitiTrackingParams.PROFILE,
      },
      true,
    );
    ATTag.identifiedVisitor.set({
      id: xitiTrackingParams.ID_PERSO,
      category: xitiTrackingParams.PROFILE,
    });
    ATTag.page.set({
      name: app?.prefix === 'userbook' ? 'directory' : app?.prefix,
      chapter1: '',
      chapter2: '',
      chapter3: '',
      level2: xitiTrackingParams.STRUCT_UAI,
    });
    ATTag.dispatch();
  }

  private async getXitiConfig(
    app: App,
  ): Promise<IXitiTrackingParams | undefined> {
    const [analyticsConf, xitiConfig] = await Promise.all([
      this.http.get<ParamsByTrackingSystem>('/analyticsConf'),
      //FIXME change servers config to only keep the "all-in-one" query to /analyticsConf.
      this.http.get<XitiConf>('/xiti/config'),
    ]);

    if (!analyticsConf?.type) {
      // Data seems corrupted
      throw ERROR_CODE.MALFORMED_DATA;
    }

    if (xitiConfig?.active) {
      // Add XiTi config to the resulting object, if active.
      analyticsConf.xiti = await this.getXitiTrackingParams(xitiConfig, app);
    }

    return analyticsConf.xiti;
  }

  private async loadXitiScript() {
    if (typeof ATInternet === 'undefined') {
      const scriptPath = '/xiti/public/js/lib/smarttag_ENT.js';
      const response = await this.http.get<string>(scriptPath, {
        headers: { Accept: 'application/javascript' },
      });
      if (this.http.latestResponse.status != 200) {
        throw 'Error while loading XiTi script';
      }
      eval(response);
    }
  }

  private async getXitiTrackingParams(
    xitiConf: XitiConf,
    app: App,
  ): Promise<IXitiTrackingParams | undefined> {
    if (!xitiConf.structureMap || !app) return;

    const user: IUserInfo | undefined = await this.session.getUser();
    const userProfile: UserProfile = await this.session.getUserProfile();

    let structure;
    if (!user?.structures) return;

    for (const struc of user.structures) {
      const s = xitiConf.structureMap[struc];
      if (s && s.collectiviteId && s.UAI) {
        structure = s;
        break;
      }
    }
    if (!structure || !structure.active) return;
    const appConf = await configure.Platform.apps.getPublicConf(app);
    if (!appConf) return;
    const appXitiConf = appConf.xiti;
    if (!appXitiConf) return;
    if (!appXitiConf.LIBELLE_SERVICE) return;
    if (!structure.UAI) return; // Keeps the transpiler happy

    // ID_PERSO
    function pseudonymization(stringId: string): string {
      let buffer = '';
      for (let i = 0; i < stringId.length; i++) {
        buffer += stringId.charCodeAt(i);
      }
      return buffer;
    }

    // PROFIL
    const profileMap = {
      Student: 'ELEVE',
      Teacher: 'ENSEIGNANT',
      Relative: 'PARENT',
      Personnel: 'ADMIN_VIE_SCOL_TECH',
      Guest: 'AUTRE',
    };

    return {
      LIBELLE_SERVICE: appXitiConf.LIBELLE_SERVICE, // Which property of LIBELLE_SERVICE to use depends on the frontend.
      TYPE: appXitiConf.OUTIL ? 'TIERS' : 'NATIF',
      OUTIL: appXitiConf.OUTIL ? appXitiConf.OUTIL : '',
      STRUCT_ID: structure.collectiviteId,
      STRUCT_UAI: structure.UAI,
      PROJET: structure.projetId ? structure.projetId : xitiConf.ID_PROJET,
      EXPLOITANT: xitiConf.ID_EXPLOITANT,
      PLATFORME: structure.plateformeId
        ? structure.plateformeId
        : xitiConf.ID_PLATEFORME,
      ID_PERSO: pseudonymization(user.userId),
      PROFILE:
        userProfile && userProfile.length > 0
          ? (profileMap[userProfile[0]] ?? '')
          : '',
    };
  }
}
