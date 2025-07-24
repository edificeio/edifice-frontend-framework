import { DataServiceProps, IDataService, IEventBroker } from './interface';
import { WebBroker } from './WebBroker';
import { App } from '../globals';
import { EVENT_NAME, IDataTrackEvent, LAYER_NAME } from '../notify/interfaces';
import { IOdeServices } from '../services/OdeServices';
import { IUserInfo, UserProfile } from '../session/interfaces';

/** A data event. */
type IDataEvent = IDataTrackEvent['data'];

/** Public conf of an app with a DataService activated. See backend /conf/public */
export interface PublicConfForDataService {
  'data-service'?: DataServiceProps;
}

export class DataService implements IDataService {
  private _webBroker?: IEventBroker;
  private app?: App;
  private user?: IUserInfo;
  private profile?: UserProfile;

  constructor(private odeServices: IOdeServices) {}

  private get conf() {
    return this.odeServices.conf();
  }
  private get notify() {
    return this.odeServices.notify();
  }

  // This method is called once, by the service container.
  public async initialize() {
    try {
      // Wait for the app to initialize
      const { app } = await this.notify.onAppConfReady().promise;
      this.app = app;
      this.user = await this.odeServices.session().getUser();
      this.profile = await this.odeServices.session().getUserProfile();

      // Instanciate a data broker depending on the current app conf, when known.
      const { ['data-service']: params } =
        await this.conf.getPublicConf<PublicConfForDataService>(app);
      this._webBroker = new WebBroker(this.odeServices).initialize(params?.web);
    } catch {
      console.log('DataService not initialized, usage data unavailable.');
    }
  }

  //FIXME When to call that ??
  public predestroy() {
    if (this._webBroker) {
      this._webBroker.destroy();
      delete this._webBroker;
    }
  }

  /** Send a web-user-level event to the data pipeline. */
  private trackWebEvent(event: IDataEvent) {
    this.notify.events().publish(LAYER_NAME.WEB_DATA, {
      name: EVENT_NAME.DATA_TRACKED,
      data: event,
    });
  }

  private addUserInfos(base: IDataEvent) {
    if (this.user) {
      base['userId'] = this.user.userId;
      base['structure'] = this.user.structureNames[0];
    }
    if (this.profile) base['profil'] = this.profile[0];
    return base;
  }

  public trackVideoSave(
    video_id: string,
    duration: number,
    weight: number,
    isCaptation: boolean,
    url: string,
    browser: string,
    deviceType?: string,
  ) {
    const eventData = this.addUserInfos({
      'event-type': 'VIDEO_SAVE',
      'module': this.app || 'video',
      video_id,
      browser,
      'duration': Math.round(duration),
      'weight': weight,
      'source': isCaptation ? 'CAPTURED' : 'UPLOADED',
      url,
    });
    if (deviceType) eventData['device_type'] = deviceType;

    this.trackWebEvent(eventData);
  }

  public trackVideoRead(
    video_id: string,
    isCaptation: boolean,
    url: string,
    browser: string,
    deviceType?: string,
  ) {
    const eventData = this.addUserInfos({
      'event-type': 'VIDEO_READ',
      'module': 'video',
      video_id,
      browser,
      'source': isCaptation ? 'CAPTURED' : 'UPLOADED',
      url,
    });
    if (this.app) eventData['override-module'] = this.app;
    if (deviceType) eventData['device_type'] = deviceType;

    this.trackWebEvent(eventData);
  }

  public trackSpeechAndText(direction: 'STT' | 'TTS') {
    const eventData = this.addUserInfos({
      'event-type': 'SPEECH_AND_TEXT',
      'function': direction,
    });
    if (this.app) eventData['module'] = this.app;

    this.trackWebEvent(eventData);
  }

  public trackAccessLibraryFromExplorer() {
    const eventData = this.addUserInfos({
      'event-type': 'ACCESS_LIBRARY_FROM_EXPLORER',
    });
    if (this.app) eventData['module'] = this.app;

    this.trackWebEvent(eventData);
  }
}
