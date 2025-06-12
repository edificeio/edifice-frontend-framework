import {
  AnalyticStatus,
  IXitiTrackingParams,
  IMatomoTrackingParams,
  ITrackingParams,
  TrackingType,
} from './interfaces';
import { transport } from '../transport/Framework';
import { ERROR_CODE, IPromisified } from '..';
import { session } from '../session/Framework';
import { notify } from '../notify/Framework';
import { configure } from './Framework';

export type ParamsByTrackingSystem = {
  type: 'none' | 'internal' | 'matomo' | 'multiple';
  internal?: ITrackingParams;
  matomo?: IMatomoTrackingParams;
  xiti?: IXitiTrackingParams;
};

// 2021 implementation of XiTi
export type XitiConf = {
  //Springboard constants
  ID_EXPLOITANT: string; //"ODE"
  ID_PLATEFORME: string; //"OPEN_ENT_NG/ONE/NEO"
  ID_PROJET: string; //"RECETTE_ODE"

  //Xiti conf
  active: boolean;
  config: boolean;
  structureMap?: {
    [structureId: string]: {
      UAI?: string; //"1234567Z"
      active: boolean;
      collectiviteId?: number;
      plateformeId?: any;
      projetId?: any;
    };
  };
};

//-------------------------------------
export class Analytics {
  //-------------------------------------
  private _status: AnalyticStatus = 'void';
  private _params?: IPromisified<ParamsByTrackingSystem>;

  get status(): AnalyticStatus {
    return this._status;
  }

  xiti(): Promise<IXitiTrackingParams | undefined> {
    // XiTi does not implement ITrackingParams but behaves like it does.
    return this.parametersWithCheck('xiti' as TrackingType, false) as Promise<
      IXitiTrackingParams | undefined
    >;
  }

  parameters<T extends ITrackingParams>(
    type: TrackingType,
  ): Promise<T | undefined> {
    return this.parametersWithCheck<T>(type, true);
  }

  private async parametersWithCheck<T extends ITrackingParams>(
    type: TrackingType,
    checkType: boolean,
  ): Promise<T | undefined> {
    return this.initialize().promise.then((params) => {
      return !checkType || params.type === type || params.type === 'multiple'
        ? (params[type] as T)
        : undefined;
    });
  }

  /**
   * This method loads the conf and waits for the user session to start.
   * It can be called ASAP, but it will be automatically called if needed.
   * @returns A promise of the end of the init process (it may throw errors)
   * @throws ERROR_CODE.MALFORMED_DATA when config cannot be read.
   */
  private initialize(): IPromisified<ParamsByTrackingSystem> {
    if (!this._params) {
      this._params = notify.promisify<ParamsByTrackingSystem>();
      this._status = 'pending';
      Promise.all([
        transport.http.get<ParamsByTrackingSystem>('/analyticsConf'),
        //FIXME change servers config to only keep the "all-in-one" query to /analyticsConf.
        transport.http.get<XitiConf>('/xiti/config'),
      ])
        .then(async (tuple) => {
          // Sanitize results
          // FIXME what to do with type "multiple" ?
          if (!tuple || !tuple[0] || !tuple[0].type) {
            // Data seems corrupted
            throw ERROR_CODE.MALFORMED_DATA;
          }

          // Add XiTi config to the resulting object, if active.
          if (tuple[1] && tuple[1].active) {
            tuple[0].xiti = await this.initializeXiti(tuple[1]);
          }

          this._params?.resolve(tuple[0]);
          this._status = 'ready';
        })
        .catch((e) => {
          this._status = 'failed';
          this._params?.reject();
          throw e;
        });
    }
    return this._params;
  }

  /** 2021 implementation of XiTi. */
  private async initializeXiti(
    xitiConf: XitiConf,
  ): Promise<IXitiTrackingParams | undefined> {
    if (!xitiConf.structureMap || !configure.Platform.apps.currentApp) return;

    const me = await notify.onSessionReady().promise;
    const desc = session.session.description;

    let structure;
    for (const struc of me.structures) {
      const s = xitiConf.structureMap[struc];
      if (s && s.collectiviteId && s.UAI) {
        structure = s;
        break;
      }
    }
    if (!structure || !structure.active) return;

    const appConf = await configure.Platform.apps.getPublicConf(
      configure.Platform.apps.currentApp,
    );
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
      ID_PERSO: pseudonymization(me.userId),
      PROFILE:
        desc.profiles && desc.profiles.length > 0
          ? (profileMap[desc.profiles[0]] ?? '')
          : '',
    };
  }
}
