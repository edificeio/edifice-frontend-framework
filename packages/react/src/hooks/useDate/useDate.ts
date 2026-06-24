import { useCallback } from 'react';

import dayjs, { Dayjs, OpUnitType } from 'dayjs';

/**
 * DO NOT REMOVE .js extensions from dayjs imports: the build externalizes
 * dayjs plugins through the /^dayjs\/plugin\/.+\.js$/ pattern, so the
 * extension is required to keep them as clean external imports.
 */
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';
import isToday from 'dayjs/plugin/isToday.js';
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

/** Variants of the calendar date format (see the date format spec). */
export type CalendarDateVariant = 'full' | 'short' | 'abbr';

/**
 * Beyond this duration (in hours), friendly formats stop using a relative
 * wording ("3 hours ago") and switch to a day-based wording ("yesterday",
 * weekday, date). Matches the date format spec.
 */
const FRIENDLY_RELATIVE_MAX_HOURS = 3;

/**
 * Custom React hook for date parsing, formatting, localization and conversion.
 *
 * It exposes one method per format of the Edifice date format spec
 * (see https://edifice-community.atlassian.net/wiki/spaces/ODE/pages/4601610241).
 *
 * All formatting methods accept a {@link CoreDate} and are localized through
 * the current language of the Edifice client. Wordings and format patterns
 * come from i18n keys (`date.*`), so no label is hardcoded.
 *
 * Formats:
 * - Friendly: {@link useDate.formatRelativeDateTime}, {@link useDate.formatRelativeDate}
 * - Simple/textual: {@link useDate.formatLongDateTime}, {@link useDate.formatLongDate}
 * - Raw: {@link useDate.formatRawDate}, {@link useDate.formatRawDateTime}
 * - Calendar: {@link useDate.formatCalendarDate}
 * - Week: {@link useDate.formatWeek}
 *
 * Conversions: {@link useDate.toJsDate}, {@link useDate.toTimestamp},
 * {@link useDate.toIsoDate}, {@link useDate.toMongoDate}.
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

  /**
   * Shared logic of the "friendly" formats: relative wording for recent dates
   * (both past and future), then a day-based wording (yesterday/tomorrow,
   * weekday, date with or without year).
   *
   * @param keyPrefix - i18n key prefix selecting the with/without time patterns.
   */
  const formatFriendly = useCallback(
    (date: CoreDate, keyPrefix: 'datetime' | 'date'): string => {
      const computedDate = toComputedDate(date);
      if (!computedDate?.isValid()) return '';

      const now = dayjs();

      // Recent dates (same day, or within a few hours): relative wording.
      // dayjs handles past ("3 hours ago") and future ("in 3 hours").
      if (
        computedDate.isToday() ||
        Math.abs(now.diff(computedDate, 'hour')) <= FRIENDLY_RELATIVE_MAX_HOURS
      ) {
        return computedDate.fromNow();
      }

      let patternKey: string;
      if (computedDate.isSame(now.subtract(1, 'day'), 'day')) {
        patternKey = 'yesterday';
      } else if (computedDate.isSame(now.add(1, 'day'), 'day')) {
        patternKey = 'tomorrow';
      } else if (Math.abs(now.diff(computedDate, 'day')) < 7) {
        patternKey = 'weekday';
      } else if (computedDate.isSame(now, 'year')) {
        patternKey = 'currentYear';
      } else {
        patternKey = 'otherYear';
      }

      return computedDate.format(t(`date.friendly.${keyPrefix}.${patternKey}`));
    },
    [toComputedDate, t],
  );

  /**
   * Friendly format **with time** (spec: "Format convivial - avec heure").
   *
   * @example "il y a 38 minutes", "hier à 16h22", "mercredi à 16h22",
   * "le 21 septembre à 16h22", "le 25 novembre 2020 à 16h22".
   */
  const formatRelativeDateTime = useCallback(
    (date: CoreDate): string => formatFriendly(date, 'datetime'),
    [formatFriendly],
  );

  /**
   * Friendly format **without time** (spec: "Format convivial - sans heure").
   *
   * @example "il y a 38 minutes", "hier", "mercredi", "21 sept.", "25 nov. 2020".
   */
  const formatRelativeDate = useCallback(
    (date: CoreDate): string => formatFriendly(date, 'date'),
    [formatFriendly],
  );

  /**
   * Simple and textual format **with time**
   * (spec: "Format simple et textuel - avec heure").
   *
   * @example "23 juillet 2021 à 17:46".
   */
  const formatLongDateTime = useCallback(
    (date: CoreDate): string => {
      const computedDate = toComputedDate(date);
      return computedDate?.isValid()
        ? computedDate.format(t('date.long.datetime'))
        : '';
    },
    [toComputedDate, t],
  );

  /**
   * Simple and textual format **without time**
   * (spec: "Format simple et textuel - sans heure").
   *
   * @example "23 juillet 2021".
   */
  const formatLongDate = useCallback(
    (date: CoreDate): string => {
      const computedDate = toComputedDate(date);
      return computedDate?.isValid()
        ? computedDate.format(t('date.long.date'))
        : '';
    },
    [toComputedDate, t],
  );

  /**
   * Raw format **without time** (spec: "Format brut - sans heure").
   *
   * @example "28/02/2025".
   */
  const formatRawDate = useCallback(
    (date: CoreDate): string => {
      const computedDate = toComputedDate(date);
      return computedDate?.isValid()
        ? computedDate.format(t('date.raw.date'))
        : '';
    },
    [toComputedDate, t],
  );

  /**
   * Raw format **with time** (spec: "Format brut - avec heure").
   *
   * @example "18/11/2019 15:36".
   */
  const formatRawDateTime = useCallback(
    (date: CoreDate): string => {
      const computedDate = toComputedDate(date);
      return computedDate?.isValid()
        ? computedDate.format(t('date.raw.datetime'))
        : '';
    },
    [toComputedDate, t],
  );

  /**
   * Calendar date format, at the scale of a calendar day (spec: "Date calendrier").
   * Yesterday/today/tomorrow are displayed as words for every variant.
   *
   * @param variant - 'full' ("vendredi 16 avril"), 'short' ("lundi 12 janv.")
   * or 'abbr' ("16/04").
   */
  const formatCalendarDate = useCallback(
    (date: CoreDate, variant: CalendarDateVariant = 'full'): string => {
      const computedDate = toComputedDate(date);
      if (!computedDate?.isValid()) return '';

      const now = dayjs();

      if (computedDate.isToday()) return t('date.calendar.today');
      if (computedDate.isSame(now.subtract(1, 'day'), 'day'))
        return t('date.calendar.yesterday');
      if (computedDate.isSame(now.add(1, 'day'), 'day'))
        return t('date.calendar.tomorrow');

      const period = computedDate.isSame(now, 'year')
        ? 'currentYear'
        : 'otherYear';

      return computedDate.format(t(`date.calendar.${variant}.${period}`));
    },
    [toComputedDate, t],
  );

  /**
   * Week format, when displaying things by week (spec: "Date semaine").
   *
   * @example "Cette semaine", "Semaine prochaine (du 30 janv. au 5 fév.)",
   * "Semaine du 17 au 23 janvier".
   */
  const formatWeek = useCallback(
    (date: CoreDate): string => {
      const computedDate = toComputedDate(date);
      if (!computedDate?.isValid()) return '';

      const now = dayjs().locale(currentLanguage as string);
      const targetWeekStart = computedDate.startOf('week');
      const weekDiff = targetWeekStart.diff(now.startOf('week'), 'week');

      if (weekDiff === 0) return t('date.week.current');

      const weekEnd = targetWeekStart.endOf('week');

      // Last/next weeks use abbreviated, fully-qualified day+month bounds.
      if (weekDiff === -1 || weekDiff === 1) {
        return t(weekDiff === -1 ? 'date.week.last' : 'date.week.next', {
          start: targetWeekStart.format(t('date.week.boundary.short')),
          end: weekEnd.format(t('date.week.boundary.short')),
        });
      }

      // Other weeks: "Semaine du <start day> au <end day month> [year]".
      const sameYear = targetWeekStart.isSame(now, 'year');
      return t(
        sameYear ? 'date.week.other.currentYear' : 'date.week.other.otherYear',
        {
          start: targetWeekStart.format(t('date.week.boundary.day')),
          end: weekEnd.format(t('date.week.boundary.dayMonth')),
          year: targetWeekStart.format('YYYY'),
        },
      );
    },
    [currentLanguage, toComputedDate, t],
  );

  /** Converts a {@link CoreDate} to a native `Date`, or `undefined` if invalid. */
  const toJsDate = useCallback(
    (date: CoreDate): Date | undefined => {
      const computedDate = toComputedDate(date);
      return computedDate?.isValid() ? computedDate.toDate() : undefined;
    },
    [toComputedDate],
  );

  /**
   * Converts a {@link CoreDate} to a timestamp (ms since epoch), or `undefined`
   * if invalid.
   */
  const toTimestamp = useCallback(
    (date: CoreDate): number | undefined => {
      const computedDate = toComputedDate(date);
      return computedDate?.isValid() ? computedDate.valueOf() : undefined;
    },
    [toComputedDate],
  );

  /**
   * Converts a {@link CoreDate} to an ISO 8601 string, or `undefined` if
   * invalid.
   */
  const toIsoDate = useCallback(
    (date: CoreDate): IsoDate | undefined => {
      const computedDate = toComputedDate(date);
      return computedDate?.isValid() ? computedDate.toISOString() : undefined;
    },
    [toComputedDate],
  );

  /**
   * Converts a {@link CoreDate} to a {@link MongoDate} (`{ $date: <ms> }`), or
   * `undefined` if invalid.
   */
  const toMongoDate = useCallback(
    (date: CoreDate): MongoDate | undefined => {
      const computedDate = toComputedDate(date);
      return computedDate?.isValid()
        ? { $date: computedDate.valueOf() }
        : undefined;
    },
    [toComputedDate],
  );

  /**
   * @deprecated Use {@link formatRelativeDateTime} instead.
   * Compute a user-friendly elapsed duration, between now and a date.
   */
  const fromNow = useCallback(
    (date: CoreDate): string => {
      const computedDate = toComputedDate(date);
      return computedDate?.isValid() ? computedDate.fromNow() : '';
    },
    [toComputedDate],
  );

  /**
   * @deprecated Use {@link formatRelativeDate} instead.
   *
   * Returns a localized string representing how long ago the date was, with
   * special handling for today, yesterday, and recent dates.
   */
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
    [toComputedDate, t],
  );

  /**
   * @deprecated Prefer the dedicated methods: {@link formatLongDate} ('long'),
   * {@link formatRawDate} ('short') or {@link formatCalendarDate} ('abbr').
   *
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
    [currentLanguage, toComputedDate],
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
    [toComputedDate],
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
    [toComputedDate],
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
    [toComputedDate],
  );

  return {
    // Friendly formats
    formatRelativeDateTime,
    formatRelativeDate,
    // Simple/textual formats
    formatLongDateTime,
    formatLongDate,
    // Raw formats
    formatRawDate,
    formatRawDateTime,
    // Calendar & week
    formatCalendarDate,
    formatWeek,
    // Conversions
    toJsDate,
    toTimestamp,
    toIsoDate,
    toMongoDate,
    // Comparisons
    dateIsSame,
    dateIsSameOrAfter,
    dateIsToday,
    // Deprecated
    fromNow,
    formatDate,
    formatTimeAgo,
  };
}
