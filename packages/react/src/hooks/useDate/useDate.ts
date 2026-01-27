import { useCallback } from 'react';

import dayjs, { Dayjs, OpUnitType } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isToday from 'dayjs/plugin/isToday';

/**
 * DO NOT REMOVE .js extensions from dayjs imports
 */
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import localizedFormat from 'dayjs/plugin/localizedFormat.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';

import 'dayjs/locale/de.js';
import 'dayjs/locale/es.js';
import 'dayjs/locale/fr.js';
import 'dayjs/locale/it.js';
import 'dayjs/locale/pt.js';
import { useTranslation } from 'react-i18next';
import { useEdificeClient } from '../../providers/EdificeClientProvider/EdificeClientProvider.hook';

dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isToday);

export type MongoDate = {
  $date: number | string;
};
export type IsoDate = string; // "2021-03-24T16:36:05.398" or "1980-01-13"

export type NumberDate = number;

/** Date formats we are going to deal with. */
export type CoreDate = IsoDate | MongoDate | NumberDate | Date;

/**
 * Custom React hook for date parsing, formatting, and localization.
 *
 * Provides utility functions to:
 * - Parse various date formats and timestamps into Dayjs objects, respecting the current language.
 * - Format dates in user-friendly ways, including "time ago", "yesterday", and localized date strings.
 * - Compute elapsed durations from a given date to now.
 *
 * @returns An object containing:
 * - `fromNow(date: CoreDate | NumberDate): string` — Returns a human-readable elapsed duration from the given date to now.
 * - `formatDate(date: CoreDate, format?: 'short' | 'long' | 'abbr' | string): string` — Formats a date according to the specified format and current language.
 * - `formatTimeAgo(date: CoreDate | NumberDate): string` — Returns a localized string representing how long ago the date was, with special handling for today, yesterday, and recent dates.
 *
 * @remarks
 * - Uses the current language from the Edifice client context for localization.
 */
