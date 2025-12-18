import type { odeServices } from '@edifice.io/client';
import { HttpAdapter } from './http-adapter';
type HttpService = ReturnType<typeof odeServices.http>;
/**
 * Adapter for Edifice HttpService
 * Translates between the HttpAdapter interface and Edifice's HttpService
 *
 * @example
 * import { odeServices } from '@edifice.io/client';
 * import { HttpServiceAdapter } from './adapters/http-service-adapter';
 *
 * // Create HttpService
 * const httpService = odeServices.http();
 *
 * // Create the adapter
 * const adapter = new HttpServiceAdapter(httpService);
 *
 * // Use the adapter directly or pass it to BaseApiClient
 * const client = new CommunityClient({ httpAdapter: adapter });
 */
export class HttpServiceAdapter implements HttpAdapter {
  constructor(private readonly httpService: HttpService) {}

  async get<T>(url: string, headers?: Record<string, string>): Promise<T> {
    const params = headers ? { headers } : undefined;
    return this.httpService.get<T>(url, params);
  }

  async post<T>(
    url: string,
    body: unknown,
    headers?: Record<string, string>,
  ): Promise<T> {
    const params = headers ? { headers } : undefined;
    return this.httpService.postJson<T>(url, body, params);
  }

  async put<T>(
    url: string,
    body: unknown,
    headers?: Record<string, string>,
  ): Promise<T> {
    const params = headers ? { headers } : undefined;
    return this.httpService.putJson<T>(url, body, params);
  }

  async patch<T>(
    url: string,
    body: unknown,
    headers?: Record<string, string>,
  ): Promise<T> {
    const params = headers ? { headers } : undefined;
    return this.httpService.patchJson<T>(url, body, params);
  }

  async delete<T>(url: string, headers?: Record<string, string>): Promise<T> {
    const params = headers ? { headers } : undefined;
    return this.httpService.delete<T>(url, params);
  }

  async deleteWithBody<T>(
    url: string,
    body: unknown,
    headers?: Record<string, string>,
  ): Promise<T> {
    const params = headers ? { headers } : undefined;
    return this.httpService.deleteJson<T>(url, body);
  }
}
