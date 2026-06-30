import { fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { render, screen } from '~/setup';
import Communities from './Communities';
import CommunityItem from './CommunityItem';

describe('Communities', () => {
  it('always renders the header action button', () => {
    const onActionClick = vi.fn();
    const { rerender } = render(<Communities onActionClick={onActionClick} />);

    expect(screen.getByTestId('home-card-header-action')).toBeInTheDocument();

    rerender(<Communities />);
    expect(screen.getByTestId('home-card-header-action')).toBeInTheDocument();
  });

  it('activates the community item with keyboard input', () => {
    const onActionClick = vi.fn();

    render(
      <CommunityItem
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
