import { Http } from './Http';
import { IHttp, ITransportFramework } from './interfaces';

class TransportFramework implements ITransportFramework {
  private _http = new Http();

  get http(): IHttp {
    return this._http;
  }

  newHttpInstance(params?: any): IHttp {
    return new Http(params);
  }
}

/** The whole framework is a singleton. */
export const transport: TransportFramework = new TransportFramework();
