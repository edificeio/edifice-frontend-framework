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
    expect(link).not.toHaveClass('action-item--destructive');
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('applies the destructive modifier', () => {
    render(
      <ActionItem href="/auth/logout" variant="destructive">
        Logout
      </ActionItem>,
    );

    expect(screen.getByRole('link', { name: 'Logout' })).toHaveClass(
      'action-item',
      'action-item--destructive',
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

  it('renders a button triggering onClick when no href is given', async () => {
    const onClick = vi.fn();
    const { user } = render(<ActionItem onClick={onClick}>Rename</ActionItem>);

    const button = screen.getByRole('button', { name: 'Rename' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('action-item');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();

    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not trigger onClick when the button is disabled', async () => {
    const onClick = vi.fn();
    const { user } = render(
      <ActionItem onClick={onClick} disabled>
        Rename
      </ActionItem>,
    );

    await user.click(screen.getByRole('button', { name: 'Rename' }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
