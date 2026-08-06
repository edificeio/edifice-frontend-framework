import { render, screen } from '~/setup';
import { Dropdown, DropdownMenuOptions } from '../../../../components';
import { EditorToolbarDropdownMenu } from './EditorToolbar.DropdownMenu';

// Renders the component inside a real `Dropdown`, passing along the real
// `triggerProps` the Dropdown computes so that clicking the rendered
// IconButton actually opens/closes the menu, exactly as it does in
// production (the trigger button is wired up via the Toolbar's `dropdown`
// item type, which passes the Dropdown's own `triggerProps`/`itemRefs`).
function renderMenu(options: DropdownMenuOptions[]) {
  return render(
    <Dropdown>
      {(triggerProps: any) => (
        <EditorToolbarDropdownMenu
          triggerProps={triggerProps}
          icon={<span data-testid="menu-icon" />}
          ariaLabel="List options"
          options={options}
        />
      )}
    </Dropdown>,
  );
}

describe('EditorToolbarDropdownMenu', () => {
  it('renders a trigger button with the given aria-label', () => {
    renderMenu([]);

    expect(
      screen.getByRole('button', { name: 'List options' }),
    ).toBeInTheDocument();
  });

  it('does not show any menu item before the trigger is clicked', () => {
    renderMenu([
      { icon: <span />, label: 'Bold', action: vi.fn() },
      { icon: <span />, label: 'Italic', action: vi.fn() },
    ]);

    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
  });

  it('renders every option label and a separator for divider entries', async () => {
    const options: DropdownMenuOptions[] = [
      { icon: <span />, label: 'Bold', action: vi.fn() },
      { type: 'divider' },
      { icon: <span />, label: 'Italic', action: vi.fn() },
    ];
    const { user } = renderMenu(options);

    await user.click(screen.getByRole('button', { name: 'List options' }));

    const items = screen.getAllByRole('menuitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('Bold');
    expect(items[1]).toHaveTextContent('Italic');
    // `Dropdown.Separator` wraps a semantic `<hr>` in a `role="separator"`
    // div, so a single divider entry yields two matching elements.
    expect(screen.getAllByRole('separator')).toHaveLength(2);
  });

  it('calls the clicked option action with null', async () => {
    const boldAction = vi.fn();
    const italicAction = vi.fn();
    const { user } = renderMenu([
      { icon: <span />, label: 'Bold', action: boldAction },
      { icon: <span />, label: 'Italic', action: italicAction },
    ]);

    await user.click(screen.getByRole('button', { name: 'List options' }));
    await user.click(screen.getByRole('menuitem', { name: 'Italic' }));

    expect(italicAction).toHaveBeenCalledTimes(1);
    expect(italicAction).toHaveBeenCalledWith(null);
    expect(boldAction).not.toHaveBeenCalled();
  });
});
