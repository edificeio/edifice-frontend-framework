import { IOdeServices } from '../services/OdeServices';
import { IHttpParams, IHttpResponse } from '../transport/interfaces';

const globalCache: Record<string, any> = {};
const mutexPromise: Record<string, Promise<any>> = {};

export class CacheService {
  constructor(private context: IOdeServices) {}

  private get http() {
    return this.context.http();
  }

  private async fromCacheIfPossible<T>(
    key: string,
    task: () => Promise<T>,
    shouldCache: (value: T) => boolean,
  ): Promise<T> {
    if (mutexPromise[key] !== undefined) {
      await mutexPromise[key];
    }
    if (globalCache[key]) {
      return globalCache[key];
    }
    try {
      const promise = task();
      mutexPromise[key] = promise;
      const res = await promise;
      if (shouldCache(res)) {
        globalCache[key] = res;
      }
      return res;
    } catch (e) {
      console.error(`Failed to retrieve value for: ${key}`, e);
      throw e;
    }
  }

  clearCache(key?: string) {
    if (key) {
      delete globalCache[key];
    } else {
      for (const key in globalCache) {
        // eslint-disable-next-line no-prototype-builtins
        if (globalCache.hasOwnProperty(key)) {
          delete globalCache[key];
        }
      }
    }
  }

  async httpGet<R = any>(
    url: string,
    params?: IHttpParams,
  ): Promise<{ value: R; response: IHttpResponse }> {
    return this.fromCacheIfPossible<{ value: R; response: IHttpResponse }>(
      url,
      async () => {
        const value = await this.http.get<R>(url, params);
        const response = { ...this.http.latestResponse };
        return { value, response };
      },
      ({ response }) => {
        if (response.status < 200 || response.status >= 300) {
          // error code => dont cache
          return false;
        } else {
          return true;
        }
      },
    );
  }

  async httpGetJson<R = any>(url: string, params?: IHttpParams): Promise<R> {
    const { response, value } = await this.httpGet(url, params);
    if (response.status < 200 || response.status >= 300) {
      // error code => dont cache
      throw `Bad http status (${response.status}) for url: ${url}`;
    } else {
      return value;
    }
  }
}
