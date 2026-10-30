import {
  mockScreenTimeKidIds,
  mockScreenTimeMinutesPerHour,
} from '@edifice.io/config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, ReactNode } from 'react';
import { MockedProvider } from '../../../../../providers/MockedProvider/MockedProvider';
import { renderHook, waitFor } from '~/setup';
import { useScreenTimeContainer } from './useScreenTimeContainer';

// Requests are answered by the MSW screen-time mock, whose scenario depends
// on the kid id (see mockScreenTimeKidIds).

const { useUser, useEdificeClient } = vi.hoisted(() => ({
  useUser: vi.fn(),
  useEdificeClient: vi.fn(),
}));

vi.mock('../../../../../hooks', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../../../../hooks')>()),
  useUser,
}));

vi.mock(
  '../../../../../providers/EdificeClientProvider/EdificeClientProvider.hook',
  async (importOriginal) => ({
    ...(await importOriginal<
      typeof import('../../../../../providers/EdificeClientProvider/EdificeClientProvider.hook')
    >()),
    useEdificeClient,
  }),
);

const studentWithId = (userId: string) => ({
  userId,
  firstName: 'Léa',
  lastName: 'Martin',
  children: {},
});

const parentOf = (...kidIds: string[]) => ({
  userId: 'parent-1',
  firstName: 'Sacha',
  lastName: 'Dupont',
  children: Object.fromEntries(
    kidIds.map((id) => [id, { firstName: id, lastName: 'Lindo' }]),
  ),
});

const dayTotal = mockScreenTimeMinutesPerHour.reduce((a, b) => a + b, 0);

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

describe('useScreenTimeContainer', () => {
  beforeEach(() => {
    useEdificeClient.mockReturnValue({ sessionQuery: { isError: false } });
  });

  it('selects the first child, then the requested one', async () => {
    useUser.mockReturnValue({
      user: parentOf('alice-id', mockScreenTimeKidIds.empty),
    });

    const { result } = renderHook(() => useScreenTimeContainer(), {
      wrapper,
    });

    expect(result.current.kids.map((kid) => kid.id)).toEqual([
      'alice-id',
      mockScreenTimeKidIds.empty,
    ]);
    expect(result.current.selectedKid?.id).toBe('alice-id');
    await waitFor(() => expect(result.current.status).toBe('default'));

    act(() => result.current.onKidChange(mockScreenTimeKidIds.empty));

    expect(result.current.selectedKid?.id).toBe(mockScreenTimeKidIds.empty);
    await waitFor(() => expect(result.current.status).toBe('empty'));
  });

  it('uses the user themself as the only kid when they have no children', () => {
    useUser.mockReturnValue({ user: studentWithId('student-1') });

    const { result } = renderHook(() => useScreenTimeContainer(), {
      wrapper,
    });

    expect(result.current.kids.map((kid) => kid.id)).toEqual(['student-1']);
    expect(result.current.selectedKid?.id).toBe('student-1');
  });

  it("sums today's and yesterday's hourly durations", async () => {
    useUser.mockReturnValue({ user: studentWithId('student-1') });

    const { result } = renderHook(() => useScreenTimeContainer(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.status).toBe('default'));
    expect(result.current.todayMinutes).toBe(dayTotal);
    expect(result.current.yesterdayMinutes).toBe(dayTotal);
  });

  it('exposes the default status with 0 minutes when every hour is at 0', async () => {
    useUser.mockReturnValue({
      user: studentWithId(mockScreenTimeKidIds.zero),
    });

    const { result } = renderHook(() => useScreenTimeContainer(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.status).toBe('default'));
    expect(result.current.todayMinutes).toBe(0);
    expect(result.current.yesterdayMinutes).toBe(0);
  });

  it.each([
    [mockScreenTimeKidIds.notFound, 'empty'],
    [mockScreenTimeKidIds.empty, 'empty'],
    [mockScreenTimeKidIds.error, 'error'],
  ])('exposes the status of kid %s as %s', async (kidId, status) => {
    useUser.mockReturnValue({ user: studentWithId(kidId) });

    const { result } = renderHook(() => useScreenTimeContainer(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.status).toBe(status));
  });

  it('exposes the loading status while requests are pending', () => {
    useUser.mockReturnValue({
      user: studentWithId(mockScreenTimeKidIds.pending),
    });

    const { result } = renderHook(() => useScreenTimeContainer(), {
      wrapper,
    });

    expect(result.current.status).toBe('loading');
  });

  it('exposes the loading status while the session has no user yet', () => {
    useUser.mockReturnValue({ user: undefined });

    const { result } = renderHook(() => useScreenTimeContainer(), {
      wrapper,
    });

    expect(result.current.status).toBe('loading');
  });

  it('exposes the error status when the session request failed', () => {
    useUser.mockReturnValue({ user: undefined });
    useEdificeClient.mockReturnValue({ sessionQuery: { isError: true } });

    const { result } = renderHook(() => useScreenTimeContainer(), {
      wrapper,
    });

    expect(result.current.status).toBe('error');
  });
});
