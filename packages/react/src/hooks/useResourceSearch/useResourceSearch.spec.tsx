import { act, renderHook, waitFor } from '~/setup';
import { useResourceSearch } from './useResourceSearch';

const { initialize, registerBehaviours, behaviour, loadResources } = vi.hoisted(
  () => ({
    initialize: vi.fn(),
    registerBehaviours: vi.fn(),
    behaviour: vi.fn(),
    loadResources: vi.fn(),
  }),
);

vi.mock('@edifice.io/client', () => ({
  SnipletsService: {
    initialize,
    registerBehaviours,
    resourceProducingApps: ['blog', 'wiki'],
  },
  odeServices: { behaviour },
}));

describe('useResourceSearch', () => {
  beforeEach(() => {
    initialize.mockResolvedValue(undefined);
    registerBehaviours.mockResolvedValue(undefined);
    behaviour.mockReturnValue({ loadResources });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('initializes the sniplets service and exposes producing apps', async () => {
    const { result } = renderHook(() => useResourceSearch('blog' as any));

    await waitFor(() =>
      expect(result.current.resourceApplications).toEqual(['blog', 'wiki']),
    );
    expect(registerBehaviours).toHaveBeenCalledWith('blog');
  });

  it('loads resources for the first requested type', async () => {
    const payload = [{ id: 'r-1' }];
    loadResources.mockResolvedValue(payload);
    const { result } = renderHook(() => useResourceSearch('blog' as any));

    const filters = { types: ['blog'], search: 'foo' } as any;
    let returned;
    await act(async () => {
      returned = await result.current.loadResources(filters);
    });

    expect(behaviour).toHaveBeenCalledWith('blog', 'blog');
    expect(loadResources).toHaveBeenCalledWith(filters);
    expect(returned).toBe(payload);
  });
});
