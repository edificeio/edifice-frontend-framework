import { transport } from './Framework';

//-------------------------------------
export abstract class TransportFrameworkFactory {
  //-------------------------------------
  static instance(): ITransportFramework {
    return transport;
  }
}

//-------------------------------------
export interface ITransportFramework {
  //-------------------------------------
  /** Default instance. */
  readonly http: IHttp;

  /**
   * Creates a new IHttp object with a custom configuration;
   * @param params see available options at https://axios-http.com/docs/req_config
   */
  newHttpInstance(params?: any): IHttp;
}

//-------------------------------------
export interface IHttp {
  //-------------------------------------
  /** Latest available HTTP response, valid during your get|post|put...then() and catch() handlers. */
  readonly latestResponse: IHttpResponse;

  /** Check if HTTP status of latestResponse is <200 or >=300 */
  isResponseError(): boolean;

  /** HTTP GET Accept: application/json */
  get<R = any>(url: string, params?: IHttpParams): Promise<R>;

  /** HTTP POST, Accept: application/json */
  post<R = any>(url: string, data?: any, params?: IHttpParams): Promise<R>;

  /**
   * HTTP POST
   * @param data must be of one of the following types:
   * string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
   * Browser only: FormData, File, Blob
   * Node only: Stream, Buffer
   */
  postFile<R = any>(url: string, data: any, params?: IHttpParams): Promise<R>;

  /** HTTP POST, Accept: application/json, Content-type: application/json */
  postJson<T = any, R = any>(
    url: string,
    json: any,
    params?: IHttpParams,
  ): Promise<R>;

  /** HTTP PUT, Accept: application/json */
  put<T = any, R = any>(
    url: string,
    data?: any,
    params?: IHttpParams,
  ): Promise<R>;

  //    putFile<T=any,R=any>( url:string, data:FormData, opt?:any ): Promise<R>;

  /** HTTP PUT, Accept: application/json, Content-type: application/json */
  putJson<T = any, R = any>(
    url: string,
    json: any,
    params?: IHttpParams,
  ): Promise<R>;

  /** HTTP DELETE */
  delete<T = any, R = any>(url: string, params?: IHttpParams): Promise<R>;

  /** HTTP DELETE, Accept: application/json */
  deleteJson<T = any, R = any>(url: string, json: any): Promise<R>;

  /**
   * HTTP GET, Accept: application/javascript
   * @param exportedVariableName: unused at the moment.
   */
  getScript<R = any>(
    url: string,
    params?: IHttpParams,
    exportedVariableName?: string,
  ): Promise<R>;

  /** HTTP GET, Accept: application/javascript */
  loadScript(url: string, params?: IHttpParams): Promise<void>;

  setCdn(url: string): void;
}

export type IHttpParamsResponseType =
  | 'arraybuffer'
  | 'blob'
  | 'document'
  | 'json'
  | 'text'
  | 'stream';

//-------------------------------------
export type IHttpParams = {
  //-------------------------------------
  /** Request the API to send a notification when done. */
  readonly requestName?: string;
  /** Set to true to prevent sending notifications. */
  readonly disableNotifications?: boolean;
  /** HTTP headers to apply to the request. */
  readonly headers?: { [key: string]: /*value*/ string };
  /** Object to serialize as query parameters and append to the request URL. */
  readonly queryParams?: { [key: string]: /*value*/ any };
  /** Response Type */
  readonly responseType?: IHttpParamsResponseType;

  //readonly matrixParams: {[key:string]: /*value*/any;}; // TODO maybe later ?
};

//-------------------------------------
export type IHttpResponse = {
  //-------------------------------------
  status: number;
  statusText: string;
  headers?: any;
};
