import dayjs from 'dayjs';
import { getI18n } from 'react-i18next';

import { renderHook, wrapper } from '~/setup';
import useDate from './useDate';

/**
 * The MockedProvider sets `currentLanguage` to 'fr', so dayjs formats in
 * French. We align i18next on 'fr' too, so the label/pattern keys match the
 * dayjs locale and the outputs follow the date format spec examples.
 */

// Frozen "now": Wednesday, June 24th 2026 at 16:22.
const NOW = new Date(2026, 5, 24, 16, 22, 0);

const renderUseDate = () => renderHook(() => useDate(), { wrapper }).result;

// French formatting computed with dayjs, to assert weekday/week-dependent
// outputs without hardcoding locale data.
const fr = (date: Date, pattern: string) =>
  dayjs(date).locale('fr').format(pattern);

describe('useDate hook', () => {
  beforeAll(async () => {
    await getI18n().changeLanguage('fr');
  });

  afterAll(async () => {
    await getI18n().changeLanguage('en');
  });

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatRelativeDateTime (friendly, with time)', () => {
    it('uses a relative wording for recent dates', () => {
      const { current } = renderUseDate();
      expect(
        current.formatRelativeDateTime(new Date(2026, 5, 24, 15, 42)),
      ).toBe('il y a 40 minutes');
    });

    it('formats yesterday and tomorrow with time', () => {
      const { current } = renderUseDate();
      expect(
        current.formatRelativeDateTime(new Date(2026, 5, 23, 16, 22)),
      ).toBe('Hier à 16h22');
      expect(
        current.formatRelativeDateTime(new Date(2026, 5, 25, 16, 22)),
      ).toBe('Demain à 16h22');
    });

    it('formats a date within the week as a weekday with time', () => {
      const { current } = renderUseDate();
      const target = new Date(2026, 5, 28, 16, 22);
      expect(current.formatRelativeDateTime(target)).toBe(
        fr(target, 'dddd [à] HH[h]mm'),
      );
    });

    it('formats dates of the current and other years', () => {
      const { current } = renderUseDate();
      expect(
        current.formatRelativeDateTime(new Date(2026, 1, 10, 16, 22)),
      ).toBe('le 10 février à 16h22');
      expect(
        current.formatRelativeDateTime(new Date(2020, 10, 25, 16, 22)),
      ).toBe('le 25 novembre 2020 à 16h22');
    });
  });

  describe('formatRelativeDate (friendly, without time)', () => {
    it('formats yesterday, current year and other year without time', () => {
      const { current } = renderUseDate();
      expect(current.formatRelativeDate(new Date(2026, 5, 23, 16, 22))).toBe(
        'Hier',
      );
      expect(current.formatRelativeDate(new Date(2026, 1, 10, 16, 22))).toBe(
        '10 févr.',
      );
      expect(current.formatRelativeDate(new Date(2020, 10, 25, 16, 22))).toBe(
        '25 nov. 2020',
      );
    });
  });

  describe('simple & textual formats', () => {
    it('formatLongDateTime', () => {
      const { current } = renderUseDate();
      expect(current.formatLongDateTime(new Date(2021, 6, 23, 17, 46))).toBe(
        '23 juillet 2021 à 17:46',
      );
    });

    it('formatLongDate', () => {
      const { current } = renderUseDate();
      expect(current.formatLongDate(new Date(2021, 6, 23))).toBe(
        '23 juillet 2021',
      );
    });
  });

  describe('raw formats', () => {
    it('formatRawDate', () => {
      const { current } = renderUseDate();
      expect(current.formatRawDate(new Date(2025, 1, 28))).toBe('28/02/2025');
    });

    it('formatRawDateTime', () => {
      const { current } = renderUseDate();
      expect(current.formatRawDateTime(new Date(2019, 10, 18, 15, 36))).toBe(
        '18/11/2019 15:36',
      );
    });
  });

  describe('formatCalendarDate', () => {
    it('shows today/yesterday/tomorrow as words for every variant', () => {
      const { current } = renderUseDate();
      expect(current.formatCalendarDate(NOW, 'full')).toBe("Aujourd'hui");
      expect(current.formatCalendarDate(NOW, 'abbr')).toBe("Aujourd'hui");
      expect(current.formatCalendarDate(new Date(2026, 5, 23), 'short')).toBe(
        'Hier',
      );
    });

    it('formats full and short variants with weekday', () => {
      const { current } = renderUseDate();
      const sameYear = new Date(2026, 3, 16);
      const otherYear = new Date(2022, 0, 12);
      expect(current.formatCalendarDate(sameYear, 'full')).toBe(
        fr(sameYear, 'dddd D MMMM'),
      );
      expect(current.formatCalendarDate(otherYear, 'short')).toBe(
        fr(otherYear, 'dddd D MMM YYYY'),
      );
    });

    it('formats the abbreviated variant for current and other years', () => {
      const { current } = renderUseDate();
      expect(current.formatCalendarDate(new Date(2026, 3, 16), 'abbr')).toBe(
        '16/04',
      );
      expect(current.formatCalendarDate(new Date(2020, 7, 30), 'abbr')).toBe(
        '30/08/20',
      );
    });
  });

  describe('formatWeek', () => {
    it('formats the current week', () => {
      const { current } = renderUseDate();
      expect(current.formatWeek(NOW)).toBe('Cette semaine');
    });

    it('formats the next week with its bounds', () => {
      const { current } = renderUseDate();
      const next = new Date(2026, 6, 1);
      const start = dayjs(next).locale('fr').startOf('week');
      const end = dayjs(next).locale('fr').endOf('week');
      expect(current.formatWeek(next)).toBe(
        `Semaine prochaine (du ${start.format('D MMM')} au ${end.format('D MMM')})`,
      );
    });

    it('formats another week of the current year', () => {
      const { current } = renderUseDate();
      const other = new Date(2026, 0, 20);
      const start = dayjs(other).locale('fr').startOf('week');
      const end = dayjs(other).locale('fr').endOf('week');
      expect(current.formatWeek(other)).toBe(
        `Semaine du ${start.format('D')} au ${end.format('D MMMM')}`,
      );
    });
  });

  describe('conversions', () => {
    const ref = new Date(2021, 2, 24, 16, 36, 5);

    it('converts to a native Date, timestamp, ISO string and MongoDate', () => {
      const { current } = renderUseDate();
      expect(current.toJsDate(ref)?.getTime()).toBe(ref.getTime());
      expect(current.toTimestamp(ref)).toBe(ref.getTime());
      expect(current.toIsoDate(ref)).toBe(dayjs(ref).toISOString());
      expect(current.toMongoDate(ref)).toEqual({ $date: ref.getTime() });
    });

    it('round-trips a MongoDate input', () => {
      const { current } = renderUseDate();
      const mongo = { $date: ref.getTime() };
      expect(current.toTimestamp(mongo)).toBe(ref.getTime());
    });

    it('returns undefined for invalid input', () => {
      const { current } = renderUseDate();
      expect(current.toTimestamp('not-a-date')).toBeUndefined();
      expect(current.toJsDate('not-a-date')).toBeUndefined();
      expect(current.toIsoDate('not-a-date')).toBeUndefined();
      expect(current.toMongoDate('not-a-date')).toBeUndefined();
    });
  });

  describe('empty string for invalid dates', () => {
    it('returns "" from formatters when the date is invalid', () => {
      const { current } = renderUseDate();
      expect(current.formatRawDate('not-a-date')).toBe('');
      expect(current.formatRelativeDateTime('not-a-date')).toBe('');
      expect(current.formatCalendarDate('not-a-date')).toBe('');
      expect(current.formatWeek('not-a-date')).toBe('');
    });
  });

  describe('deprecated methods still work', () => {
    it('fromNow, formatDate and formatTimeAgo', () => {
      const { current } = renderUseDate();
      expect(current.fromNow(new Date(2026, 5, 24, 15, 42))).toBe(
        'il y a 40 minutes',
      );
      expect(current.formatDate(new Date(2025, 1, 28), 'short')).toBe(
        '28/02/2025',
      );
      expect(current.formatTimeAgo(new Date(2026, 5, 23, 16, 22))).toBe('Hier');
    });
  });
});
