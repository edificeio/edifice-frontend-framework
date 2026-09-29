import { render, screen } from '~/setup';
import UserSpace from './UserSpace';

describe('UserSpace', () => {
  it('renders the user name and profile', () => {
    render(<UserSpace name="Marc" profile="Teacher" avatar="/avatar.png" />);

    expect(screen.getByTestId('user-space-name')).toHaveTextContent('Marc');
  });

  it('does not render a customize-widgets button when no callback is given', () => {
    render(<UserSpace name="Marc" profile="Teacher" avatar="/avatar.png" />);

    expect(
      screen.queryByRole('button', { name: 'Personnaliser mes widgets' }),
    ).not.toBeInTheDocument();
  });

  it('renders and wires the customize-widgets button when a callback is given', async () => {
    const onCustomizeWidgetsClick = vi.fn();
    const { user } = render(
      <UserSpace
        name="Marc"
        profile="Teacher"
        avatar="/avatar.png"
        onCustomizeWidgetsClick={onCustomizeWidgetsClick}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: 'Personnaliser mes widgets' }),
    );

    expect(onCustomizeWidgetsClick).toHaveBeenCalledTimes(1);
  });
});
