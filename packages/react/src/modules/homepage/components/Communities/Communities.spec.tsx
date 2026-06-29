import { fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { render, screen } from '~/setup';
import CommunityCard from './Communities';
import CommunityCardItem from './CommunityItem';

describe('CommunityCard', () => {
  it('renders the header action button only when an action handler is provided', () => {
    const onActionClick = vi.fn();
    const { rerender } = render(
      <CommunityCard onActionClick={onActionClick} />,
    );

    expect(screen.getByTestId('home-card-header-action')).toBeInTheDocument();

    rerender(<CommunityCard />);
    expect(
      screen.queryByTestId('home-card-header-action'),
    ).not.toBeInTheDocument();
  });

  it('activates the community item with keyboard input', () => {
    const onActionClick = vi.fn();

    render(
      <CommunityCardItem
        title="My community"
        communityImage="/community.png"
        onActionClick={onActionClick}
      />,
    );

    const item = screen.getByRole('button');
    item.focus();
    fireEvent.keyDown(item, { key: 'Enter' });

    expect(onActionClick).toHaveBeenCalledTimes(1);
  });
});
