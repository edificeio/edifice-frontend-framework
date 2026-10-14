import dayjs from 'dayjs';
import { isNotFoundError } from './services/api/screenTimeService';
import {
  ScreenTimeChartBar,
  ScreenTimeDayEntry,
  ScreenTimeHourEntry,
  ScreenTimeStatus,
  ScreenTimeView,
} from './types';

export const DATE_FORMAT = 'YYYY-MM-DD';

export const SCREEN_TIME_AXIS = {
  weekly: { step: 1, defaultMax: 12 },
  daily: { step: 5, defaultMax: 30 },
} as const;

export const SCREEN_TIME_LEARN_MORE_URL =
  'https://sway.cloud.microsoft/8MnpzrzmspqbDGGx?ref=Link&loc=mysways';

/** Combined status of the screen-time queries a view depends on. */
export function getScreenTimeStatus(
  queries: { error: Error | null; isPending: boolean; data?: unknown[] }[],
): ScreenTimeStatus {
  if (queries.some(({ error }) => isNotFoundError(error))) return 'empty';
  if (queries.some(({ error }) => error != null)) return 'error';
  if (queries.some(({ isPending }) => isPending)) return 'loading';
  if (queries.every(({ data }) => !data?.length)) return 'empty';
  return 'default';
}

/** Formats a duration in minutes as "1h27min" (or "45min" under 1 h). */
export function formatDuration(minutes: number): string {
  const total = Math.round(minutes);
  const hours = Math.floor(total / 60);
  const remainingMinutes = total % 60;

  if (hours > 0) {
    return `${hours}h${String(remainingMinutes).padStart(2, '0')}min`;
  }
  return `${remainingMinutes}min`;
}

export function sumMinutes(entries: { durationMinutes: number }[]): number {
  return entries.reduce((total, entry) => total + entry.durationMinutes, 0);
}

export function getKidShortLabel(firstName: string): string {
  const initial = firstName.trim().charAt(0).toUpperCase();
  return `${initial}.`;
}

export function getToday(): string {
  return dayjs().format(DATE_FORMAT);
}

export function addDays(date: string, days: number): string {
  return dayjs(date).add(days, 'day').format(DATE_FORMAT);
}

/** Monday..Sunday bounds of the week containing `date`, without the dayjs isoWeek plugin. */
export function getWeekBounds(date: string): { start: string; end: string } {
  const start = addDays(date, -((dayjs(date).day() + 6) % 7));
  return { start, end: addDays(start, 6) };
}

/** School year bounds [1 Sept, 31 Aug] containing `today`. */
export function getSchoolYearBounds(today: string): {
  start: string;
  end: string;
} {
  const d = dayjs(today);
  // month() is 0-based: 8 is September.
  const startYear = d.month() < 8 ? d.year() - 1 : d.year();
  return { start: `${startYear}-09-01`, end: `${startYear + 1}-08-31` };
}

/**
 * Date of the previous day/week, or `undefined` when it would leave the
 * school year of `today`.
 */
export function getPreviousPeriodDate(
  view: ScreenTimeView,
  date: string,
  today: string,
): string | undefined {
  const { start } = getSchoolYearBounds(today);
  const periodStart = view === 'weekly' ? getWeekBounds(date).start : date;
  if (periodStart <= start) return undefined;

  const previous = addDays(periodStart, view === 'weekly' ? -7 : -1);
  // The first week of the school year may start in August: open it on
  // 1 September instead.
  return previous < start ? start : previous;
}

/**
 * Date of the next day/week, or `undefined` when it would leave the school
 * year of `today`.
 */
export function getNextPeriodDate(
  view: ScreenTimeView,
  date: string,
  today: string,
): string | undefined {
  const { end } = getSchoolYearBounds(today);
  const next =
    view === 'weekly'
      ? addDays(getWeekBounds(date).start, 7)
      : addDays(date, 1);
  return next <= end ? next : undefined;
}

export function getAxisMax(view: ScreenTimeView, values: number[]): number {
  const max = values.length > 0 ? Math.max(...values) : 0;
  if (max === 0) {
    return SCREEN_TIME_AXIS[view].defaultMax;
  }
  return view === 'weekly' ? Math.ceil(max) : Math.ceil(max / 5) * 5;
}

export function getAxisLabelStep(
  view: ScreenTimeView,
  axisMax: number,
): number {
  if (view === 'daily') {
    return 5;
  }
  return axisMax > 6 ? 2 : 1;
}

export function buildWeeklyBars(
  weekStart: string,
  days: ScreenTimeDayEntry[],
  formatDate: (date: string, format: string) => string,
): ScreenTimeChartBar[] {
  return Array.from({ length: 7 }, (_, index) => {
    const dayKey = dayjs(weekStart).add(index, 'day').format(DATE_FORMAT);
    const entry = days.find((d) => d.date.startsWith(dayKey));
    const minutes = entry?.durationMinutes ?? 0;
    const weekdayInitial = formatDate(dayKey, 'dd').charAt(0).toUpperCase();

    return {
      label: [weekdayInitial, formatDate(dayKey, 'D')],
      srLabel: formatDate(dayKey, 'dddd D MMMM'),
      value: minutes / 60,
      tooltip: formatDuration(minutes),
    };
  });
}

export function buildDailyBars(
  hours: ScreenTimeHourEntry[],
): ScreenTimeChartBar[] {
  return Array.from({ length: 24 }, (_, index) => {
    const entry = hours.find((h) => Number(h.hour) === index);
    const minutes = entry?.durationMinutes ?? 0;
    const hh = String(index).padStart(2, '0');

    return {
      label: index % 2 === 0 ? [`${hh}h`] : [''],
      srLabel: `${hh}h`,
      value: minutes,
      tooltip: formatDuration(minutes),
    };
  });
}
