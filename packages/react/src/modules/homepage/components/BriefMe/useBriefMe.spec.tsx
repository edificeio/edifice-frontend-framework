import { School } from '@edifice.io/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { MockedProvider } from '../../../../providers/MockedProvider/MockedProvider';
import { act, renderHook, waitFor } from '~/setup';
import { buildGarLink, useBriefMe } from './useBriefMe';

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

describe('buildGarLink', () => {
  it('substitutes the school UAI and GAR code, base64-encoded', () => {
    const link = buildGarLink(
      'https://brief.me/ID_ETAB/ID_ENT/article',
      school,
    );

    expect(link).toBe(
      `https://brief.me/${btoa('1111888G')}/${btoa('P0')}/article`,
    );
  });

  it('falls back to the first export when none starts with GAR-', () => {
    const link = buildGarLink('https://brief.me/ID_ENT', {
      ...school,
      exports: ['OTHER-X'],
    });

    expect(link).toBe(`https://brief.me/${btoa('OTHER-X')}`);
  });

  it('encodes an empty GAR code when exports are null or empty', () => {
    expect(buildGarLink('ID_ENT', { ...school, exports: null })).toBe(btoa(''));
    expect(buildGarLink('ID_ENT', { ...school, exports: [] })).toBe(btoa(''));
  });

  it('encodes empty values when no school is selected', () => {
    expect(buildGarLink('ID_ETAB/ID_ENT', undefined)).toBe(
      `${btoa('')}/${btoa('')}`,
    );
  });

  it('replaces only the first occurrence of each placeholder', () => {
    expect(buildGarLink('ID_ETAB-ID_ETAB', school)).toBe(
      `${btoa('1111888G')}-ID_ETAB`,
    );
  });
});

describe('useBriefMe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isResponseError.mockReturnValue(false);
    useUserSchools.mockReturnValue({ selectedSchool: school });
  });

  it('exposes the loading status while the feed is pending', () => {
    get.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useBriefMe(), { wrapper });

    expect(result.current.status).toBe('loading');
    expect(result.current.category).toBe('briefme');
  });

  it('maps the feed entries into resolved articles', async () => {
    get.mockResolvedValue({
      results: [
        {
          title: 'Un titre',
          published_at: '2021-03-24',
          url: 'https://brief.me/ID_ETAB/ID_ENT/a',
        },
      ],
    });

    const { result } = renderHook(() => useBriefMe(), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('default'));
    expect(get).toHaveBeenCalledWith(
      '/appregistry/widget/cache/external/briefme',
    );
    expect(result.current.articles).toEqual([
      {
        id: 'https://brief.me/ID_ETAB/ID_ENT/a',
        date: '24 mars 2021',
        title: 'Un titre',
        url: `https://brief.me/${btoa('1111888G')}/${btoa('P0')}/a`,
      },
    ]);
  });

  it('exposes the empty status when the feed has no article', async () => {
    get.mockResolvedValue({ results: [] });

    const { result } = renderHook(() => useBriefMe(), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('empty'));
  });

  it('exposes the error status when app-registry reports a failure as HTTP 200', async () => {
    get.mockResolvedValue({ error: 'widget.external.cache.failure' });

    const { result } = renderHook(() => useBriefMe(), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('error'));
  });

  it('exposes the error status on an HTTP error', async () => {
    isResponseError.mockReturnValue(true);
    get.mockResolvedValue(undefined);

    const { result } = renderHook(() => useBriefMe(), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('error'));
  });

  it('queries the endpoint of the selected category', async () => {
    get.mockResolvedValue({ results: [] });

    const { result } = renderHook(() => useBriefMe(), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('empty'));

    act(() => result.current.setCategory('brief-science'));

    await waitFor(() =>
      expect(get).toHaveBeenCalledWith(
        '/appregistry/widget/cache/external/briefscience',
      ),
    );
  });
});
