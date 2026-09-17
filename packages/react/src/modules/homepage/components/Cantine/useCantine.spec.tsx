import { School } from '@edifice.io/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { ReactNode } from 'react';
import { MockedProvider } from '../../../../providers/MockedProvider/MockedProvider';
import { renderHook, waitFor } from '~/setup';
import { CantineMenuItem, useCantine } from './useCantine';

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

vi.mock('../SchoolSpace/useUserSchools', () => ({ useUserSchools }));

const school = {
  id: 'school-1',
  name: 'MY DEV SCHOOL',
  UAI: '1111888G',
  exports: ['GAR-P0'],
  classes: [],
} as School;

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

describe('useCantine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isResponseError.mockReturnValue(false);
    useUserSchools.mockReturnValue({ selectedSchool: school });
  });

  it('exposes the loading status while the menu is pending', () => {
    get.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useCantine(), { wrapper });

    expect(result.current.status).toBe('loading');
  });

  it('queries the endpoint of the selected school for today', async () => {
    get.mockResolvedValue({ menu: [] });

    const { result } = renderHook(() => useCantine(), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('empty'));

    expect(get).toHaveBeenCalledWith(
      `/appregistry/1111888G/cantine/menu?date=${dayjs().format('YYYY-MM-DD')}`,
    );
  });

  it('exposes the empty status when the Gerest date-limit envelope is returned as HTTP 200', async () => {
    get.mockResolvedValue({ error: '0', nbObjet: 0, contenu: [] });

    const { result } = renderHook(() => useCantine(), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('empty'));
    expect(result.current.sections).toEqual([]);
  });

  it('exposes the empty status when the menu array is empty', async () => {
    get.mockResolvedValue({ menu: [] });

    const { result } = renderHook(() => useCantine(), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('empty'));
  });

  it('exposes the error status on an HTTP error, without parsing the empty body', async () => {
    isResponseError.mockReturnValue(true);
    get.mockResolvedValue(undefined);

    const { result } = renderHook(() => useCantine(), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('error'));
  });

  it('groups dishes by category in a fixed order, dropping empty categories and unknown types', async () => {
    const menu: CantineMenuItem[] = [
      { type: 'dessert', nom: 'Fruits au sirop' },
      { type: 'entree', nom: 'Coleslaw' },
      { type: 'entree', nom: 'Melon charentais' },
      { type: 'inconnu', nom: 'Plat mystère' },
    ];
    get.mockResolvedValue({ menu });

    const { result } = renderHook(() => useCantine(), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('default'));

    expect(result.current.sections.map((s) => s.category)).toEqual([
      'entree',
      'dessert',
    ]);
    expect(result.current.sections[0].items.map((i) => i.label)).toEqual([
      'Coleslaw',
      'Melon charentais',
    ]);
  });

  it('prefers designationMenu over nom, but falls back on a blank designationMenu', async () => {
    const menu: CantineMenuItem[] = [
      { type: 'entree', nom: 'Coleslaw', designationMenu: 'Coleslaw maison' },
      { type: 'plat', nom: 'Blanquette de veau', designationMenu: '   ' },
    ];
    get.mockResolvedValue({ menu });

    const { result } = renderHook(() => useCantine(), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('default'));

    const labels = result.current.sections.flatMap((s) =>
      s.items.map((i) => i.label),
    );
    expect(labels).toEqual(['Coleslaw maison', 'Blanquette de veau']);
  });

  it('derives allergens from allerg_ keys, replacing every underscore with a space', async () => {
    const menu: CantineMenuItem[] = [
      {
        type: 'entree',
        nom: 'Coleslaw',
        allerg_gluten: 1,
        allerg_fruits_a_coque: 1,
        allerg_lait: 0,
        allerg_oeuf: undefined,
      },
    ];
    get.mockResolvedValue({ menu });

    const { result } = renderHook(() => useCantine(), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('default'));

    expect(result.current.sections[0].items[0].allergens).toEqual([
      'gluten',
      'fruits a coque',
    ]);
  });
});
