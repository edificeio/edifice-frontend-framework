import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '~/setup';
import { CommunityCardContainer } from './CommunitiesContainer';
import { useCommunities } from './useCommunities';

vi.mock('./useCommunities', () => ({
  useCommunities: vi.fn(),
}));

describe('CommunityCardContainer', () => {
  beforeEach(() => {
    vi.mocked(useCommunities).mockReset();
  });

  it('renders the communities provided by the hook', () => {
    vi.mocked(useCommunities).mockReturnValue({
      communities: [
        {
          id: 1,
          title: 'My community',
          communityImage: '/community.png',
          nbNotifications: 2,
        },
      ],
      isLoading: false,
      error: null,
    });

    render(<CommunityCardContainer />);

    expect(screen.getByText('My community')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
