import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '~/setup';
import { CommunitiesContainer } from './CommunitiesContainer';
import { useCommunities } from './useCommunities';

vi.mock('./useCommunities', () => ({
  useCommunities: vi.fn(),
}));

describe('CommunitiesContainer', () => {
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
          stats: {
            totalMembers: '30',
            memberCount: '29',
            adminCount: '1',
            communityId: 1,
          },
        },
      ],
      isLoading: false,
      error: null,
    });

    render(<CommunitiesContainer onHeaderActionClick={vi.fn()} />);

    expect(screen.getByText('My community')).toBeInTheDocument();
  });
});