export default function useDate() {
  // Current language
  const { currentLanguage } = useEdificeClient();
  const { t } = useTranslation();

  /* Utility function */
  const parseDate = useCallback(
    (date: string, lang?: string): Dayjs => {
      if (date.length < 11) return dayjs(date, ['YYYY-MM-DD'], lang);

      // Check if the string is exclusively made of digits
      if (date.split('').findIndex((char) => '0' > char || char > '9') < 0) {
        // => it should be a number of elapsed milliseconds since 1970-01-01, as a string.
        return dayjs(Number.parseInt(date)).locale(currentLanguage as string);
      } else {
        // Otherwise, it should be an ISO 8601 date.
        let day = dayjs(date).locale(currentLanguage as string);
        if (!day.isValid()) {
          // If invalid, try custom parsings (https://day.js.org/docs/en/parse/string-format)
          day = dayjs(date, ['YYYY-MM-DD HH:mm:ss.SSS']).locale(
            currentLanguage as string,
          );
        }
        return day;
      }
    },
    [currentLanguage],
  );

  const toComputedDate = useCallback(
    (date: CoreDate): Dayjs | undefined => {
      let computedDate: Dayjs = dayjs();
      try {
        if ('undefined' === typeof date) {
          return undefined;
        } else if ('string' === typeof date) {
          computedDate = parseDate(date);
        } else if (date instanceof Date) {
          computedDate = dayjs(date).locale(currentLanguage as string);
        } else if ('number' === typeof date) {
          computedDate = dayjs(date).locale(currentLanguage as string);
        } else if ('number' === typeof date.$date) {
          computedDate = dayjs(new Date(date.$date)).locale(
            currentLanguage as string,
          );
        } else if ('string' === typeof date.$date) {
          computedDate = parseDate(date.$date);
        }
        return computedDate;
      } catch (error) {
        console.error(error);
      }
      return computedDate;
    },
    [currentLanguage, parseDate],
  );

  const formatTimeAgo = useCallback(
    (date: CoreDate): string => {
      const computedDate = toComputedDate(date);

      if (!computedDate?.isValid()) return '';

      const now = dayjs();

      if (computedDate.isSame(now, 'date')) {
        return computedDate.fromNow();
      }

      if (computedDate.isSame(now.subtract(1, 'day'), 'date')) {
        // format "Yesterday"
        return t('date.format.yesterday');
      }

      if (now.diff(computedDate, 'days') <= 7) {
        // format dddd
        return computedDate.format(t('date.format.currentWeek'));
      }

      if (computedDate.isSame(now, 'year')) {
        // format D MMM
        return computedDate.format(t('date.format.currentYear'));
      }

      // format D MMM YYYY
      return computedDate.format(t('date.format.previousYear'));
    },
    [currentLanguage, parseDate],
  );

  /** Compute a user-friendly elapsed duration, between now and a date. */
  const fromNow = useCallback(
    (date: CoreDate): string => {
      const computedDate = toComputedDate(date);
      return computedDate?.isValid() ? computedDate.fromNow() : '';
    },
    [currentLanguage, parseDate],
  );

  /**
   * Formats a date according to the specified format and current language.
   *
   * @param date - The date to format (CoreDate).
   * @param format - The format to use ('short', 'long', 'abbr', or custom DayJS format string,
   * see https://day.js.org/docs/en/display/format#list-of-localized-formats).
   * @returns The formatted date string.
   */
  const formatDate = useCallback(
    (date: CoreDate, format = 'short'): string => {
      const computedDate = toComputedDate(date);

      let dayjsFormat = '';
      switch (format) {
        case 'short':
          dayjsFormat = 'L';
          break;
        case 'long':
          dayjsFormat = 'LL';
          break;
        case 'abbr':
          dayjsFormat = 'll';
          break;
        default:
          dayjsFormat = format;
      }

      return computedDate?.isValid()
        ? computedDate.locale(currentLanguage as string).format(dayjsFormat)
        : '';
    },
    [currentLanguage, parseDate],
  );

  /** Check if two dates are the same, according to the specified unit. See https://day.js.org/docs/en/query/is-same for more details.
   * @param date - The first date to compare.
   * @param date2 - The second date to compare.
   * @param unit - The unit to use for the comparison ('day', 'month', 'year', etc.). Default is 'day'.
   * @returns True if the dates are the same, false otherwise.
   */
  const dateIsSame = useCallback(
    (date: CoreDate, date2: CoreDate, unit: OpUnitType = 'day'): boolean => {
      const computedDate = toComputedDate(date);
      const computedDate2 = toComputedDate(date2);
      return computedDate?.isSame(computedDate2, unit) ?? false;
    },
    [currentLanguage, parseDate],
  );

  /** Check if a date is same or after another date. See https://day.js.org/docs/en/query/is-same-or-after for more details.
   * @param date - The date to check.
   * @param date2 - The date to compare to.
   * @param unit - The unit to use for the comparison ('day', 'month', 'year', etc.). Default is 'day'.
   * @returns True if the date is same or after the other date, false otherwise.
   */
  const dateIsSameOrAfter = useCallback(
    (date: CoreDate, date2: CoreDate, unit: OpUnitType = 'day'): boolean => {
      const computedDate = toComputedDate(date);
      const computedDate2 = toComputedDate(date2);
      return computedDate?.isSameOrAfter(computedDate2, unit) ?? false;
    },
    [currentLanguage, parseDate],
  );

  /** Check if a date is today. See https://day.js.org/docs/en/plugin/is-today for more details.
   * @param date - The date to check.
   * @returns True if the date is today, false otherwise.
   */
  const dateIsToday = useCallback(
    (date: CoreDate): boolean => {
      const computedDate = toComputedDate(date);
      return computedDate?.isToday() ?? false;
    },
    [currentLanguage, parseDate],
  );

  return {
    fromNow,
    formatDate,
    formatTimeAgo,
    dateIsSame,
    dateIsSameOrAfter,
    dateIsToday,
  };
}
