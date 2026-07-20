import { createRef } from 'react';
import { act, render, screen } from '~/setup';
import Dropdown, { DropdownApi } from './Dropdown';

function getTrigger() {
  return screen.getByRole('button', { name: /menu/i });
}

function BasicDropdown({
  onToggle,
  refDropdown,
  onItemClick,
}: {
  onToggle?: (visible: boolean) => void;
  refDropdown?: React.Ref<DropdownApi>;
  onItemClick?: (item: string) => void;
} = {}) {
  return (
    <Dropdown ref={refDropdown} onToggle={onToggle}>
      <Dropdown.Trigger label="Menu" />
      <Dropdown.Menu>
        <Dropdown.Item type="action" onClick={() => onItemClick?.('Item 1')}>
          Item 1
        </Dropdown.Item>
        <Dropdown.Item type="action" onClick={() => onItemClick?.('Item 2')}>
          Item 2
        </Dropdown.Item>
        <Dropdown.Item type="action" onClick={() => onItemClick?.('Item 3')}>
          Item 3
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

describe('Dropdown', () => {
  it('renders the menu closed by default', () => {
    render(<BasicDropdown />);

    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
  });

  it('opens the menu on trigger click', async () => {
    const { user } = render(<BasicDropdown />);

    await user.click(getTrigger());

    expect(screen.getAllByRole('menuitem')).toHaveLength(3);
  });

  it('closes the menu when clicking outside', async () => {
    const { user } = render(
      <div>
        <BasicDropdown />
        <button>Outside</button>
      </div>,
    );

    await user.click(getTrigger());
    expect(screen.getAllByRole('menuitem')).toHaveLength(3);

    await user.click(screen.getByRole('button', { name: 'Outside' }));

    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
  });

  it('opens on ArrowDown and moves focus between items with the arrow keys', async () => {
    const { user } = render(<BasicDropdown />);
    getTrigger().focus();

    await user.keyboard('{ArrowDown}');
    const items = screen.getAllByRole('menuitem');
    expect(items[0]).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(items[1]).toHaveFocus();

    await user.keyboard('{ArrowUp}');
    expect(items[0]).toHaveFocus();
  });

  it('jumps to the first/last item with Home/End', async () => {
    const { user } = render(<BasicDropdown />);
    getTrigger().focus();
    await user.keyboard('{ArrowDown}');
    const items = screen.getAllByRole('menuitem');

    await user.keyboard('{End}');
    expect(items[2]).toHaveFocus();

    await user.keyboard('{Home}');
    expect(items[0]).toHaveFocus();
  });

  it('activates the focused item on Enter, closing the dropdown and refocusing the trigger', async () => {
    const onItemClick = vi.fn();
    const { user } = render(<BasicDropdown onItemClick={onItemClick} />);
    const trigger = getTrigger();
    trigger.focus();

    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    expect(onItemClick).toHaveBeenCalledWith('Item 1');
    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes on Escape and refocuses the trigger', async () => {
    const { user } = render(<BasicDropdown />);
    const trigger = getTrigger();

    await user.click(trigger);
    expect(screen.getAllByRole('menuitem')).toHaveLength(3);

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('calls onToggle whenever visibility changes', async () => {
    const onToggle = vi.fn();
    const { user } = render(<BasicDropdown onToggle={onToggle} />);

    await user.click(getTrigger());

    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it('exposes an imperative API via ref', () => {
    const ref = createRef<DropdownApi>();
    render(<BasicDropdown refDropdown={ref} />);

    expect(ref.current?.visible).toBe(false);

    act(() => ref.current?.openDropdown());
    expect(ref.current?.visible).toBe(true);

    act(() => ref.current?.closeDropdown());
    expect(ref.current?.visible).toBe(false);
  });
});
