import { IFlashMessageModel, odeServices } from '@edifice.io/client';

/**
 * Creates a message flash service with methods to interact with flash messages.
 *
 * @param baseURL The base URL for the message flash service API.
 * @returns A service exposing methods to retrieve flash messages and mark them as read.
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
