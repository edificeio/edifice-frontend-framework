import { render, screen } from '~/setup';
import { Dropdown, DropdownMenuOptions } from '../../../../components';
import { EditorToolbarPlusMenu } from './EditorToolbar.PlusMenu';

// Unlike its sibling EditorToolbar.*Menu components, `EditorToolbarPlusMenu`
// renders its own `Dropdown.Trigger` (reading `triggerProps` from context
// itself) instead of receiving `triggerProps` as a prop, so a plain
// `Dropdown` wrapper with a normal (non-function) child is enough.
function renderPlusMenu(options: DropdownMenuOptions[]) {
  return render(
    <Dropdown>
      <EditorToolbarPlusMenu options={options} />
    </Dropdown>,
  );
}

describe('EditorToolbarPlusMenu', () => {
  it('renders the trigger with the translated "More" label', () => {
    renderPlusMenu([]);

    expect(screen.getByRole('button', { name: /more/i })).toBeInTheDocument();
  });

  it('does not show any menu item before the trigger is clicked', () => {
    renderPlusMenu([
      { icon: <span />, label: 'Table', action: vi.fn() },
      { icon: <span />, label: 'Math formula', action: vi.fn() },
    ]);

    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
  });

  it('renders every option label and a separator for divider entries', async () => {
    const options: DropdownMenuOptions[] = [
      { icon: <span />, label: 'Table', action: vi.fn() },
      { type: 'divider' },
      { icon: <span />, label: 'Math formula', action: vi.fn() },
    ];
    const { user } = renderPlusMenu(options);

    await user.click(screen.getByRole('button', { name: /more/i }));

    const items = screen.getAllByRole('menuitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('Table');
    expect(items[1]).toHaveTextContent('Math formula');
    // `Dropdown.Separator` wraps a semantic `<hr>` in a `role="separator"`
    // div, so a single divider entry yields two matching elements.
    expect(screen.getAllByRole('separator')).toHaveLength(2);
  });

  it('calls the clicked option action with null', async () => {
    const tableAction = vi.fn();
    const mathAction = vi.fn();
    const { user } = renderPlusMenu([
      { icon: <span />, label: 'Table', action: tableAction },
      { icon: <span />, label: 'Math formula', action: mathAction },
    ]);

    await user.click(screen.getByRole('button', { name: /more/i }));
    await user.click(screen.getByRole('menuitem', { name: 'Math formula' }));

    expect(mathAction).toHaveBeenCalledTimes(1);
    expect(mathAction).toHaveBeenCalledWith(null);
    expect(tableAction).not.toHaveBeenCalled();
  });
});
