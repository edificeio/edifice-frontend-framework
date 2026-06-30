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
          //TODO notify error
          return [];
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
});
