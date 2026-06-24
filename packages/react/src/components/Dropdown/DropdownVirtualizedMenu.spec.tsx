import { fireEvent, render } from '~/setup';

import Dropdown from './Dropdown';

interface Option {
  id: string;
  label: string;
}

const makeItems = (count: number): Option[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `opt-${index}`,
    label: `Option ${index}`,
  }));

const renderMenu = (
  items: Option[],
  onSelect?: (item: Option, index: number) => void,
) =>
  render(
    <Dropdown>
      <Dropdown.Trigger label="Open" />
      <Dropdown.VirtualizedMenu
        items={items}
        aria-label="Options"
        getItemKey={(item) => item.id}
        onSelect={onSelect}
        renderItem={(item, { active }) => (
          <div className={active ? 'focus' : ''}>{item.label}</div>
        )}
      />
    </Dropdown>,
  );

const open = (getByText: (t: string) => HTMLElement) => {
  fireEvent.click(getByText('Open'));
};

describe('Dropdown.VirtualizedMenu', () => {
  it('renders a listbox sized to the whole list when opened', () => {
    const { container, getByText } = renderMenu(makeItems(1000));
    open(getByText);

    const listbox = container.querySelector('[role="listbox"]');
    expect(listbox).not.toBeNull();

    // A sized inner container reserves the full scroll height (1000 × ~40px),
    // proving the virtualizer is active while only a window is mounted.
    const sizer = listbox?.firstElementChild as HTMLElement;
    expect(parseFloat(sizer.style.height)).toBeGreaterThan(1000);

    const options = container.querySelectorAll('[role="option"]');
    expect(options.length).toBeLessThan(1000);
  });

  it('points aria-activedescendant at the first option on open', () => {
    const { container, getByText } = renderMenu(makeItems(50));
    open(getByText);

    const listbox = container.querySelector('[role="listbox"]')!;
    expect(listbox.getAttribute('aria-activedescendant')).toMatch(/-option-0$/);
  });

  it('moves the active option with ArrowDown / End / Home', () => {
    const { container, getByText } = renderMenu(makeItems(50));
    open(getByText);

    const listbox = container.querySelector('[role="listbox"]')!;

    fireEvent.keyDown(listbox, { key: 'ArrowDown' });
    expect(listbox.getAttribute('aria-activedescendant')).toMatch(/-option-1$/);

    fireEvent.keyDown(listbox, { key: 'End' });
    expect(listbox.getAttribute('aria-activedescendant')).toMatch(
      /-option-49$/,
    );

    fireEvent.keyDown(listbox, { key: 'Home' });
    expect(listbox.getAttribute('aria-activedescendant')).toMatch(/-option-0$/);
  });

  it('does not move past the last option', () => {
    const { container, getByText } = renderMenu(makeItems(3));
    open(getByText);

    const listbox = container.querySelector('[role="listbox"]')!;
    fireEvent.keyDown(listbox, { key: 'End' });
    fireEvent.keyDown(listbox, { key: 'ArrowDown' });
    expect(listbox.getAttribute('aria-activedescendant')).toMatch(/-option-2$/);
  });

  it('selects the active option on Enter and closes the menu', () => {
    const onSelect = vi.fn();
    const { container, getByText } = renderMenu(makeItems(50), onSelect);
    open(getByText);

    const listbox = container.querySelector('[role="listbox"]')!;
    fireEvent.keyDown(listbox, { key: 'ArrowDown' });
    fireEvent.keyDown(listbox, { key: 'Enter' });

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'opt-1' }),
      1,
    );
    // Menu closes after selection.
    expect(container.querySelector('[role="listbox"]')).toBeNull();
  });

  it('closes on Escape', () => {
    const { container, getByText } = renderMenu(makeItems(50));
    open(getByText);

    expect(container.querySelector('[role="listbox"]')).not.toBeNull();
    fireEvent.keyDown(container.querySelector('[role="listbox"]')!, {
      key: 'Escape',
    });
    expect(container.querySelector('[role="listbox"]')).toBeNull();
  });
});
