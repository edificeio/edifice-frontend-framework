import { fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { render, screen } from '~/setup';
import Communities from './Communities';
import CommunityItem from './CommunityItem';

describe('Communities', () => {
  it('renders the header action button for both populated and empty states', () => {
    const handleActionClick = vi.fn();
    const { rerender } = render(
      <Communities
        handleActionClick={handleActionClick}
        communitiesList={[
          {
            title: 'My community',
            communityImage: '/community.png',
            onActionClick: vi.fn(),
          },
        ]}
      />,
    );

    expect(screen.getByTestId('home-card-header-action')).toBeInTheDocument();
    expect(screen.getByText('Voir plus')).toBeInTheDocument();

    rerender(<Communities handleActionClick={handleActionClick} />);
    expect(screen.getByTestId('home-card-header-action')).toBeInTheDocument();
    expect(screen.getByText('Créer une communauté')).toBeInTheDocument();
  });

  it('activates the community item on click', () => {
    const onActionClick = vi.fn();

    render(
      <CommunityItem
        title="My community"
        communityImage="/community.png"
        onActionClick={onActionClick}
      />,
    );

    const item = screen.getByRole('button');
    fireEvent.click(item);

    expect(onActionClick).toHaveBeenCalledTimes(1);
  });
});
