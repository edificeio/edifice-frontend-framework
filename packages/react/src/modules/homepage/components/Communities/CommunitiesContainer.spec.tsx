import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '~/setup';
import { CommunitiesContainer } from './CommunitiesContainer';
import { useCommunities } from './useCommunities';

vi.mock('./useCommunities', () => ({
  useCommunities: vi.fn(),
}));

describe('CommunitiesContainer', () => {
  beforeAll(() => {
    // Communities relies on useMeasure (ResizeObserver), absent from jsdom.
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
  });

  beforeEach(() => {
    vi.mocked(useCommunities).mockReset();
  });

  it('renders the skeleton while communities are loading', () => {
    vi.mocked(useCommunities).mockReturnValue({
      communities: [],
      isLoading: true,
      error: null,
    });

    render(<CommunitiesContainer onHeaderActionClick={vi.fn()} />);

    expect(screen.getByTestId('communities-skeleton')).toBeInTheDocument();
  });

  it('renders the communities provided by the hook', () => {
    vi.mocked(useCommunities).mockReturnValue({
      communities: [
        {
          id: 1,
          title: 'My community',
          image: '/community.png',
        },
      ],
      isLoading: false,
      error: null,
    });

    render(<CommunitiesContainer onHeaderActionClick={vi.fn()} />);

    expect(screen.getByText('My community')).toBeInTheDocument();
  });

  it('opens the community home page by default when a community is clicked', () => {
    vi.mocked(useCommunities).mockReturnValue({
      communities: [
        {
          id: 1,
          title: 'My community',
          image: '/community.png',
        },
      ],
      isLoading: false,
      error: null,
    });
    const windowOpen = vi.spyOn(window, 'open').mockImplementation(() => null);

    render(<CommunitiesContainer />);
    screen.getByText('My community').click();

    expect(windowOpen).toHaveBeenCalledWith('/communities/id/1/home', '_self');
  });

  it('opens the communities list by default when the header action is clicked and communities exist', () => {
    vi.mocked(useCommunities).mockReturnValue({
      communities: [
        {
          id: 1,
          title: 'My community',
          image: '/community.png',
        },
      ],
      isLoading: false,
      error: null,
    });
    const windowOpen = vi.spyOn(window, 'open').mockImplementation(() => null);

    render(<CommunitiesContainer />);
    screen.getByTestId('home-card-header-action').click();

    expect(windowOpen).toHaveBeenCalledWith('/communities', '_self');
  });

  it('opens the community creation flow by default when the header action is clicked and there are no communities', () => {
    vi.mocked(useCommunities).mockReturnValue({
      communities: [],
      isLoading: false,
      error: null,
    });
    const windowOpen = vi.spyOn(window, 'open').mockImplementation(() => null);

    render(<CommunitiesContainer />);
    screen.getByTestId('home-card-header-action').click();

    expect(windowOpen).toHaveBeenCalledWith(
      '/communities/create/step-type',
      '_self',
    );
  });
});
