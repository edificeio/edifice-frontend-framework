/* eslint-disable prefer-rest-params */
import axios, {
  AxiosError,
  AxiosInstance,
  // AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { ConfigurationFrameworkFactory } from '..';
import { ERROR_CODE } from '../globals';
import { IHttp, IHttpParams, IHttpResponse } from './interfaces';

const loadedScripts: { [url: string]: boolean } = {};

export class Http implements IHttp {
  // Axios automatically manages the XSRF-TOKEN cookie and the X-XSRF-TOKEN HTTP header.
  private axios: AxiosInstance;

  private _latestResponse: any;

  constructor(params?: any) {
    this.axios = axios.create(params);
  }

  setCdn(cdnUrl: string): void {
    if (
      cdnUrl &&
      XMLHttpRequest &&
      !(XMLHttpRequest.prototype as any)['cdnUrl']
    ) {
      (XMLHttpRequest.prototype as any)['cdnUrl'] = cdnUrl;
      (XMLHttpRequest.prototype as any).baseOpen =
        XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function () {
        const url = arguments[1] as string;
        //PUBLIC infra
        if (url.startsWith('/infra/public')) {
          arguments[1] = cdnUrl + url;
        }
        //PUBLIC files (/.*/public)
        // eslint-disable-next-line no-useless-escape
        const match = /^\/([^\/]*)\/public/.test(url);
        if (match) {
          arguments[1] = cdnUrl + url;
        }
        //ASSETS files
        if (url.startsWith('/assets')) {
          arguments[1] = cdnUrl + url;
        }
        //SKIP PUBLIC CONF
        if (url == '/conf/public') {
          arguments[1] = url;
        }
        //SKIP HTTP
        if (url.startsWith('http')) {
          arguments[1] = url;
        }
        return (this as any).baseOpen.apply(this, arguments);
      };
    }
  }

  // private toAxiosConfig(params?: IHttpParams): AxiosRequestConfig {
  private toAxiosConfig(params?: IHttpParams): any {
    if (!params) {
      return this.axios.defaults;
    } else {
      const p = Object.assign({}, this.axios.defaults);

      if (params.headers) {
        if (p.headers)
          p.headers = Object.assign({}, this.axios.defaults.headers);
        Object.assign(p.headers, params.headers);
      }

      if (params.responseType) {
        p.responseType = params.responseType;
      }

      if (params.queryParams) {
        // Axios will serialize parameters, see https://github.com/axios/axios#request-config
        p.params = Object.assign({}, params.queryParams);
      }

      /* TODO : manage params.requestName through an events[]. See infra-front http.ts */

      return p;
    }
  }

  private toCdnUrl(url: string) {
    const CDN_DOMAIN: string | undefined =
      ConfigurationFrameworkFactory.instance().Platform.cdnDomain;
    // If CDN domain is defined, and requested url is not /public/conf (SKIP PUBLIC CONF)
    if (CDN_DOMAIN?.length > 0 && url !== '/conf/public') {
      const originalURL = '' + url;
      //PUBLIC infra or ASSETS files
      if (
        originalURL.startsWith('/infra/public') ||
        originalURL.startsWith('/assets')
      ) {
        url = CDN_DOMAIN + originalURL;
      } else {
        //PUBLIC files (/.*/public)
        // eslint-disable-next-line no-useless-escape
        const match = /^\/([^\/]*)\/public/.test(originalURL);
        if (match) {
          url = CDN_DOMAIN + originalURL;
        }
      }
    }
    return url;
  }

  private mapAxiosError<R>(error: AxiosError<R>, params?: IHttpParams): R {
    // AxiosError.response and our HttpResponse share the same properties.
    // So we can use it directly, saving CPU and memory.
    // Otherwise, we would map the axios response to our own model.
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      this._latestResponse = error.response;
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      this._latestResponse = {
        status: 408,
        statusText: ERROR_CODE.TIME_OUT,
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      this._latestResponse = {
        status: 500,
        statusText: ERROR_CODE.UNKNOWN,
      };
    }

    /* TODO : manage params.requestName through an events[]. See infra-front http.ts */

    // Notify error unless disabled.
    if (!params || params.disableNotifications === false) {
      // FIXME This really should be an rxjs Subject
      // notify.onEvent( EVENT_NAME.HTTP_ERROR ).next( new HttpErrorNotice(''+this._latestResponse.status, this._latestResponse.statusText) );
    }

    return this._latestResponse;
  }

  private mapAxiosResponse<R>(
    response: AxiosResponse<R>,
    params?: IHttpParams,
  ): R {
    // AxiosResponse and our HttpResponse share the same properties.
    // So we can use it directly, saving CPU and memory.
    // Otherwise, we would map the axios response to our own model.
    this._latestResponse = response;
    /* TODO : manage params.requestName through an events[]. See infra-front http.ts */
    //FIXME: should we check response.status and only accept if range is 2xx ?
    return response.data;
  }

  get latestResponse(): IHttpResponse {
    return this._latestResponse;
  }

  isResponseError(): boolean {
    return (
      this.latestResponse.status < 200 || this.latestResponse.status >= 300
    );
  }

  get<R = any>(url: string, params?: IHttpParams): Promise<R> {
    return this.axios
      .get<R>(this.toCdnUrl(url), this.toAxiosConfig(params))
      .then((r) => this.mapAxiosResponse(r, params))
      .catch<R>((e) => this.mapAxiosError(e, params));
  }
  post<R = any>(url: string, data?: any, params?: IHttpParams): Promise<R> {
    return this.axios
      .post<R>(url, data, this.toAxiosConfig(params))
      .then((r) => this.mapAxiosResponse(r, params))
      .catch<R>((e) => this.mapAxiosError(e, params));
  }
  postFile<R = any>(url: string, data: any, params?: IHttpParams): Promise<R> {
    const p = this.toAxiosConfig(params);
    if (p.headers && p.headers['Content-Type']) {
      delete p.headers['Content-Type'];
    }
    return this.axios
      .post<R>(url, data, p)
      .then((r) => this.mapAxiosResponse(r, params))
      .catch<R>((e) => this.mapAxiosError(e, params));
  }
  postJson<R = any>(url: string, json: any, params?: IHttpParams): Promise<R> {
    const p = this.toAxiosConfig();
    if (p.headers) p.headers['Content-Type'] = 'application/json';
    return this.axios
      .post<R>(url, json, this.toAxiosConfig(params))
      .then((r) => this.mapAxiosResponse(r, params))
      .catch<R>((e) => this.mapAxiosError(e, params));
  }
  put<R = any>(url: string, data?: any, params?: IHttpParams): Promise<R> {
    return this.axios
      .put<R>(url, data, this.toAxiosConfig(params))
      .then((r) => this.mapAxiosResponse(r, params))
      .catch<R>((e) => this.mapAxiosError(e, params));
  }
  /*
    putFile(url: string, data:FormData, opt?:any) {
        //TODO
        return this.axios.putFile(url, data, opt).then( r => this.mapAxiosResponse(r,params));
    }
*/
  putJson<R = any>(url: string, json: any, params?: IHttpParams): Promise<R> {
    const p = this.toAxiosConfig(params);
    if (p.headers) p.headers['Content-Type'] = 'application/json';
    return this.axios
      .put<R>(url, json, p)
      .then((r) => this.mapAxiosResponse(r, params))
      .catch<R>((e) => this.mapAxiosError(e, params));
  }
  delete<R = any>(url: string, params?: IHttpParams): Promise<R> {
    return this.axios
      .delete<R>(url, this.toAxiosConfig(params))
      .then((r) => this.mapAxiosResponse(r, params))
      .catch<R>((e) => this.mapAxiosError(e, params));
  }
  deleteJson<R = any>(url: string, json: any): Promise<R> {
    return this.axios
      .delete<R>(url, { data: json })
      .then((r) => this.mapAxiosResponse(r))
      .catch<R>((e) => this.mapAxiosError(e));
  }

  getScript<R = any>(
    url: string,
    params?: IHttpParams,
    variableName?: string,
  ): Promise<R> {
    const resultName = variableName ?? 'exports';
    const p = this.toAxiosConfig(params);
    if (p.headers) p.headers['Accept'] = 'application/javascript';
    return this.axios
      .get<string>(this.toCdnUrl(url), p)
      .then((r) => this.mapAxiosResponse(r, params))
      .then((r) => {
        try {
          const securedScript = `"use strict";var ${
            resultName.split('.')[0]
          }={};${r};return ${resultName};`;
          const result = Function(securedScript)();
          return result;
        } catch (e) {
          const result = r;
          return result;
        }
      })
      .catch<R>((e) => {
        this.mapAxiosError(e, params);
        throw e;
      });
  }

  loadScript(url: string, params?: IHttpParams): Promise<void> {
    return loadedScripts[url]
      ? Promise.resolve()
      : this.getScript(url, params).then((res) => {
          loadedScripts[url] = true;
        });
  }
}

/*
var loadedScripts = {};

export class Http {
    statusCallbacks = {};

    serialize(obj:any) {
        var str = [];
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                if (obj[p] instanceof Array) {
                    for (var i = 0; i < obj[p].length; i++) {
                        if (typeof obj[p][i] === 'object') {
                            throw new TypeError("Arrays sent as URIs can't contain objects");
                        }
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p][i]))
                    }
                }
                else {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
            }
        }
        return str.join("&");
    }

    events: any = {
    };

    bind(eventName:string, handler:Function) {
        this.events[eventName] = handler;
    };

    parseUrl(path, item) {
        var matchParams = new RegExp(':[a-zA-Z0-9_.]+', "g");
        var params = path.match(matchParams);
        if (!params) {
            params = [];
        }
        var getProp = function (prop, obj) {
            if (prop.indexOf('.') === -1) {
                return obj[prop];
            }
            return getProp(prop.split('.').splice(1).join('.'), obj[prop.split('.')[0]])
        }
        params.forEach(function (param) {
            var prop = param.split(':')[1];

            var data = getProp(prop, item) || '';
            path = path.replace(param, data);
        });
        return path;
    };

    request(url, params) {
        var that = this;
        params.url = url;
        params.cache = false;

        if (!params.headers) {
            params.headers = {};
        }
        if (xsrfCookie) {
            params.headers['X-XSRF-TOKEN'] = xsrfCookie.val;
        }

        var requestName = params.requestName;
        if (requestName && that.events['request-started.' + requestName]) {
            that.events['request-started.' + requestName]();
        }

        this.xhr = $.ajax(params)
            .done(function (e, statusTexvoid, xhr) {
                if (typeof that.statusCallbacks.done === 'function') {
                    if (document.cookie === '' && typeof Http.prototype.events.disconnected === 'function') {
                        that.events.disconnected(e, statusTexvoid, xhr);
                    }
                    that.statusCallbacks.done(e, statusTexvoid, xhr);
                }
                if (requestName && that.events['request-ended.' + requestName]) {
                    that.events['request-ended.' + requestName]();
                }
            })
            .fail(function (e) {
                if (requestName && that.events['request-ended.' + requestName]) {
                    that.events['request-ended.' + requestName]();
                }

                if (typeof that.statusCallbacks['e' + e.status] === 'function') {
                    that.statusCallbacks['e' + e.status].call(thavoid, e);
                }
                else if (typeof that.statusCallbacks.error === 'function') {
                    that.statusCallbacks.error.call(thavoid, e);
                }
                else {
                    if (!params.disableNotifications && e.status !== 0) {
                        notify.error("e" + e.status);
                    }
                }

                console.log('HTTP error:' + e.status);
                console.log(e);
            });
        return this;
    }
}
*/
/*
export function http = (function () {
    var statusEvents = ['done', 'error', 'e401', 'e404', 'e409', 'e500', 'e400', 'e413', 'e504', 'e0'];
    var xsrfCookie;
    if (document.cookie) {
        var cookies = _.map(document.cookie.split(';'), function (c) {
            return {
                name: c.split('=')[0].trim(),
                val: c.split('=')[1].trim()
            };
        });
        xsrfCookie = _.findWhere(cookies, { name: 'XSRF-TOKEN' });
    }

    statusEvents.forEach(function (event) {
        Http.prototype[event] = function (callback) {
            this.statusCallbacks[event] = callback;
            return this;
        }
    });

    Http.prototype.postFile = function (url, data, params) {
        if (typeof params !== 'object') {
            params = {};
        }
        params.contentType = false;
        params.processData = false;

        return this.post(url, data, params)
    };

    Http.prototype.putFile = function (url, data, params) {
        if (typeof params !== 'object') {
            params = {};
        }
        params.contentType = false;
        params.processData = false;

        return this.put(url, data, params)
    };

    Http.prototype.loadScript = function (url, data?: any, params?: any, requestName?: string): Promise<any> {
        return new Promise<void>((resolve, reject) => {
            if (loadedScripts[url]) {
                resolve(loadedScripts[url]);
                return;
            }
            this.get(url, data, params, requestName).done(() => {
                loadedScripts[url] = true;
                resolve();
            });
        });
    }

    var requestTypes = ['get', 'post', 'put', 'delete'];
    requestTypes.forEach(function (type) {
        Http.prototype[type + 'Json'] = function (url, data, params, requestName) {
            if (!params) {
                params = {};
            }
            params.contentType = 'application/json';
            params.data = angular.toJson(data);
            params.type = type.toUpperCase();
            return this.request(url, params, requestName);
        };
        Http.prototype[type] = function (url, data, params, requestName) {
            var that = this;

            if (!params) {
                params = {};
            }
            if (typeof data === 'object' || typeof data === 'string') {
                if (type === 'get' || type === 'delete') {
                    if (url.indexOf('?') !== -1) {
                        url += '&' + that.serialize(data);
                    }
                    else {
                        url += '?' + that.serialize(data);
                    }
                }
                else {
                    params.data = data;
                }
            }
            params.type = type.toUpperCase();
            return this.request(url, params, requestName);
        };
    });

    return function () {
        return new Http();
    }
}());
*/

/*
export let toFormData: (obj) => string = http().serialize;
*/

/**
 * Promisified HTTP
 */
/*
export type Promise<R> = Promise<R> & { e400: (e) => void }
export class HttpPromisified<T> {
    constructor(private inner?: any) {
        if (!this.inner) {
            this.inner = http();
        }
    }
    private promisify(req: any): Promise<R> {
        const p = new Promise<R>((resolve, reject) => {
            if (req.xhr && req.xhr.status == 0) { reject(); return; }
            req.done(e => resolve(e)).error(e => reject(e));
        });
        (p as any).e400 = req.e400.bind(req);
        return p as any;
    }
    get(url: string, params?: any): Promise<R> {
        return this.promisify(this.inner.get(url, params));
    }
    post(url: string, params?: any): Promise<R> {
        return this.promisify(this.inner.post(url, params));
    }
    postFile(url: string, data: any, params?: any): Promise<R> {
        return this.promisify(this.inner.postFile(url, data, params));
    }
    postJson(url: string, json: any): Promise<R> {
        return this.promisify(this.inner.postJson(url, json));
    }
    put(url: string, data?: any): Promise<R> {
        return this.promisify(this.inner.put(url, data));
    }
    putJson(url: string, json: any): Promise<R> {
        return this.promisify(this.inner.putJson(url, json));
    }
    delete(url: string): Promise<R> {
        return this.promisify(this.inner.delete(url));
    }
    deleteJson(url: string, json: any): Promise<R> {
        return this.promisify(this.inner.deleteJson(url, json));
    }
    putFile(url: string, data: FormData, opt?: any) {
        return this.promisify(this.inner.putFile(url, data, opt));
    }
}
export function httpPromisy<T>(inner?: any): HttpPromisified<T> {
    return new HttpPromisified<T>(inner);
}
*/
