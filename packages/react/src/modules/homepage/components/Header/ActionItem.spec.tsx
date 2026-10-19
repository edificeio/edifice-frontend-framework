import { render, screen } from '~/setup';
import { ActionItem } from './ActionItem';

describe('ActionItem', () => {
  it('renders a link with its label and icon', () => {
    render(
      <ActionItem href="/timeline/customize" icon={<svg data-testid="icon" />}>
        Customize
      </ActionItem>,
    );

    const link = screen.getByRole('link', { name: 'Customize' });
    expect(link).toHaveAttribute('href', '/timeline/customize');
    expect(link).toHaveClass('action-item');
    expect(link).not.toHaveClass('action-item--danger');
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('applies the danger modifier', () => {
    render(
      <ActionItem href="/auth/logout" variant="danger">
        Logout
      </ActionItem>,
    );

    expect(screen.getByRole('link', { name: 'Logout' })).toHaveClass(
      'action-item',
      'action-item--danger',
    );
  });

  it('forwards extra anchor props', () => {
    render(
      <ActionItem href="/" data-testid="action" target="_blank">
        Action
      </ActionItem>,
    );

    expect(screen.getByTestId('action')).toHaveAttribute('target', '_blank');
  });
});
