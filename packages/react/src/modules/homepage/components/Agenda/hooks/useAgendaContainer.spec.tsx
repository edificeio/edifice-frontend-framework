import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { renderHook, waitFor } from '~/setup';
import { MAX_VISIBLE_EVENTS, useAgendaContainer } from './useAgendaContainer';

const { get } = vi.hoisted(() => ({ get: vi.fn() }));

vi.mock('@edifice.io/client', () => ({
  odeServices: { http: () => ({ get }) },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const calendar = {
  _id: 'c1',
  title: 'Mon agenda',
  color: 'cyan',
  isExternal: false,
};

const event = (
  id: string,
  startMoment: string,
  endMoment: string,
  allday = false,
) => ({
  _id: id,
  title: `Event ${id}`,
  allday,
  startMoment,
  endMoment,
  calendar: ['c1'],
});

const mockApi = (events: ReturnType<typeof event>[]) => {
  get.mockImplementation((url: string) => {
    if (url.includes('/calendar/calendars')) {
      return Promise.resolve([calendar]);
    }
    return Promise.resolve(events);
  });
};

describe('useAgendaContainer', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('does not fetch events before the calendars have loaded', async () => {
    get.mockImplementation((url: string) => {
      if (url.includes('/calendar/calendars')) {
        return new Promise(() => {
          // never resolves: calendars are still loading
        });
      }
      throw new Error('should not fetch events yet');
    });

    renderHook(() => useAgendaContainer(), { wrapper: createWrapper() });

    await waitFor(() =>
      expect(get).toHaveBeenCalledWith('/calendar/calendars'),
    );
    expect(get).toHaveBeenCalledTimes(1);
  });

  it('drops events that have fully elapsed', async () => {
    mockApi([
      event('past', '2020-01-01T09:00:00.000Z', '2020-01-01T10:00:00.000Z'),
      event(
        'ongoing',
        new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        new Date(Date.now() + 1000 * 60 * 60).toISOString(),
      ),
    ]);

    const { result } = renderHook(() => useAgendaContainer(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.events.map((e) => e.id)).toEqual(['ongoing']);
  });

  it('sorts the remaining events chronologically', async () => {
    const inHours = (hours: number) =>
      new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
    mockApi([
      event('later', inHours(5), inHours(6)),
      event('sooner', inHours(1), inHours(2)),
    ]);

    const { result } = renderHook(() => useAgendaContainer(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.events.map((e) => e.id)).toEqual(['sooner', 'later']);
  });

  it(`keeps only the first ${MAX_VISIBLE_EVENTS} upcoming events`, async () => {
    const inHours = (hours: number) =>
      new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
    mockApi(
      Array.from({ length: MAX_VISIBLE_EVENTS + 2 }, (_, index) =>
        event(`e${index}`, inHours(index + 1), inHours(index + 2)),
      ),
    );

    const { result } = renderHook(() => useAgendaContainer(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.events).toHaveLength(MAX_VISIBLE_EVENTS);
  });
});
