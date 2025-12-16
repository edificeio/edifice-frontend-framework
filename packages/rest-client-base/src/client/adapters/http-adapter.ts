/**
 * Common interface for HTTP clients (fetch or HttpService)
 */
export interface HttpAdapter {
  /**
   * Perform a GET request
   */
  get<T>(url: string, headers?: Record<string, string>): Promise<T>;

  /**
   * Perform a POST request
   */
  post<T>(
    url: string,
    body: unknown,
    headers?: Record<string, string>,
  ): Promise<T>;

  /**
   * Perform a PUT request
   */
  put<T>(
    url: string,
    body: unknown,
    headers?: Record<string, string>,
  ): Promise<T>;

  /**
   * Perform a PATCH request
   */
  patch<T>(
    url: string,
    body: unknown,
    headers?: Record<string, string>,
  ): Promise<T>;

  /**
   * Perform a DELETE request
   */
  delete<T>(url: string, headers?: Record<string, string>): Promise<T>;

  /**
   * Perform a DELETE request with body
   */
  deleteWithBody<T>(
    url: string,
    body: unknown,
    headers?: Record<string, string>,
  ): Promise<T>;
}
