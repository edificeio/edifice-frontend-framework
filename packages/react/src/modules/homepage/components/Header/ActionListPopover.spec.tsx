import { render, screen } from '~/setup';
import { ActionListPopover } from './ActionListPopover';

describe('ActionListPopover', () => {
  it('does not render when hidden', () => {
    render(<ActionListPopover id="menu" isVisible={false} />);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('lists the my account, customize and logout actions', () => {
    render(<ActionListPopover id="menu" isVisible logoutCallback="/portal" />);

    expect(screen.getByRole('tooltip')).toHaveClass('action-list-popover');
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByTestId('header-my-account-button')).toHaveAttribute(
      'href',
      '/userbook/mon-compte',
    );
    expect(screen.getByTestId('header-customize-button')).toHaveAttribute(
      'href',
      expect.stringContaining('/timeline/customize?callback='),
    );
    expect(screen.getByTestId('header-logout-button')).toHaveAttribute(
      'href',
      '/auth/logout?callback=/portal',
    );
    expect(screen.getByTestId('header-logout-button')).toHaveClass(
      'action-item--danger',
    );
  });
});
