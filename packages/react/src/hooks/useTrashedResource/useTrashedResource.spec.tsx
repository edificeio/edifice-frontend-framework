import { Component, type ReactNode } from 'react';
import { render, renderHook, screen, waitFor } from '~/setup';
import useTrashedResource from './useTrashedResource';

const { get } = vi.hoisted(() => ({
  get: vi.fn(),
}));

vi.mock('@edifice.io/client', () => ({
  odeServices: {
    http: () => ({ get }),
  },
}));

vi.mock('..', () => ({
  useUser: () => ({ user: { userId: 'user-1' } }),
}));

vi.mock(
  '../../providers/EdificeClientProvider/EdificeClientProvider.hook',
  () => ({
    useEdificeClient: () => ({ appCode: 'blog' }),
  }),
);

// Error boundary catching the Response thrown when a resource is trashed.
class Boundary extends Component<{ children: ReactNode }, { caught: boolean }> {
  state = { caught: false };
  static getDerivedStateFromError() {
    return { caught: true };
  }
  render() {
    return this.state.caught ? <div>error-caught</div> : this.props.children;
  }
}

function Trasher({ id }: { id: string }) {
  useTrashedResource(id);
  return <div>resource-ok</div>;
}

describe('useTrashedResource', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('requests the explorer API with the appCode and asset id', async () => {
    get.mockResolvedValue({ resources: [] });

    renderHook(() => useTrashedResource('res-1'));

    await waitFor(() =>
      expect(get).toHaveBeenCalledWith(
        '/explorer/resources?application=blog&resource_type=blog&asset_id[]=res-1',
      ),
    );
  });

  it('does not throw when the resource is not trashed', async () => {
    get.mockResolvedValue({
      resources: [{ assetId: 'res-1', trashed: false, trashedBy: [] }],
    });

    render(<Trasher id="res-1" />, { wrapper: Boundary });

    await waitFor(() => expect(get).toHaveBeenCalled());
    expect(screen.getByText('resource-ok')).toBeInTheDocument();
  });

  it('throws a 404 when the resource is trashed', async () => {
    get.mockResolvedValue({
      resources: [{ assetId: 'res-1', trashed: true, trashedBy: [] }],
    });

    // Even though the Boundary catches it, React's dev-mode guarded callback
    // also dispatches a window 'error' event for the thrown Response, which
    // jsdom would otherwise log as an "Uncaught" exception.
    const preventDefault = (event: ErrorEvent) => event.preventDefault();
    window.addEventListener('error', preventDefault);

    render(<Trasher id="res-1" />, { wrapper: Boundary });

    await waitFor(() =>
      expect(screen.getByText('error-caught')).toBeInTheDocument(),
    );

    window.removeEventListener('error', preventDefault);
  });

  it('throws a 404 when the resource was trashed by the current user', async () => {
    get.mockResolvedValue({
      resources: [{ assetId: 'res-1', trashed: false, trashedBy: ['user-1'] }],
    });

    const preventDefault = (event: ErrorEvent) => event.preventDefault();
    window.addEventListener('error', preventDefault);

    render(<Trasher id="res-1" />, { wrapper: Boundary });

    await waitFor(() =>
      expect(screen.getByText('error-caught')).toBeInTheDocument(),
    );

    window.removeEventListener('error', preventDefault);
  });
});
