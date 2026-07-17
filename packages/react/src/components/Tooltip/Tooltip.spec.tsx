import { render, screen } from '~/setup';
import Tooltip from './Tooltip';

describe('Tooltip', () => {
  it('always renders the trigger children', () => {
    render(
      <Tooltip message="Some help text">
        <button>Trigger</button>
      </Tooltip>,
    );

    expect(screen.getByText('Trigger')).toBeInTheDocument();
  });

  it('does not show the message before hovering', () => {
    render(
      <Tooltip message="Some help text">
        <button>Trigger</button>
      </Tooltip>,
    );

    expect(screen.queryByText('Some help text')).not.toBeInTheDocument();
  });

  it('shows the message on hover and hides it when the pointer leaves', async () => {
    const { user } = render(
      <Tooltip message="Some help text">
        <button>Trigger</button>
      </Tooltip>,
    );

    await user.hover(screen.getByText('Trigger'));
    expect(screen.getByText('Some help text')).toBeInTheDocument();

    await user.unhover(screen.getByText('Trigger'));
    expect(screen.queryByText('Some help text')).not.toBeInTheDocument();
  });

  it('renders the icon next to the message when visible', async () => {
    const { user } = render(
      <Tooltip message="Some help text" icon={<span>icon</span>}>
        <button>Trigger</button>
      </Tooltip>,
    );

    await user.hover(screen.getByText('Trigger'));

    expect(screen.getByText('icon')).toBeInTheDocument();
    expect(screen.getByText('Some help text')).toBeInTheDocument();
  });

  it('never displays a tooltip body when message is undefined', async () => {
    const { user, container } = render(
      <Tooltip message={undefined}>
        <button>Trigger</button>
      </Tooltip>,
    );

    await user.hover(screen.getByText('Trigger'));

    expect(container.querySelector('.tooltip-inner')).not.toBeInTheDocument();
  });
});
