import { NotificationModel, odeServices } from '@edifice.io/client';

/**
 * Creates a notification service with methods to interact with notifications.
 *
 * @param baseURL The base URL for the notification service API.
 * @returns A service exposing methods to retrieve notifications.
 */
export const createNotificationService = (baseURL: string) => ({
  /**
   * Get notifications.
   * @returns list of notification objects
   * @throws when the platform answers with a non-`ok` status, so that the
   * query layer exposes the failure instead of an empty notification list.
   */
  getNotifications(types: string[], page: number) {
    const searchParams = new URLSearchParams({
      page: page.toString(),
    });

    types.forEach((type) => {
      searchParams.append('type', type);
    });

    return odeServices
      .http()
      .get<{
        status: string;
        number: number;
        results: Array<NotificationModel>;
      }>(`${baseURL}/timeline/lastNotifications?${searchParams.toString()}`)
      .then((response): Array<NotificationModel> => {
        if (response.status !== 'ok') {
          throw new Error(
            `Failed to load notifications (status: ${response.status})`,
          );
        }

        if (response.number && response.results) {
          return response.results;
        }

        return [];
      });
  },

  getNotificationTypes() {
    return odeServices.http().get<string[]>(`${baseURL}/timeline/types`);
  },

  /**
   * Report a notification as inappropriate.
   */
  reportNotification(id: string) {
    return odeServices.http().put(`${baseURL}/timeline/${id}/report`);
  },

  /**
   * Delete a notification.
   */
  deleteNotification(id: string) {
    return odeServices.http().put(`${baseURL}/timeline/${id}`);
  },
});
