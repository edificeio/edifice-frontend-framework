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
    // listbox > scroll area > sizer
    const sizer = listbox?.firstElementChild?.firstElementChild as HTMLElement;
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

  describe('searchable (integrated search)', () => {
    const renderSearchable = () =>
      render(
        <Dropdown>
          <Dropdown.Trigger label="Open" />
          <Dropdown.VirtualizedMenu
            searchable
            items={makeItems(100)}
            aria-label="Options"
            getItemKey={(item) => item.id}
            getItemText={(item) => item.label}
            noResultsLabel="No result"
            renderItem={(item, { active }) => (
              <div className={active ? 'focus' : ''}>{item.label}</div>
            )}
          />
        </Dropdown>,
      );

    it('renders a combobox driving the listbox', () => {
      const { container, getByText } = renderSearchable();
      open(getByText);

      const combobox = container.querySelector('[role="combobox"]');
      const listbox = container.querySelector('[role="listbox"]');
      expect(combobox).not.toBeNull();
      expect(listbox).not.toBeNull();
      expect(combobox?.getAttribute('aria-controls')).toBe(
        listbox?.getAttribute('id'),
      );
      // Active descendant is carried by the combobox (focus stays there).
      expect(combobox?.getAttribute('aria-activedescendant')).toMatch(
        /-option-0$/,
      );
      expect(listbox?.getAttribute('aria-activedescendant')).toBeNull();
    });

    it('filters the options and shows the no-result message', () => {
      const { container, getByText, queryByText } = renderSearchable();
      open(getByText);

      const combobox = container.querySelector('[role="combobox"]')!;
      fireEvent.change(combobox, { target: { value: 'nope-xyz' } });

      expect(queryByText('No result')).not.toBeNull();
      expect(combobox.getAttribute('aria-activedescendant')).toBeNull();
    });

    it('keeps a matching query without the no-result message', () => {
      const { container, getByText, queryByText } = renderSearchable();
      open(getByText);

      const combobox = container.querySelector('[role="combobox"]')!;
      fireEvent.change(combobox, { target: { value: 'Option 1' } });

      expect(queryByText('No result')).toBeNull();
      expect(combobox.getAttribute('aria-activedescendant')).toMatch(
        /-option-0$/,
      );
    });

    it('moves the active option from the search field', () => {
      const { container, getByText } = renderSearchable();
      open(getByText);

      const combobox = container.querySelector('[role="combobox"]')!;
      fireEvent.keyDown(combobox, { key: 'ArrowDown' });
      expect(combobox.getAttribute('aria-activedescendant')).toMatch(
        /-option-1$/,
      );
    });
  });

  it('does not mark the active option as selected', () => {
    const { container, getByText } = renderMenu(makeItems(1000));
    open(getByText);

    // aria-selected is reserved to the selection state, the active option is
    // carried by aria-activedescendant.
    expect(
      container.querySelector('[role="option"][aria-selected]'),
    ).toBeNull();
  });

  describe('with no result', () => {
    const renderEmptySearch = () => {
      const utils = render(
        <Dropdown>
          <Dropdown.Trigger label="Open" />
          <Dropdown.VirtualizedMenu
            searchable
            items={makeItems(20)}
            aria-label="Options"
            getItemKey={(item) => item.id}
            getItemText={(item) => item.label}
            renderItem={(item) => <div>{item.label}</div>}
          />
        </Dropdown>,
      );
      open(utils.getByText);
      const combobox = utils.container.querySelector('[role="combobox"]')!;
      fireEvent.change(combobox, { target: { value: 'nope-xyz' } });
      return { ...utils, combobox };
    };

    it('ignores navigation keys, so the active index never leaves the list', () => {
      const { combobox } = renderEmptySearch();

      fireEvent.keyDown(combobox, { key: 'End' });
      fireEvent.keyDown(combobox, { key: 'ArrowDown' });
      fireEvent.keyDown(combobox, { key: 'ArrowUp' });
      // Clearing the query brings the options back.
      fireEvent.change(combobox, { target: { value: '' } });

      expect(combobox.getAttribute('aria-activedescendant')).toMatch(
        /-option-0$/,
      );
    });

    it('does not select anything on Enter', () => {
      const onSelect = vi.fn();
      const utils = render(
        <Dropdown>
          <Dropdown.Trigger label="Open" />
          <Dropdown.VirtualizedMenu
            searchable
            items={makeItems(5)}
            getItemText={(item) => item.label}
            onSelect={onSelect}
            renderItem={(item) => <div>{item.label}</div>}
          />
        </Dropdown>,
      );
      open(utils.getByText);
      const combobox = utils.container.querySelector('[role="combobox"]')!;
      fireEvent.change(combobox, { target: { value: 'nope-xyz' } });
      fireEvent.keyDown(combobox, { key: 'Enter' });

      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe('selectAll', () => {
    const renderMultiSelect = ({
      selected = new Set<string>(),
      searchable = false,
      onToggle = vi.fn(),
      onSelect = vi.fn(),
    }: {
      selected?: Set<string>;
      searchable?: boolean;
      onToggle?: (checked: boolean, visibleItems: Option[]) => void;
      onSelect?: (item: Option, index: number) => void;
    } = {}) => {
      const utils = render(
        <Dropdown>
          <Dropdown.Trigger label="Open" />
          <Dropdown.VirtualizedMenu
            searchable={searchable}
            closeOnSelect={false}
            items={makeItems(30)}
            aria-label="Options"
            getItemKey={(item) => item.id}
            getItemText={(item) => item.label}
            onSelect={onSelect}
            selectAll={{
              label: 'Select all',
              isSelected: (item) => selected.has(item.id),
              onToggle,
            }}
            renderItem={(item) => <div>{item.label}</div>}
          />
        </Dropdown>,
      );
      open(utils.getByText);
      return utils;
    };

    it('renders the select all row inside the listbox of a multiselectable list', () => {
      const { container } = renderMultiSelect();

      const listbox = container.querySelector('[role="listbox"]')!;
      expect(listbox.getAttribute('aria-multiselectable')).toBe('true');
      expect(listbox.querySelector('[data-select-all]')).not.toBeNull();
    });

    it('is absent without the prop', () => {
      const { container, getByText } = renderMenu(makeItems(30));
      open(getByText);

      expect(container.querySelector('[data-select-all]')).toBeNull();
    });

    it('selects every item on click', () => {
      const onToggle = vi.fn();
      const { container } = renderMultiSelect({ onToggle });

      fireEvent.click(container.querySelector('[data-select-all]')!);
      expect(onToggle).toHaveBeenLastCalledWith(
        true,
        expect.arrayContaining([expect.objectContaining({ id: 'opt-29' })]),
      );
      expect(onToggle.mock.calls[0][1]).toHaveLength(30);
    });

    it('asks to unselect when every item is already selected', () => {
      const onToggle = vi.fn();
      const all = new Set(makeItems(30).map((item) => item.id));
      const { container } = renderMultiSelect({ selected: all, onToggle });

      fireEvent.click(container.querySelector('[data-select-all]')!);
      expect(onToggle).toHaveBeenLastCalledWith(false, expect.any(Array));
    });

    it('asks to select all when only some are selected, with an indeterminate box', () => {
      const onToggle = vi.fn();
      const { container } = renderMultiSelect({
        selected: new Set(['opt-0', 'opt-1']),
        onToggle,
      });

      const checkbox = container.querySelector(
        '[data-select-all] input[type="checkbox"]',
      ) as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(true);
      expect(checkbox.checked).toBe(false);

      fireEvent.click(container.querySelector('[data-select-all]')!);
      expect(onToggle).toHaveBeenLastCalledWith(true, expect.any(Array));
    });

    it('acts on the filtered items only when a search is active', () => {
      const onToggle = vi.fn();
      const { container } = renderMultiSelect({ searchable: true, onToggle });

      const combobox = container.querySelector('[role="combobox"]')!;
      // "Option 1" matches 1 and 10..19 → 11 items.
      fireEvent.change(combobox, { target: { value: 'Option 1' } });
      fireEvent.click(container.querySelector('[data-select-all]')!);

      expect(onToggle.mock.calls[0][1]).toHaveLength(11);
    });

    it('is hidden when the search yields no result', () => {
      const { container } = renderMultiSelect({ searchable: true });

      fireEvent.change(container.querySelector('[role="combobox"]')!, {
        target: { value: 'nope-xyz' },
      });

      expect(container.querySelector('[data-select-all]')).toBeNull();
    });

    it('is reached with ArrowUp from the first option and toggled with Enter', () => {
      const onToggle = vi.fn();
      const onSelect = vi.fn();
      const { container } = renderMultiSelect({ onToggle, onSelect });
      const listbox = container.querySelector('[role="listbox"]')!;

      fireEvent.keyDown(listbox, { key: 'ArrowUp' });
      expect(listbox.getAttribute('aria-activedescendant')).toMatch(
        /-select-all$/,
      );

      fireEvent.keyDown(listbox, { key: 'Enter' });
      expect(onToggle).toHaveBeenCalledTimes(1);
      expect(onSelect).not.toHaveBeenCalled();
      // The menu stays open for further selection.
      expect(container.querySelector('[role="listbox"]')).not.toBeNull();

      fireEvent.keyDown(listbox, { key: 'ArrowDown' });
      expect(listbox.getAttribute('aria-activedescendant')).toMatch(
        /-option-0$/,
      );
    });

    it('does not go above the select all row', () => {
      const { container } = renderMultiSelect();
      const listbox = container.querySelector('[role="listbox"]')!;

      fireEvent.keyDown(listbox, { key: 'ArrowUp' });
      fireEvent.keyDown(listbox, { key: 'ArrowUp' });

      expect(listbox.getAttribute('aria-activedescendant')).toMatch(
        /-select-all$/,
      );
    });
  });
});
