import { renderHook, wrapper } from '~/setup';
import useDate from './useDate';

// The MockedProvider wrapper supplies currentLanguage = 'fr'.
function render() {
  return renderHook(() => useDate(), { wrapper });
}

describe('useDate', () => {
  describe('formatDate', () => {
    it('formats a short date using the localized L pattern', () => {
      const { result } = render();

      expect(result.current.formatDate('2021-03-24', 'short')).toBe(
        '24/03/2021',
      );
    });

    it('honors a custom dayjs format string', () => {
      const { result } = render();

      expect(result.current.formatDate('2021-03-24', 'YYYY-MM-DD')).toBe(
        '2021-03-24',
      );
    });

    it('formats a numeric (epoch) date', () => {
      const { result } = render();

      // 2021-06-15T12:00:00Z
      expect(result.current.formatDate(1623758400000, 'YYYY')).toBe('2021');
    });

    it('formats a MongoDate ($date epoch)', () => {
      const { result } = render();

      expect(result.current.formatDate({ $date: 1623758400000 }, 'YYYY')).toBe(
        '2021',
      );
    });

    it('returns an empty string for an invalid date', () => {
      const { result } = render();

      expect(
        result.current.formatDate('not a valid date at all', 'short'),
      ).toBe('');
    });
  });

  describe('comparisons', () => {
    it('dateIsSame compares by day and by unit', () => {
      const { result } = render();

      expect(result.current.dateIsSame('2021-03-24', '2021-03-24')).toBe(true);
      expect(result.current.dateIsSame('2021-03-24', '2021-03-25')).toBe(false);
      expect(
        result.current.dateIsSame('2021-03-24', '2021-03-25', 'month'),
      ).toBe(true);
    });

    it('dateIsSameOrAfter checks the ordering', () => {
      const { result } = render();

      expect(result.current.dateIsSameOrAfter('2021-03-25', '2021-03-24')).toBe(
        true,
      );
      expect(result.current.dateIsSameOrAfter('2021-03-23', '2021-03-24')).toBe(
        false,
      );
    });
  });

  describe('now-relative helpers', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it('dateIsToday reflects the system date', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2021, 5, 15, 12, 0, 0));
      const { result } = render();

      expect(result.current.dateIsToday('2021-06-15')).toBe(true);
      expect(result.current.dateIsToday('2000-01-01')).toBe(false);
    });

    it('formatTimeAgo returns the localized "Yesterday" label', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2021, 5, 15, 12, 0, 0));
      const { result } = render();

      expect(result.current.formatTimeAgo('2021-06-14')).toBe('Yesterday');
    });

    it('formatTimeAgo returns an empty string for an invalid date', () => {
      const { result } = render();

      expect(result.current.formatTimeAgo('not a valid date at all')).toBe('');
    });

    it('fromNow returns a non-empty string for a valid date', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2021, 5, 15, 12, 0, 0));
      const { result } = render();

      const value = result.current.fromNow('2021-06-14');
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    });

    it('fromNow returns an empty string for an invalid date', () => {
      const { result } = render();

      expect(result.current.fromNow('not a valid date at all')).toBe('');
    });
  });
});
