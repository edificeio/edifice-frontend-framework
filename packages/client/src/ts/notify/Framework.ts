import { IGetConf, ITheme, IThemeOverrides } from '../configure/interfaces';
import { IUserInfo } from '../session/interfaces';
import { Subject } from './Subject';
import {
  INotifyFramework,
  IPromisified,
  ISubject,
  ISubjectMessage,
} from './interfaces';

type PromiseRegistry = { [name: string]: Promisified<any> };

const ASYNC_DATA_NAME = {
  SESSION_READY: 'sessionReady',
  LANG_READY: 'langReady',
  SKIN_READY: 'skinReady',
  OVERRIDE_READY: 'overrideReady',
  APPCONF_READY: 'appConfReady',
} as const;

/** Utility class */
//-------------------------------------
export class Promisified<T> implements IPromisified<T> {
  //-------------------------------------
  private _resolution?: (value: T | PromiseLike<T>) => void;
  private _rejection?: (reason?: any) => void;
  private _promise = new Promise<T>((_resolve, _reject) => {
    this._resolution = _resolve;
    this._rejection = _reject;
  });
  get promise(): Promise<T> {
    return this._promise;
  }
  resolve(value: T | PromiseLike<T>) {
    this._resolution && this._resolution(value);
  }
  reject(reason?: any) {
    this._rejection && this._rejection(reason);
  }
}

/** The notify framework implementation. */
//-------------------------------------
class NotifyFramework implements INotifyFramework {
  //-------------------------------------
  private promises: PromiseRegistry = {};
  private subject = new Subject<ISubjectMessage>();

  private asyncData<U>(asyncDataName: string): Promisified<U> {
    if (typeof this.promises[asyncDataName] === 'undefined') {
      this.promises[asyncDataName] =
        new Promisified<U>() as unknown as Promisified<any>;
    }
    return this.promises[asyncDataName] as unknown as Promisified<U>;
  }

  public onSessionReady(): IPromisified<IUserInfo> {
    return this.asyncData<IUserInfo>(ASYNC_DATA_NAME.SESSION_READY);
  }

  public onLangReady(): IPromisified<string> {
    return this.asyncData<string>(ASYNC_DATA_NAME.LANG_READY);
  }

  public onSkinReady(): Promisified<ITheme> {
    return this.asyncData<ITheme>(ASYNC_DATA_NAME.SKIN_READY);
  }

  public onOverridesReady(): Promisified<IThemeOverrides> {
    return this.asyncData<IThemeOverrides>(ASYNC_DATA_NAME.OVERRIDE_READY);
  }

  public onAppConfReady(): Promisified<IGetConf> {
    return this.asyncData<IGetConf>(ASYNC_DATA_NAME.APPCONF_READY);
  }

  public promisify<T>(): IPromisified<T> {
    return new Promisified<T>();
  }

  public events<T extends ISubjectMessage>(): ISubject<T> {
    return this.subject as unknown as ISubject<T>;
  }
}

/** The whole framework is a singleton. */
export const notify = new NotifyFramework();
