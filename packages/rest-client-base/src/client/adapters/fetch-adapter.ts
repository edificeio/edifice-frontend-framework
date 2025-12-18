import { HttpAdapter } from './http-adapter';
import { ApiError } from '../errors/api-error';

/**
 * Adapter for native fetch API
 */
export class FetchAdapter implements HttpAdapter {
  constructor(private readonly fetchImpl: typeof fetch = fetch) {}

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      throw new ApiError(response);
    }

    // Handle empty responses (like DELETE operations)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return {} as T;
  }

  async get<T>(url: string, headers?: Record<string, string>): Promise<T> {
    const response = await this.fetchImpl(url, {
      method: 'GET',
      headers,
      credentials: 'include',
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(
    url: string,
    body: unknown,
    headers?: Record<string, string>,
  ): Promise<T> {
    const response = await this.fetchImpl(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(
    url: string,
    body: unknown,
    headers?: Record<string, string>,
  ): Promise<T> {
    const response = await this.fetchImpl(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });
    return this.handleResponse<T>(response);
  }

  async patch<T>(
    url: string,
    body: unknown,
    headers?: Record<string, string>,
  ): Promise<T> {
    const response = await this.fetchImpl(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(url: string, headers?: Record<string, string>): Promise<T> {
    const response = await this.fetchImpl(url, {
      method: 'DELETE',
      headers,
      credentials: 'include',
    });
    return this.handleResponse<T>(response);
  }

  async deleteWithBody<T>(
    url: string,
    body: unknown,
    headers?: Record<string, string>,
  ): Promise<T> {
    const response = await this.fetchImpl(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });
    return this.handleResponse<T>(response);
  }
}
