import { renderHook, waitFor } from '~/setup';
import useResource from './useResource';

const { resource, searchResource } = vi.hoisted(() => ({
  resource: vi.fn(),
  searchResource: vi.fn(),
}));

vi.mock('@edifice.io/client', () => ({
  odeServices: { resource },
}));

describe('useResource', () => {
  beforeEach(() => {
    resource.mockReturnValue({ searchResource });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and returns the resource on mount', async () => {
    const fetched = { assetId: 'id-1', name: 'My resource' };
    searchResource.mockResolvedValue(fetched);

    const { result } = renderHook(() => useResource('blog', 'id-1'));

    await waitFor(() => expect(result.current).toEqual(fetched));
    expect(resource).toHaveBeenCalledWith('blog');
    expect(searchResource).toHaveBeenCalledWith({
      application: 'blog',
      id: 'id-1',
    });
  });

  it('does not fetch when the id is empty', () => {
    renderHook(() => useResource('blog', ''));

    expect(searchResource).not.toHaveBeenCalled();
  });

  it('stays null when the fetch fails', async () => {
    searchResource.mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => useResource('blog', 'id-1'));

    await waitFor(() => expect(searchResource).toHaveBeenCalled());
    expect(result.current).toBeNull();
  });
});
