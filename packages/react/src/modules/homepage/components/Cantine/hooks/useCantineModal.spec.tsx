import { School } from '@edifice.io/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { act, ReactNode } from 'react';
import { MockedProvider } from '../../../../../providers/MockedProvider/MockedProvider';
import { renderHook, waitFor } from '~/setup';
import { CantineMenuItem } from './useCantineMenu';
import { useCantineModal } from './useCantineModal';

const { get, isResponseError, latestResponse, useUserSchools } = vi.hoisted(
  () => ({
    get: vi.fn(),
    isResponseError: vi.fn(),
    latestResponse: { statusText: 'Internal Server Error' },
    useUserSchools: vi.fn(),
  }),
);

vi.mock('@edifice.io/client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@edifice.io/client')>()),
  odeServices: {
    http: () => ({ get, isResponseError, latestResponse }),
  },
}));

vi.mock('../../SchoolSpace/useUserSchools', () => ({ useUserSchools }));

function makeSchool(id: string, uai: string): School {
  return { id, name: id, UAI: uai, exports: [], classes: [] } as School;
}

const schools = [
  makeSchool('school-1', '1111888G'),
  makeSchool('school-2', '2222999H'),
];

const lunch: CantineMenuItem[] = [{ type: 'entree', nom: 'Coleslaw' }];
const dinner: CantineMenuItem[] = [{ type: 'plat', nom: 'Soupe' }];

// A fresh client per render, with retries off so error assertions resolve
// immediately instead of waiting out the default exponential backoff.
function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <MockedProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MockedProvider>
  );
}

describe('useCantineModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isResponseError.mockReturnValue(false);
    useUserSchools.mockReturnValue({
      schools,
      selectedSchool: schools[0],
      handleSelectedSchoolChange: vi.fn(),
    });
  });

  it('starts on today, on the school selected in the homepage', async () => {
    get.mockResolvedValue({ menu: lunch });

    const { result } = renderHook(() => useCantineModal(), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('default'));

    expect(result.current.date).toBe(dayjs().format('YYYY-MM-DD'));
    expect(get).toHaveBeenCalledWith(
      `/appregistry/1111888G/cantine/menu?date=${dayjs().format('YYYY-MM-DD')}`,
    );
  });

  it('queries the newly picked school without touching the shared selection', async () => {
    get.mockResolvedValue({ menu: lunch });

    const { result } = renderHook(() => useCantineModal(), { wrapper });
    await waitFor(() => expect(result.current.status).toBe('default'));

    act(() => result.current.onSchoolChange('school-2'));

    await waitFor(() =>
      expect(get).toHaveBeenCalledWith(
        `/appregistry/2222999H/cantine/menu?date=${dayjs().format('YYYY-MM-DD')}`,
      ),
    );
    expect(
      useUserSchools.mock.results[0].value.handleSelectedSchoolChange,
    ).not.toHaveBeenCalled();
  });

  it('exposes the error status on an API failure', async () => {
    isResponseError.mockReturnValue(true);
    get.mockResolvedValue(undefined);

    const { result } = renderHook(() => useCantineModal(), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('error'));
  });

  it('exposes the dinner service and its dishes when the school serves one', async () => {
    get.mockResolvedValue({
      menu: lunch,
      dinnerAvailable: true,
      dinnerMenu: dinner,
    });

    const { result } = renderHook(() => useCantineModal(), { wrapper });
    await waitFor(() => expect(result.current.hasDinner).toBe(true));

    expect(result.current.sections[0].items[0].label).toBe('Coleslaw');

    act(() => result.current.onMenuTypeChange('dinner'));

    expect(result.current.menuType).toBe('dinner');
    expect(result.current.sections[0].items[0].label).toBe('Soupe');
  });

  it('falls back on lunch when the day has no dinner service', async () => {
    get.mockResolvedValue({ menu: lunch, dinnerAvailable: false });

    const { result } = renderHook(() => useCantineModal(), { wrapper });
    await waitFor(() => expect(result.current.status).toBe('default'));

    act(() => result.current.onMenuTypeChange('dinner'));

    expect(result.current.hasDinner).toBe(false);
    expect(result.current.menuType).toBe('lunch');
  });

  it('browses days within 40 days around today', async () => {
    get.mockResolvedValue({ menu: lunch });

    const { result } = renderHook(() => useCantineModal(), { wrapper });
    await waitFor(() => expect(result.current.status).toBe('default'));

    expect(result.current.canGoPrevious).toBe(true);
    expect(result.current.canGoNext).toBe(true);

    for (let day = 0; day < 40; day++) {
      act(() => result.current.onNextDay());
    }

    expect(result.current.date).toBe(
      dayjs().add(40, 'day').format('YYYY-MM-DD'),
    );
    expect(result.current.canGoNext).toBe(false);
    expect(result.current.canGoPrevious).toBe(true);
  });
});
