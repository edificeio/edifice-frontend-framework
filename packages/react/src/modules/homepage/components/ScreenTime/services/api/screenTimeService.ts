import { odeServices } from '@edifice.io/client';
import { ScreenTimeDayEntry, ScreenTimeHourEntry } from '../../types';

interface DailyScreenTimeDTO {
  durations?: ScreenTimeHourEntry[];
}

interface WeeklyScreenTimeDTO {
  dailySummaries?: ScreenTimeDayEntry[];
}

export class ScreenTimeRequestError extends Error {
  constructor(public readonly status: number) {
    super(`screen-time ${status}`);
  }
}

/** A 404 means "no data for this kid upstream", not a failure. */
export const isNotFoundError = (error: unknown) =>
  error instanceof ScreenTimeRequestError && error.status === 404;

/**
 * Creates the service of the homepage "Screen time" widget.
 *
 * Backend contract:
 * - `GET /appregistry/screen-time/:kidId/daily?date=…` returns
 *   `{ durations }`, one entry per hour.
 * - `GET /appregistry/screen-time/:kidId/weekly?startDate=…&endDate=…`
 *   returns `{ dailySummaries }`, one entry per day.
 *
 * @param baseURL The base URL for the screen-time service API.
 */
export const createScreenTimeService = (baseURL: string) => {
  async function get<T>(path: string): Promise<T | undefined> {
    const http = odeServices.http();
    try {
      return await http.get<T>(`${baseURL}/appregistry/screen-time/${path}`, {
        disableNotifications: true,
      });
    } catch {
      // On a non-2xx status, http.get() throws the response body: the status
      // is only available on latestResponse.
      throw new ScreenTimeRequestError(http.latestResponse.status);
    }
  }

  return {
    /**
     * Get a kid's screen time for each hour of a day.
     */
    async getDaily(
      kidId: string,
      date: string,
    ): Promise<ScreenTimeHourEntry[]> {
      const body = await get<DailyScreenTimeDTO>(
        `${encodeURIComponent(kidId)}/daily?date=${date}`,
      );
      return Array.isArray(body?.durations) ? body.durations : [];
    },

    /**
     * Get a kid's screen time for each day between two dates.
     */
    async getWeekly(
      kidId: string,
      startDate: string,
      endDate: string,
    ): Promise<ScreenTimeDayEntry[]> {
      const body = await get<WeeklyScreenTimeDTO>(
        `${encodeURIComponent(kidId)}/weekly?startDate=${startDate}&endDate=${endDate}`,
      );
      return Array.isArray(body?.dailySummaries) ? body.dailySummaries : [];
    },
  };
};
