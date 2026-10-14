import 'dayjs/locale/fr.js';
import dayjs from 'dayjs';
import {
  buildDailyBars,
  buildWeeklyBars,
  formatDuration,
  getAxisLabelStep,
  getAxisMax,
  getKidShortLabel,
  getSchoolYearBounds,
  getWeekBounds,
  getNextPeriodDate,
  getPreviousPeriodDate,
} from './utils';

// Formats like the real `useDate().formatDate` would, in French.
function formatDate(date: string, format: string): string {
  return dayjs(date).locale('fr').format(format);
}

describe('formatDuration', () => {
  it('formats 0 minutes as "0min"', () => {
    expect(formatDuration(0)).toBe('0min');
  });

  it('formats under an hour as "<minutes>min"', () => {
    expect(formatDuration(45)).toBe('45min');
  });

  it('formats over an hour as "<h>h<mm>min"', () => {
    expect(formatDuration(87)).toBe('1h27min');
  });

  it('pads the minutes part below 10', () => {
    expect(formatDuration(121)).toBe('2h01min');
  });

  it('rounds the total before splitting hours and minutes', () => {
    expect(formatDuration(59.6)).toBe('1h00min');
  });
});

describe('getKidShortLabel', () => {
  it('returns the uppercased first initial followed by a dot', () => {
    expect(getKidShortLabel('marc')).toBe('M.');
  });
});

describe('getWeekBounds', () => {
  it('returns Monday..Sunday of the week containing a Wednesday', () => {
    expect(getWeekBounds('2026-06-24')).toEqual({
      start: '2026-06-22',
      end: '2026-06-28',
    });
  });

  it('returns the previous Monday for a Sunday, not the next week', () => {
    expect(getWeekBounds('2026-06-28')).toEqual({
      start: '2026-06-22',
      end: '2026-06-28',
    });
  });

  it('returns itself as the start for a Monday', () => {
    expect(getWeekBounds('2026-06-22')).toEqual({
      start: '2026-06-22',
      end: '2026-06-28',
    });
  });
});

describe('getSchoolYearBounds', () => {
  it('resolves 2025-09-01..2026-08-31 for a date in March 2026', () => {
    expect(getSchoolYearBounds('2026-03-15')).toEqual({
      start: '2025-09-01',
      end: '2026-08-31',
    });
  });

  it('resolves 2025-09-01..2026-08-31 for a date in October 2025', () => {
    expect(getSchoolYearBounds('2025-10-10')).toEqual({
      start: '2025-09-01',
      end: '2026-08-31',
    });
  });
});

describe('getPreviousPeriodDate', () => {
  const today = '2026-10-13';

  it('moves to the previous Monday in the weekly view', () => {
    expect(getPreviousPeriodDate('weekly', '2026-10-14', today)).toBe(
      '2026-10-05',
    );
  });

  it('moves to the previous day in the daily view', () => {
    expect(getPreviousPeriodDate('daily', '2026-10-14', today)).toBe(
      '2026-10-13',
    );
  });

  it('opens on 1 September a first week that starts in August', () => {
    // 1 Sept 2026 is a Tuesday: its week starts on Monday 31 August.
    expect(getPreviousPeriodDate('weekly', '2026-09-08', today)).toBe(
      '2026-09-01',
    );
  });

  it('stops at the school year start', () => {
    expect(getPreviousPeriodDate('weekly', '2026-09-01', today)).toBe(
      undefined,
    );
    expect(getPreviousPeriodDate('daily', '2026-09-01', today)).toBe(undefined);
  });
});

describe('getNextPeriodDate', () => {
  const today = '2026-03-15';

  it('moves to the next Monday in the weekly view', () => {
    expect(getNextPeriodDate('weekly', '2026-03-18', today)).toBe('2026-03-23');
  });

  it('moves to the next day in the daily view', () => {
    expect(getNextPeriodDate('daily', '2026-03-18', today)).toBe('2026-03-19');
  });

  it('stops at the school year end', () => {
    expect(getNextPeriodDate('daily', '2026-08-31', today)).toBe(undefined);
    expect(getNextPeriodDate('weekly', '2026-08-31', today)).toBe(undefined);
  });
});

describe('getAxisMax', () => {
  it('defaults to 12 for an empty weekly series', () => {
    expect(getAxisMax('weekly', [])).toBe(12);
  });

  it('defaults to 12 for an all-zero weekly series', () => {
    expect(getAxisMax('weekly', [0, 0])).toBe(12);
  });

  it('rounds the weekly max up', () => {
    expect(getAxisMax('weekly', [2.6, 1])).toBe(3);
  });

  it('rounds a weekly max just under 12 up to 12', () => {
    expect(getAxisMax('weekly', [11.4])).toBe(12);
  });

  it('defaults to 30 for an empty daily series', () => {
    expect(getAxisMax('daily', [])).toBe(30);
  });

  it('rounds a daily max up to the next multiple of 5', () => {
    expect(getAxisMax('daily', [12])).toBe(15);
  });

  it('rounds a daily max exceeding the default up to the next multiple of 5', () => {
    expect(getAxisMax('daily', [42])).toBe(45);
  });
});

describe('getAxisLabelStep', () => {
  it('uses a step of 1 for a small weekly axis max', () => {
    expect(getAxisLabelStep('weekly', 3)).toBe(1);
  });

  it('uses a step of 1 for a weekly axis max of 6', () => {
    expect(getAxisLabelStep('weekly', 6)).toBe(1);
  });

  it('uses a step of 2 for a weekly axis max above 6', () => {
    expect(getAxisLabelStep('weekly', 12)).toBe(2);
  });

  it('always uses a step of 5 for the daily view', () => {
    expect(getAxisLabelStep('daily', 30)).toBe(5);
  });
});

describe('buildWeeklyBars', () => {
  it('returns 7 bars even without any entry', () => {
    expect(buildWeeklyBars('2026-06-22', [], formatDate)).toHaveLength(7);
  });

  it('places an entry on the slot matching its date, converts minutes to hours and labels it in French', () => {
    const bars = buildWeeklyBars(
      '2026-06-22',
      [
        {
          date: '2026-06-24T00:00:00Z',
          durationMinutes: 90,
          schoolUsePercentage: 0,
        },
      ],
      formatDate,
    );

    expect(bars[2]).toEqual({
      label: ['M', '24'],
      srLabel: 'mercredi 24 juin',
      value: 1.5,
      tooltip: '1h30min',
    });
  });
});

describe('buildDailyBars', () => {
  it('returns 24 bars even without any entry', () => {
    expect(buildDailyBars([])).toHaveLength(24);
  });

  it('places an unpadded hour entry on the matching index', () => {
    const bars = buildDailyBars([
      { hour: '7', durationMinutes: 42, schoolUsePercentage: 0 },
    ]);

    expect(bars[7].value).toBe(42);
  });

  it('labels even hours with "<hh>h"', () => {
    const bars = buildDailyBars([]);
    expect(bars[0].label).toEqual(['00h']);
  });

  it('labels odd hours with an empty string', () => {
    const bars = buildDailyBars([]);
    expect(bars[1].label).toEqual(['']);
  });

  it('still gives a full srLabel to odd hours despite the empty visual label', () => {
    const bars = buildDailyBars([]);
    expect(bars[1].srLabel).toBe('01h');
  });
});
