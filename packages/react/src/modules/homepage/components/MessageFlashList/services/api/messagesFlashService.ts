import { IFlashMessageModel, odeServices } from '@edifice.io/client';

/**
 * Creates a message flash service with the specified base URL.
 *
 * @param baseURL The base URL for the message flash service API.
 * @returns A service to interact with message flash.
 */
/**
 * Creates a message flash service with methods to interact with flash messages.
 * @param baseURL - The base URL for API endpoints
 * @returns An object containing methods to manage flash messages
 * @returns {Object} Service object
 * @returns {Function} getMessagesFlash - Retrieves all flash messages for the current user
 * @returns {Function} markAsRead - Marks a specific flash message as read
 */
export const createMessagesFlashService = (baseURL: string) => ({
  /**
   * Get message flash.
   * @returns a message flash object
   */
  getMessagesFlash() {
    return odeServices
      .http()
      .get<IFlashMessageModel[]>(`${baseURL}/timeline/flashmsg/listuser`);
  },

  /**
   * Mark a flash message as read.
   * @param message - The flash message to mark as read
   * @returns A promise that resolves when the operation is complete
   */
  markAsRead(message: IFlashMessageModel): Promise<void> {
    return odeServices
      .http()
      .put('/timeline/flashmsg/' + message.id + '/markasread');
  },
});
