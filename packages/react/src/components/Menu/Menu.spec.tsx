import { render, screen } from '~/setup';
import { Menu } from './components/Menu';

function BasicMenu({ onClick }: { onClick?: (item: string) => void } = {}) {
  return (
    <Menu label="Navigation">
      <Menu.Item>
        <Menu.Button selected={false} onClick={() => onClick?.('Item 1')}>
          Item 1
        </Menu.Button>
      </Menu.Item>
      <Menu.Item>
        <Menu.Button selected={false} onClick={() => onClick?.('Item 2')}>
          Item 2
        </Menu.Button>
      </Menu.Item>
      <Menu.Item>
        <Menu.Button selected={false} onClick={() => onClick?.('Item 3')}>
          Item 3
        </Menu.Button>
      </Menu.Item>
    </Menu>
  );
}

describe('Menu', () => {
  it('renders a labelled nav with a menubar and its items', () => {
    render(<BasicMenu />);

    expect(
      screen.getByRole('navigation', { name: 'Navigation' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('menubar', { name: 'Navigation' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(3);
  });

  it('calls onClick when a menu button is clicked', async () => {
    const onClick = vi.fn();
    const { user } = render(<BasicMenu onClick={onClick} />);

    await user.click(screen.getByRole('menuitem', { name: 'Item 2' }));

    expect(onClick).toHaveBeenCalledWith('Item 2');
  });

  it('marks a selected item with the selected class', () => {
    render(
      <Menu label="Navigation">
        <Menu.Item>
          <Menu.Button selected>Active</Menu.Button>
        </Menu.Item>
      </Menu>,
    );

    expect(screen.getByRole('menuitem', { name: 'Active' })).toHaveClass(
      'selected',
    );
  });

  it('moves focus to the next item on ArrowDown, wrapping after the last', async () => {
    const { user } = render(<BasicMenu />);
    const items = screen.getAllByRole('menuitem');

    items[0].focus();
    await user.keyboard('{ArrowDown}');
    expect(items[1]).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(items[2]).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(items[0]).toHaveFocus();
  });

  it('moves focus to the previous item on ArrowUp, wrapping before the first', async () => {
    const { user } = render(<BasicMenu />);
    const items = screen.getAllByRole('menuitem');

    items[0].focus();
    await user.keyboard('{ArrowUp}');
    expect(items[2]).toHaveFocus();

    await user.keyboard('{ArrowUp}');
    expect(items[1]).toHaveFocus();
  });

  it('jumps to the first/last item with Home/End', async () => {
    const { user } = render(<BasicMenu />);
    const items = screen.getAllByRole('menuitem');

    items[0].focus();
    await user.keyboard('{End}');
    expect(items[2]).toHaveFocus();

    await user.keyboard('{Home}');
    expect(items[0]).toHaveFocus();
  });
});
