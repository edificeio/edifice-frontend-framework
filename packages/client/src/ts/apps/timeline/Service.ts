import { IOdeServices } from '../../services/OdeServices';
import { IHttpParams } from '../../transport/interfaces';
import { NotificationSummary, NotificationsSinceResponse } from './interfaces';

export class TimelineService {
  constructor(private context: IOdeServices) {}

  private get http() {
    return this.context.http();
  }

  /**
   * List the notifications received by the current user since a given date,
   * newest first. User preferences are NOT applied; only notifications
   * restricted at platform level (EXTERNAL / HIDDEN) are excluded.
   * The backend caps the number of returned results.
   * @param since - lower bound (inclusive) of the reception date.
   * @param options.disableNotifications - do not notify (toast) on HTTP errors.
   * @returns lightweight notifications (`_id`, `type`, `event-type`,
   * `resource`, `sub-resource`, `date`).
   */
  async getNotificationsSince(
    since: Date,
    options?: Pick<IHttpParams, 'disableNotifications'>,
  ): Promise<NotificationSummary[]> {
    const res = await this.http.get<NotificationsSinceResponse>(
      '/timeline/notifications/since',
      // The backend requires an ISO-8601 date with an offset: toISOString() is UTC ("Z").
      { ...options, queryParams: { date: since.toISOString() } },
    );
    return res?.results ?? [];
  }
}
