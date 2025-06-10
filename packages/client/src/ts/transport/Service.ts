/* eslint-disable prefer-rest-params */
import axios, {
  AxiosError,
  AxiosInstance,
  // AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { ERROR_CODE } from '../globals';
import { notify } from '../notify/Framework';
import { EVENT_NAME, LAYER_NAME } from '../notify/interfaces';
import { IOdeServices } from '../services/OdeServices';
import { IHttp, IHttpParams, IHttpResponse } from './interfaces';

const loadedScripts: { [url: string]: boolean } = {};

export class HttpService implements IHttp {
  // Axios automatically manages the XSRF-TOKEN cookie and the X-XSRF-TOKEN HTTP header.
  private axios: AxiosInstance;
  private baseUrl?: string;
  private headers: Record<string, string> = {};
  private _latestResponse: any;

  constructor(
    private context: IOdeServices,
    params?: any,
  ) {
    this.axios = axios.create(params);
  }

  private fixBaseUrl(url: string) {
    // skip absolute url
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    } else if (this.baseUrl) {
      if (this.baseUrl.endsWith('/') || url.startsWith('/')) {
        return `${this.baseUrl}${url}`;
      } else {
        return `${this.baseUrl}/${url}`;
      }
    } else {
      // if baseUrl not setted => return relative
      return url;
    }
  }

  useBaseUrl(baseUrl?: string) {
    this.baseUrl = baseUrl;
    return this;
  }

  useHeaders(headers: Record<string, string>) {
    this.headers = headers;
    return this;
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
      const previousHeaders = p.headers ?? {};
      p.headers = { ...previousHeaders, ...this.headers };
      /* TODO : manage params.requestName through an events[]. See infra-front http.ts */

      return p;
    }
  }

  private toCdnUrl(url: string) {
    url = this.fixBaseUrl(url);
    const CDN_DOMAIN: string = this.context.conf().getCdnUrl() || '';
    // If CDN domain is defined, and requested url is not /public/conf (SKIP PUBLIC CONF)
    if (CDN_DOMAIN!.length > 0 && url !== '/conf/public') {
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
    //console.error("[HttpService]", error);
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

    const { status, statusText, headers, data } = this
      ._latestResponse as AxiosResponse;

    // Notify errors unless explicitely disabled.
    params?.disableNotifications ||
      notify.events().publish(LAYER_NAME.TRANSPORT, {
        name: EVENT_NAME.ERROR_OCCURED,
        data: {
          params,
          response: { status, statusText, headers },
          payload: data,
        },
      });

    return data;
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

  async get<R = any>(url: string, params?: IHttpParams): Promise<R> {
    try {
      const r = await this.axios.get<R>(
        this.toCdnUrl(url),
        this.toAxiosConfig(params),
      );
      return this.mapAxiosResponse(r, params);
    } catch (e) {
      const error = this.mapAxiosError(e as AxiosError, params) as R;
      throw error;
    }
  }

  async post<R = any>(
    url: string,
    data?: any,
    params?: IHttpParams,
  ): Promise<R> {
    try {
      const r = await this.axios.post<R>(
        this.fixBaseUrl(url),
        data,
        this.toAxiosConfig(params),
      );
      return this.mapAxiosResponse(r, params);
    } catch (e) {
      const error = this.mapAxiosError(e as AxiosError, params) as R;
      throw error;
    }
  }

  async postFile<R = any>(
    url: string,
    data: any,
    params?: IHttpParams,
  ): Promise<R> {
    const p = this.toAxiosConfig(params);
    if (p.headers && p.headers['Content-Type']) {
      delete p.headers['Content-Type'];
    }
    try {
      const r = await this.axios.post<R>(this.fixBaseUrl(url), data, {
        ...p,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return this.mapAxiosResponse(r, params);
    } catch (e) {
      const error = this.mapAxiosError(e as AxiosError, params) as R;
      throw error;
    }
  }

  async postJson<R = any>(
    url: string,
    json: any,
    params?: IHttpParams,
  ): Promise<R> {
    const p = this.toAxiosConfig();
    if (p.headers) p.headers['Content-Type'] = 'application/json';
    try {
      const response = await this.axios.post<R>(
        this.fixBaseUrl(url),
        json,
        this.toAxiosConfig(params),
      );
      return this.mapAxiosResponse(response, params);
    } catch (e) {
      const error = this.mapAxiosError(e as AxiosError, params);
      throw error;
    }
  }

  async put<R = any>(
    url: string,
    data?: any,
    params?: IHttpParams,
  ): Promise<R> {
    try {
      const r = await this.axios.put<R>(
        this.fixBaseUrl(url),
        data,
        this.toAxiosConfig(params),
      );
      return this.mapAxiosResponse(r, params);
    } catch (e) {
      const error = this.mapAxiosError(e as AxiosError, params) as R;
      throw error;
    }
  }

  async putFile<R = any>(url: string, data: FormData, params?: IHttpParams) {
    try {
      const p = this.toAxiosConfig(params);
      if (p.headers && p.headers['Content-Type']) {
        delete p.headers['Content-Type'];
      }
      const res = await this.axios.put(this.fixBaseUrl(url), data, {
        ...p,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return this.mapAxiosResponse(res, params);
    } catch (e) {
      const error = this.mapAxiosError(e as AxiosError, params) as R;
      throw error;
    }
  }

  async putJson<R = any>(
    url: string,
    json: any,
    params?: IHttpParams,
  ): Promise<R> {
    const p = this.toAxiosConfig(params);
    if (p.headers) p.headers['Content-Type'] = 'application/json';
    try {
      const r = await this.axios.put<R>(this.fixBaseUrl(url), json, p);
      return this.mapAxiosResponse(r, params);
    } catch (e) {
      const error = this.mapAxiosError(e as AxiosError, params) as R;
      throw error;
    }
  }

  async patch<R = any>(
    url: string,
    data?: any,
    params?: IHttpParams,
  ): Promise<R> {
    try {
      const r = await this.axios.patch<R>(
        this.fixBaseUrl(url),
        data,
        this.toAxiosConfig(params),
      );
      return this.mapAxiosResponse(r, params);
    } catch (e) {
      const error = this.mapAxiosError(e as AxiosError, params) as R;
      throw error;
    }
  }

  async patchFile<R = any>(url: string, data: FormData, params?: IHttpParams) {
    try {
      const p = this.toAxiosConfig(params);
      if (p.headers && p.headers['Content-Type']) {
        delete p.headers['Content-Type'];
      }
      const res = await this.axios.patch(this.fixBaseUrl(url), data, {
        ...p,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return this.mapAxiosResponse(res, params);
    } catch (e) {
      const error = this.mapAxiosError(e as AxiosError, params) as R;
      throw error;
    }
  }

  async patchJson<R = any>(
    url: string,
    json: any,
    params?: IHttpParams,
  ): Promise<R> {
    const p = this.toAxiosConfig(params);
    if (p.headers) p.headers['Content-Type'] = 'application/json';
    try {
      const r = await this.axios.patch<R>(this.fixBaseUrl(url), json, p);
      return this.mapAxiosResponse(r, params);
    } catch (e) {
      const error = this.mapAxiosError(e as AxiosError, params) as R;
      throw error;
    }
  }

  async delete<R = any>(url: string, params?: IHttpParams): Promise<R> {
    try {
      const r = await this.axios.delete<R>(
        this.fixBaseUrl(url),
        this.toAxiosConfig(params),
      );
      return this.mapAxiosResponse(r, params);
    } catch (e) {
      const error = this.mapAxiosError(e as AxiosError, params) as R;
      throw error;
    }
  }

  async deleteJson<R = any>(url: string, json: any): Promise<R> {
    try {
      const r = await this.axios.delete<R>(this.fixBaseUrl(url), {
        data: json,
      });
      return this.mapAxiosResponse(r);
    } catch (e) {
      const error = this.mapAxiosError(e as AxiosError) as R;
      throw error;
    }
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
