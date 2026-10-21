import { School } from '@edifice.io/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { MockedProvider } from '../../../../providers/MockedProvider/MockedProvider';
import { renderHook, waitFor } from '~/setup';
import { EdumalinItem } from './types';
import { useEdumalin } from './useEdumalin';

const { get, latestResponse, useUserSchools } = vi.hoisted(() => ({
  get: vi.fn(),
  latestResponse: { status: 400, statusText: 'Bad Request' },
  useUserSchools: vi.fn(),
}));

// Mirrors HttpService: a non-2xx response rejects with its body, and the
// status is only available on `latestResponse`.
vi.mock('@edifice.io/client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@edifice.io/client')>()),
  odeServices: { http: () => ({ get, latestResponse }) },
}));

vi.mock('../../hooks/useUserSchools', () => ({ useUserSchools }));

const school = {
  id: 'school-1',
  name: 'MY DEV SCHOOL',
  UAI: '1111888G',
  exports: ['GAR-P0'],
  classes: [],
} as School;

const item = (title: string): EdumalinItem => ({
  title,
  type: { name: 'Annonce' },
});

// The backend wraps every failure in `{ error: <string> }`, where the string
// may itself be a JSON payload.
const backendError = (error: unknown) => ({
  error: typeof error === 'string' ? error : JSON.stringify(error),
});

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

beforeEach(() => {
  useUserSchools.mockReturnValue({ selectedSchool: school });
});

describe('useEdumalin', () => {
  it('keeps the first 3 items, in the order sent by Édumalin', async () => {
    get.mockResolvedValue({
      success: true,
      data: [item('A'), item('B'), item('C'), item('D')],
    });

    const { result } = renderHook(() => useEdumalin(), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('default'));
    expect(result.current.items.map(({ title }) => title)).toEqual([
      'A',
      'B',
      'C',
    ]);
  });

  it('is empty when Édumalin returns no content', async () => {
    get.mockResolvedValue({ data: [] });

    const { result } = renderHook(() => useEdumalin(), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('empty'));
  });

  it('reports a connection error when the backend cannot authenticate', async () => {
    get.mockRejectedValue(
      backendError({ error: 'edumalin.widget.unauthorized' }),
    );

    const { result } = renderHook(() => useEdumalin(), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('connectionError'));
    expect(result.current.error).toEqual({
      code: 400,
      message: 'edumalin.widget.unauthorized',
    });
  });

  it('reports a load error with the message of an Édumalin error payload', async () => {
    get.mockRejectedValue(
      backendError({ error: 'Not Found', message: 'Display not found' }),
    );

    const { result } = renderHook(() => useEdumalin(), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('loadError'));
    expect(result.current.error).toEqual({
      code: 400,
      message: 'Display not found',
    });
  });

  it('reports a load error with a raw error string as is', async () => {
    get.mockRejectedValue(backendError('Connection refused'));

    const { result } = renderHook(() => useEdumalin(), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('loadError'));
    expect(result.current.error?.message).toBe('Connection refused');
  });

  it('falls back to the status text when the body carries no error', async () => {
    latestResponse.statusText = 'Bad Gateway';
    get.mockRejectedValue('<html>502 Bad Gateway</html>');

    const { result } = renderHook(() => useEdumalin(), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('loadError'));
    expect(result.current.error?.message).toBe('Bad Gateway');
  });

  it('links to Édumalin through the GAR of the selected school', () => {
    get.mockResolvedValue({ data: [] });

    const { result } = renderHook(() => useEdumalin(), { wrapper });

    expect(result.current.edumalinUrl).toContain(`idEtab=${btoa('1111888G')}`);
  });
});
