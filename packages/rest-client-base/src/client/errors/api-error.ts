/**
 * Custom API error that encapsulates the HTTP response
 * Provides convenient methods to access response data
 *
 * @example
 * // Handling API errors with proper type checking
 * try {
 *   await resourceClient.getResource(communityId, resourceId);
 * } catch (error) {
 *   if (error instanceof ApiError) {
 *     // Handle specific status codes
 *     if (error.status() === 404) {
 *       console.error(`Resource ${resourceId} not found`);
 *     }
 *
 *     // Access error details from JSON response
 *     const errorData = await error.json();
 *     console.error('Error details:', errorData.message);
 *
 *     // Access the original response if needed
 *     const requestId = error.response().headers.get('X-Request-ID');
 *   } else {
 *     // Handle other errors (network, etc.)
 *     console.error('Unexpected error:', error);
 *   }
 * }
 */
export class ApiError extends Error {
  private _response: Response;
  private _jsonData: unknown | null = null;
  private _textData: string | null = null;

  /**
   * Create a new API error
   * @param response The original HTTP response
   * @param message Optional custom error message
   */
  constructor(response: Response, message?: string) {
    super(
      message ||
        `API request failed: ${response.status} ${response.statusText}`,
    );
    this.name = 'ApiError';
    this._response = response;

    // Ensure the error object has proper prototype chain
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /**
   * Get the original Response object
   * @returns The original Response
   */
  response(): Response {
    return this._response;
  }

  /**
   * Get the HTTP status code
   * @returns The numeric status code (e.g., 404, 500)
   */
  status(): number {
    return this._response.status;
  }

  /**
   * Get the HTTP status text
   * @returns The status text (e.g., "Not Found", "Internal Server Error")
   */
  statusText(): string {
    return this._response.statusText;
  }

  /**
   * Get the response body as JSON
   * @returns Parsed JSON data or null if not available
   * @throws If the response body isn't valid JSON
   */
  async json(): Promise<unknown> {
    if (this._jsonData === null) {
      try {
        // Clone the response to avoid "body already read" errors
        const clonedResponse = this._response.clone();
        this._jsonData = await clonedResponse.json();
      } catch {
        this._jsonData = null;
      }
    }
    return this._jsonData;
  }

  /**
   * Get the response body as text
   * @returns Text content or empty string if not available
   */
  async text(): Promise<string> {
    if (this._textData === null) {
      try {
        // Clone the response to avoid "body already read" errors
        const clonedResponse = this._response.clone();
        this._textData = await clonedResponse.text();
      } catch {
        this._textData = '';
      }
    }
    return this._textData;
  }
}
