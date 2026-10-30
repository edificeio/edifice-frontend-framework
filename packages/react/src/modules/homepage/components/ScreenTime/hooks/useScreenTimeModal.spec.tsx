import {
  mockScreenTimeKidIds,
  mockScreenTimeMinutesPerWeekday,
} from '@edifice.io/config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, ReactNode } from 'react';
import { MockedProvider } from '../../../../../providers/MockedProvider/MockedProvider';
import { renderHook, waitFor } from '~/setup';
import { useScreenTimeModal } from './useScreenTimeModal';

// Requests are answered by the MSW screen-time mock, whose scenario depends
// on the kid id (see mockScreenTimeKidIds).

const { useUser } = vi.hoisted(() => ({ useUser: vi.fn() }));

vi.mock('../../../../../hooks', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../../../../hooks')>()),
  useUser,
}));

const parent = {
  userId: 'parent-1',
  firstName: 'Sacha',
  lastName: 'Dupont',
  children: Object.fromEntries(
    ['alice-id', ...Object.values(mockScreenTimeKidIds)].map((id) => [
      id,
      { firstName: id, lastName: 'Lindo' },
    ]),
  ),
};

// The queries set their own `retry`, which overrides `retry: false`:
// `retryDelay: 0` keeps the error tests fast.
function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, retryDelay: 0 } },
  });
  return (
    <MockedProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MockedProvider>
  );
}

// Renders the hook with the modal opened on the given kid.
function renderModalHook(initialKidId = 'alice-id') {
  const hook = renderHook(() => useScreenTimeModal(), { wrapper });
  act(() => hook.result.current.open(initialKidId));
  return hook;
}

describe('useScreenTimeModal', () => {
  beforeEach(() => {
    useUser.mockReturnValue({ user: parent });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('with today pinned mid school-year (2026-06-24, a Wednesday)', () => {
    beforeEach(() => {
      vi.useFakeTimers({ toFake: ['Date'] });
      vi.setSystemTime(new Date('2026-06-24T10:00:00Z'));
    });

    it("starts in weekly view on today's week, on the initial kid", async () => {
      const { result } = renderModalHook();

      expect(result.current.view).toBe('weekly');
      expect(result.current.date).toBe('2026-06-24');
      expect(result.current.selectedKid?.id).toBe('alice-id');

      await waitFor(() => expect(result.current.status).toBe('default'));
      expect(result.current.days?.map((day) => day.durationMinutes)).toEqual(
        mockScreenTimeMinutesPerWeekday,
      );
    });

    it('fetches nothing until opened', () => {
      const { result } = renderHook(() => useScreenTimeModal(), { wrapper });

      expect(result.current.isOpen).toBe(false);
      expect(result.current.status).toBe('loading');
    });

    it('starts back on the weekly view of today when reopened', () => {
      const { result } = renderModalHook();
      act(() => result.current.onViewChange('daily'));
      act(() => result.current.onPrevious());
      act(() => result.current.onClose());

      act(() => result.current.open('alice-id'));

      expect(result.current.isOpen).toBe(true);
      expect(result.current.view).toBe('weekly');
      expect(result.current.date).toBe('2026-06-24');
    });

    it('loads the hourly data once switched to the daily view', async () => {
      const { result } = renderModalHook();
      await waitFor(() => expect(result.current.status).toBe('default'));

      act(() => result.current.onViewChange('daily'));

      await waitFor(() => expect(result.current.hours).toHaveLength(24));
    });

    it('moves to the previous Monday on `onPrevious` in the weekly view', () => {
      const { result } = renderModalHook();

      act(() => result.current.onPrevious());

      expect(result.current.date).toBe('2026-06-15');
    });

    it('moves one day forward on `onNext` in the daily view', () => {
      const { result } = renderModalHook();
      act(() => result.current.onViewChange('daily'));

      act(() => result.current.onNext());

      expect(result.current.date).toBe('2026-06-25');
    });

    it('requests the newly picked kid', async () => {
      const { result } = renderModalHook();
      await waitFor(() => expect(result.current.status).toBe('default'));

      act(() => result.current.onKidChange(mockScreenTimeKidIds.empty));

      await waitFor(() => expect(result.current.status).toBe('empty'));
    });

    it.each([
      [mockScreenTimeKidIds.notFound, 'empty'],
      [mockScreenTimeKidIds.empty, 'empty'],
      [mockScreenTimeKidIds.error, 'error'],
    ])('exposes the status of kid %s as %s', async (kidId, status) => {
      const { result } = renderModalHook(kidId);

      await waitFor(() => expect(result.current.status).toBe(status));
    });

    it('exposes the loading status while the request is pending', () => {
      const { result } = renderModalHook(mockScreenTimeKidIds.pending);

      expect(result.current.status).toBe('loading');
    });
  });

  describe('school-year browsing bounds', () => {
    it('disallows going to the previous week when it falls before the school year start', () => {
      vi.useFakeTimers({ toFake: ['Date'] });
      vi.setSystemTime(new Date('2025-09-03T10:00:00Z')); // Wednesday, week start 2025-09-01

      const { result } = renderModalHook();

      expect(result.current.canGoPrevious).toBe(false);
      expect(result.current.canGoNext).toBe(true);
    });

    it('reaches the first week of the school year when it starts in August, opening it on 1 September', () => {
      vi.useFakeTimers({ toFake: ['Date'] });
      vi.setSystemTime(new Date('2026-09-08T10:00:00Z')); // 1 Sept 2026 is a Tuesday

      const { result } = renderModalHook();
      expect(result.current.canGoPrevious).toBe(true);

      act(() => result.current.onPrevious());

      expect(result.current.date).toBe('2026-09-01');
      expect(result.current.canGoPrevious).toBe(false);
    });

    it('disallows going to the next day when it falls after the school year end', () => {
      vi.useFakeTimers({ toFake: ['Date'] });
      vi.setSystemTime(new Date('2026-08-31T10:00:00Z'));

      const { result } = renderModalHook();
      act(() => result.current.onViewChange('daily'));

      expect(result.current.canGoNext).toBe(false);
      expect(result.current.canGoPrevious).toBe(true);
    });
  });
});
