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

  describe('while loading', () => {
    it('announces a single loading region instead of the user', () => {
      render(
        <UserSpace name="" profile="Student" avatar="" isLoading>
          children
        </UserSpace>,
      );

      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-busy', 'true');
      expect(status).toHaveTextContent('Loading');
      expect(screen.queryByTestId('user-space-name')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('user-space-profile'),
      ).not.toBeInTheDocument();
      expect(
        document.querySelectorAll('.user-space__link-skeleton'),
      ).toHaveLength(2);
    });

    it('still renders the children, outside the loading region', () => {
      render(
        <UserSpace name="" profile="Student" avatar="" isLoading>
          children
        </UserSpace>,
      );

      expect(screen.getByText('children')).toBeInTheDocument();
      expect(screen.getByRole('status')).not.toHaveTextContent('children');
    });

    it('reserves the customize button only when a callback is given', () => {
      const { rerender } = render(
        <UserSpace name="" profile="Student" avatar="" isLoading />,
      );
      expect(
        document.querySelector('.user-space__button-skeleton'),
      ).not.toBeInTheDocument();

      rerender(
        <UserSpace
          name=""
          profile="Student"
          avatar=""
          isLoading
          onCustomizeWidgetsClick={() => {}}
        />,
      );
      expect(
        document.querySelector('.user-space__button-skeleton'),
      ).toBeInTheDocument();
    });
  });
});
