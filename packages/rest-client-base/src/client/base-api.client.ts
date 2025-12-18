import { HttpAdapter } from './adapters/http-adapter';
import { FetchAdapter } from './adapters/fetch-adapter';
import { HttpServiceAdapter } from './adapters/http-service-adapter';
import type { odeServices } from '@edifice.io/client';
type HttpService = ReturnType<typeof odeServices.http>;

/**
 * Custom fetch function type definition
 */
export type FetchFunction = typeof fetch;

/**
 * Configuration options for API clients
 */
export interface ApiClientOptions {
  /**
   * Base URL for API requests
   */
  baseUrl?: string;

  /**
   * Default headers to include with all requests
   */
  defaultHeaders?: Record<string, string>;

  /**
   * Custom fetch implementation (useful for testing)
   * @deprecated Use httpAdapter instead
   */
  fetchImpl?: typeof fetch;

  /**
   * HttpService instance from Edifice client
   * If provided, this will be used instead of fetch
   */
  httpService?: HttpService;

  /**
   * Custom HTTP adapter
   * If provided, this will be used instead of fetch or httpService
   */
  httpAdapter?: HttpAdapter;
}

/**
 * Request options for API calls
 */
export interface RequestOptions {
  /**
   * Additional headers to include with this specific request
   */
  headers?: Record<string, string>;
}

/**
 * Base abstract class for all API clients
 * Provides common functionality for making HTTP requests
 */
export abstract class BaseApiClient {
  /**
   * Base URL for all API requests
   * @protected
   */
  protected readonly baseUrl: string;

  /**
   * Default headers included with all requests
   * @protected
   */
  protected readonly defaultHeaders: Record<string, string>;

  /**
   * HTTP adapter for making requests
   * @protected
   */
  protected readonly httpAdapter: HttpAdapter;

  /**
   * Creates a new API client instance
   *
   * @param options Configuration options
   * @param options.baseUrl Base URL for API requests
   * @param options.defaultHeaders Default headers for all requests
   * @param options.fetchImpl Custom fetch implementation (deprecated, use httpAdapter)
   * @param options.httpService Edifice HttpService instance (from odeServices.http())
   * @param options.httpAdapter Custom HTTP adapter implementation
   *
   * @example
   * // With Edifice HttpService
   * import { odeServices } from '@edifice.io/client';
   *
   * const client = new CommunityClient({
   *   httpService: odeServices.http(),
   *   defaultHeaders: {
   *     'X-Custom-Header': 'value'
   *   }
   * });
   */
  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = options.baseUrl || '';
    this.defaultHeaders = options.defaultHeaders || {};

    // Determine which HTTP implementation to use (in order of precedence)
    if (options.httpAdapter) {
      this.httpAdapter = options.httpAdapter;
    } else if (options.httpService) {
      this.httpAdapter = new HttpServiceAdapter(options.httpService);
    } else {
      this.httpAdapter = new FetchAdapter(options.fetchImpl || fetch);
    }
  }

  /**
   * Performs a GET request
   * @param endpoint API endpoint path
   * @param queryParams URL query parameters
   * @param options Request options
   * @returns Promise resolving to the response data
   */
  protected async get<T>(
    endpoint: string,
    queryParams?: URLSearchParams,
    options?: RequestOptions,
  ): Promise<T> {
    const url = this.buildUrl(endpoint, queryParams);
    return this.httpAdapter.get<T>(url, this.buildHeaders(options?.headers));
  }

  /**
   * Performs a POST request
   * @param endpoint API endpoint path
   * @param body Request body
   * @param queryParams Optional URL query parameters
   * @param options Request options
   * @returns Promise resolving to the response data
   */
  protected async post<T, U = unknown>(
    endpoint: string,
    body: U,
    queryParams?: URLSearchParams,
    options?: RequestOptions,
  ): Promise<T> {
    const url = this.buildUrl(endpoint, queryParams);
    return this.httpAdapter.post<T>(
      url,
      body,
      this.buildHeaders(options?.headers),
    );
  }

  /**
   * Performs a PUT request
   * @param endpoint API endpoint path
   * @param body Request body
   * @param queryParams Optional URL query parameters
   * @param options Request options
   * @returns Promise resolving to the response data
   */
  protected async put<T, U = unknown>(
    endpoint: string,
    body: U,
    queryParams?: URLSearchParams,
    options?: RequestOptions,
  ): Promise<T> {
    const url = this.buildUrl(endpoint, queryParams);
    return this.httpAdapter.put<T>(
      url,
      body,
      this.buildHeaders(options?.headers),
    );
  }

  /**
   * Performs a PATCH request
   * @param endpoint API endpoint path
   * @param body Request body
   * @param queryParams Optional URL query parameters
   * @param options Request options
   * @returns Promise resolving to the response data
   */
  protected async patch<T, U = unknown>(
    endpoint: string,
    body: U,
    queryParams?: URLSearchParams,
    options?: RequestOptions,
  ): Promise<T> {
    const url = this.buildUrl(endpoint, queryParams);
    return this.httpAdapter.patch<T>(
      url,
      body,
      this.buildHeaders(options?.headers),
    );
  }

  /**
   * Performs a DELETE request
   * @param endpoint API endpoint path
   * @param queryParams Optional URL query parameters
   * @param options Request options
   * @returns Promise resolving when the request is complete
   */
  protected async delete<T = void>(
    endpoint: string,
    queryParams?: URLSearchParams,
    options?: RequestOptions,
  ): Promise<T> {
    const url = this.buildUrl(endpoint, queryParams);
    return this.httpAdapter.delete<T>(url, this.buildHeaders(options?.headers));
  }

  /**
   * Performs a DELETE request with body
   * @param endpoint API endpoint path
   * @param body Request body
   * @param queryParams Optional URL query parameters
   * @param options Request options
   * @returns Promise resolving to the response data
   */
  protected async deleteWithBody<T, U = unknown>(
    endpoint: string,
    body: U,
    queryParams?: URLSearchParams,
    options?: RequestOptions,
  ): Promise<T> {
    const url = this.buildUrl(endpoint, queryParams);
    return this.httpAdapter.deleteWithBody<T>(
      url,
      body,
      this.buildHeaders(options?.headers),
    );
  }

  /**
   * Builds complete URL from endpoint and query parameters
   * @param endpoint API endpoint path
   * @param queryParams Optional query parameters
   * @returns Complete URL
   * @protected
   */
  protected buildUrl(endpoint: string, queryParams?: URLSearchParams): string {
    let url = `${this.baseUrl}${endpoint}`;
    // Ensure URL starts with a slash
    if (url.startsWith('//')) {
      url = url.replace(/^\/\//, '/');
    }
    if (queryParams && queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    return url;
  }

  /**
   * Builds headers for a request by combining default and request-specific headers
   * @param additionalHeaders Optional additional headers
   * @returns Combined headers
   * @protected
   */
  protected buildHeaders(
    additionalHeaders?: Record<string, string>,
  ): Record<string, string> {
    return {
      ...this.defaultHeaders,
      ...additionalHeaders,
    };
  }
}
