import { useState } from 'react';
import { render, screen } from '~/setup';
import { Dropdown } from './index';

/**
 * Covers the Dropdown item flavours (action/select, radio, checkbox), the search
 * input and the filtering they share. The root behaviour — opening, keyboard
 * navigation, imperative API — lives in Dropdown.spec.tsx.
 */
function openMenu(children: React.ReactNode) {
  return render(
    <Dropdown>
      {(triggerProps) => (
        <>
          <Dropdown.Trigger label="Actions" {...triggerProps} />
          <Dropdown.Menu>{children}</Dropdown.Menu>
        </>
      )}
    </Dropdown>,
  );
}

const item = (name: string) => screen.getByRole('menuitem', { name });

describe('Dropdown.Item', () => {
  it('renders an accessible menu item with its icon and label', async () => {
    const { user } = openMenu(
      <Dropdown.Item icon={<span data-testid="icon" />}>Delete</Dropdown.Item>,
    );

    await user.click(screen.getByRole('button', { name: 'Actions' }));

    expect(item('Delete')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('calls back on click and closes the menu for an action item', async () => {
    const onClick = vi.fn();
    const { user } = openMenu(
      <Dropdown.Item onClick={onClick}>Delete</Dropdown.Item>,
    );

    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.click(item('Delete'));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
  });

  it('keeps the menu open for a select item', async () => {
    const onClick = vi.fn();
    const { user } = openMenu(
      <Dropdown.Item type="select" onClick={onClick}>
        Sort by name
      </Dropdown.Item>,
    );

    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.click(item('Sort by name'));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(item('Sort by name')).toBeInTheDocument();
  });

  it('ignores a click on a disabled item', async () => {
    const onClick = vi.fn();
    const { user } = openMenu(
      <Dropdown.Item disabled onClick={onClick}>
        Delete
      </Dropdown.Item>,
    );

    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.click(item('Delete'));

    expect(onClick).not.toHaveBeenCalled();
    expect(item('Delete')).toHaveClass('text-gray-600');
  });

  it('applies a minimum width and the custom classes', async () => {
    const { user } = openMenu(
      <Dropdown.Item minWidth={240} className="my-item">
        Delete
      </Dropdown.Item>,
    );

    await user.click(screen.getByRole('button', { name: 'Actions' }));

    expect(item('Delete')).toHaveStyle({ minWidth: '240px' });
    expect(item('Delete')).toHaveClass('my-item');
  });

  it('marks the hovered item as current', async () => {
    const { user } = openMenu(
      <>
        <Dropdown.Item>First</Dropdown.Item>
        <Dropdown.Item>Second</Dropdown.Item>
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.hover(item('Second'));

    expect(item('Second')).toHaveAttribute('aria-current', 'true');
    expect(item('First')).toHaveAttribute('aria-current', 'false');
  });
});

describe('Dropdown.RadioItem', () => {
  function RadioMenu() {
    const [model, setModel] = useState('asc');

    return (
      <Dropdown>
        {(triggerProps) => (
          <>
            <Dropdown.Trigger label="Sort" {...triggerProps} />
            <Dropdown.Menu>
              <Dropdown.RadioItem value="asc" model={model} onChange={setModel}>
                Ascending
              </Dropdown.RadioItem>
              <Dropdown.RadioItem
                value="desc"
                model={model}
                onChange={setModel}
              >
                Descending
              </Dropdown.RadioItem>
            </Dropdown.Menu>
          </>
        )}
      </Dropdown>
    );
  }

  it('checks the item matching the model', async () => {
    const { user } = render(<RadioMenu />);

    await user.click(screen.getByRole('button', { name: 'Sort' }));

    expect(
      screen.getByRole('menuitemradio', { name: 'Ascending' }),
    ).toHaveAttribute('aria-checked', 'true');
    expect(
      screen.getByRole('menuitemradio', { name: 'Descending' }),
    ).toHaveAttribute('aria-checked', 'false');
  });

  it('moves the selection on click', async () => {
    const { user } = render(<RadioMenu />);

    await user.click(screen.getByRole('button', { name: 'Sort' }));
    await user.click(screen.getByRole('menuitemradio', { name: 'Descending' }));

    expect(
      screen.getByRole('menuitemradio', { name: 'Descending' }),
    ).toHaveAttribute('aria-checked', 'true');
  });

  it('only makes the selected item focusable', async () => {
    const { user } = render(<RadioMenu />);

    await user.click(screen.getByRole('button', { name: 'Sort' }));

    expect(
      screen.getByRole('menuitemradio', { name: 'Ascending' }),
    ).toHaveAttribute('tabindex', '0');
    expect(
      screen.getByRole('menuitemradio', { name: 'Descending' }),
    ).toHaveAttribute('tabindex', '-1');
  });
});

describe('Dropdown.CheckboxItem', () => {
  function CheckboxMenu() {
    const [model, setModel] = useState<(string | number)[]>(['blog']);

    const toggle = (value: string | number) =>
      setModel((current) =>
        current.includes(value)
          ? current.filter((entry) => entry !== value)
          : [...current, value],
      );

    return (
      <Dropdown>
        {(triggerProps) => (
          <>
            <Dropdown.Trigger label="Filters" {...triggerProps} />
            <Dropdown.Menu>
              <Dropdown.CheckboxItem
                value="blog"
                model={model}
                onChange={toggle}
              >
                Blog
              </Dropdown.CheckboxItem>
              <Dropdown.CheckboxItem
                value="wiki"
                model={model}
                onChange={toggle}
              >
                Wiki
              </Dropdown.CheckboxItem>
            </Dropdown.Menu>
          </>
        )}
      </Dropdown>
    );
  }

  it('checks the items present in the model', async () => {
    const { user } = render(<CheckboxMenu />);

    await user.click(screen.getByRole('button', { name: 'Filters' }));

    expect(
      screen.getByRole('menuitemcheckbox', { name: 'Blog' }),
    ).toHaveAttribute('aria-checked', 'true');
    expect(
      screen.getByRole('menuitemcheckbox', { name: 'Wiki' }),
    ).toHaveAttribute('aria-checked', 'false');
  });

  it('adds a value to the model on click', async () => {
    const { user } = render(<CheckboxMenu />);

    await user.click(screen.getByRole('button', { name: 'Filters' }));
    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Wiki' }));

    expect(
      screen.getByRole('menuitemcheckbox', { name: 'Wiki' }),
    ).toHaveAttribute('aria-checked', 'true');
  });

  it('removes an already selected value', async () => {
    const { user } = render(<CheckboxMenu />);

    await user.click(screen.getByRole('button', { name: 'Filters' }));
    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Blog' }));

    expect(
      screen.getByRole('menuitemcheckbox', { name: 'Blog' }),
    ).toHaveAttribute('aria-checked', 'false');
  });
});

describe('Dropdown.SearchInput', () => {
  function SearchableMenu({
    onSearch,
  }: { onSearch?: (q: string) => void } = {}) {
    return (
      <Dropdown>
        {(triggerProps) => (
          <>
            <Dropdown.Trigger label="Apps" {...triggerProps} />
            <Dropdown.Menu>
              <Dropdown.SearchInput
                placeholder="Search an app"
                noResultsLabel="Nothing found"
                onSearch={onSearch}
              />
              <Dropdown.Item searchValue="Blog">Blog</Dropdown.Item>
              <Dropdown.Item searchValue="Wiki">Wiki</Dropdown.Item>
            </Dropdown.Menu>
          </>
        )}
      </Dropdown>
    );
  }

  it('filters the items matching the query, case-insensitively', async () => {
    const { user } = render(<SearchableMenu />);

    await user.click(screen.getByRole('button', { name: 'Apps' }));
    await user.type(screen.getByPlaceholderText('Search an app'), 'wik');

    expect(screen.getByRole('menuitem', { name: 'Wiki' })).toBeInTheDocument();
    expect(
      screen.queryByRole('menuitem', { name: 'Blog' }),
    ).not.toBeInTheDocument();
  });

  it('reports the query to the caller', async () => {
    const onSearch = vi.fn();
    const { user } = render(<SearchableMenu onSearch={onSearch} />);

    await user.click(screen.getByRole('button', { name: 'Apps' }));
    await user.type(screen.getByPlaceholderText('Search an app'), 'a');

    expect(onSearch).toHaveBeenCalledWith('a');
  });

  it('shows the empty label when nothing matches', async () => {
    const { user } = render(<SearchableMenu />);

    await user.click(screen.getByRole('button', { name: 'Apps' }));
    await user.type(screen.getByPlaceholderText('Search an app'), 'zzz');

    expect(screen.getByText('Nothing found')).toBeInTheDocument();
  });

  it('shows no empty label while the query is empty', async () => {
    const { user } = render(<SearchableMenu />);

    await user.click(screen.getByRole('button', { name: 'Apps' }));

    expect(screen.queryByText('Nothing found')).not.toBeInTheDocument();
  });

  it('keeps the items without a search value out of the filtering', async () => {
    const { user } = render(
      <Dropdown>
        {(triggerProps) => (
          <>
            <Dropdown.Trigger label="Apps" {...triggerProps} />
            <Dropdown.Menu>
              <Dropdown.SearchInput placeholder="Search an app" />
              <Dropdown.Item searchValue="Blog">Blog</Dropdown.Item>
              <Dropdown.Item>Always there</Dropdown.Item>
            </Dropdown.Menu>
          </>
        )}
      </Dropdown>,
    );

    await user.click(screen.getByRole('button', { name: 'Apps' }));
    await user.type(screen.getByPlaceholderText('Search an app'), 'zzz');

    expect(
      screen.getByRole('menuitem', { name: 'Always there' }),
    ).toBeInTheDocument();
  });

  it('focuses the search input when the menu opens', async () => {
    const { user } = render(<SearchableMenu />);

    await user.click(screen.getByRole('button', { name: 'Apps' }));

    expect(screen.getByPlaceholderText('Search an app')).toHaveFocus();
  });

  it('moves from the search input to the first visible item on ArrowDown', async () => {
    const { user } = render(<SearchableMenu />);

    await user.click(screen.getByRole('button', { name: 'Apps' }));
    await user.type(screen.getByPlaceholderText('Search an app'), 'wik');
    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('menuitem', { name: 'Wiki' })).toHaveFocus();
  });

  it('brings the focus back to the search input on ArrowUp from the first item', async () => {
    const { user } = render(<SearchableMenu />);

    await user.click(screen.getByRole('button', { name: 'Apps' }));
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowUp}');

    expect(screen.getByPlaceholderText('Search an app')).toHaveFocus();
  });

  it('stays in the search input on ArrowDown when nothing matches', async () => {
    const { user } = render(<SearchableMenu />);

    await user.click(screen.getByRole('button', { name: 'Apps' }));
    const input = screen.getByPlaceholderText('Search an app');
    await user.type(input, 'zzz');
    await user.keyboard('{ArrowDown}');

    expect(input).toHaveFocus();
  });

  it('ignores accents when filtering', async () => {
    const { user } = render(
      <Dropdown>
        {(triggerProps) => (
          <>
            <Dropdown.Trigger label="Categories" {...triggerProps} />
            <Dropdown.Menu>
              <Dropdown.SearchInput placeholder="Search a category" />
              <Dropdown.Item searchValue="Développement">
                Développement
              </Dropdown.Item>
              <Dropdown.Item searchValue="Marketing">Marketing</Dropdown.Item>
            </Dropdown.Menu>
          </>
        )}
      </Dropdown>,
    );

    await user.click(screen.getByRole('button', { name: 'Categories' }));
    await user.type(screen.getByPlaceholderText('Search a category'), 'deve');

    expect(
      screen.getByRole('menuitem', { name: 'Développement' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('menuitem', { name: 'Marketing' }),
    ).not.toBeInTheDocument();
  });

  it('selects the focused item on Enter once the list is filtered', async () => {
    const onClick = vi.fn();
    const { user } = render(
      <Dropdown>
        {(triggerProps) => (
          <>
            <Dropdown.Trigger label="Apps" {...triggerProps} />
            <Dropdown.Menu>
              <Dropdown.SearchInput placeholder="Search an app" />
              <Dropdown.Item searchValue="Blog">Blog</Dropdown.Item>
              <Dropdown.Item searchValue="Wiki" onClick={onClick}>
                Wiki
              </Dropdown.Item>
            </Dropdown.Menu>
          </>
        )}
      </Dropdown>,
    );

    await user.click(screen.getByRole('button', { name: 'Apps' }));
    await user.type(screen.getByPlaceholderText('Search an app'), 'wik');
    await user.keyboard('{ArrowDown}{Enter}');

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
  });

  it('displays the search input in place of the trigger, outside the list', async () => {
    const { user } = render(<SearchableMenu />);

    await user.click(screen.getByRole('button', { name: 'Apps' }));
    const input = screen.getByPlaceholderText('Search an app');

    expect(input.closest('.dropdown-search')).toBeInTheDocument();
    expect(input.closest('.dropdown-menu')).not.toBeInTheDocument();
  });

  it('hides the trigger while the search input covers it', async () => {
    const { user } = render(<SearchableMenu />);

    const trigger = screen.getByRole('button', { name: 'Apps' });
    await user.click(trigger);

    expect(trigger).toHaveClass('opacity-0');

    await user.keyboard('{Escape}');

    expect(trigger).not.toHaveClass('opacity-0');
  });

  it('hides a menu group when none of its items matches', async () => {
    const { user } = render(
      <Dropdown>
        {(triggerProps) => (
          <>
            <Dropdown.Trigger label="Apps" {...triggerProps} />
            <Dropdown.Menu>
              <Dropdown.SearchInput placeholder="Search an app" />
              <Dropdown.MenuGroup label="Communication">
                <Dropdown.Item searchValue="Blog">Blog</Dropdown.Item>
              </Dropdown.MenuGroup>
              <Dropdown.MenuGroup label="Collaboration">
                <Dropdown.Item searchValue="Wiki">Wiki</Dropdown.Item>
              </Dropdown.MenuGroup>
            </Dropdown.Menu>
          </>
        )}
      </Dropdown>,
    );

    await user.click(screen.getByRole('button', { name: 'Apps' }));
    await user.type(screen.getByPlaceholderText('Search an app'), 'wik');

    expect(screen.queryByText('Communication')).not.toBeVisible();
    expect(screen.getByText('Collaboration')).toBeVisible();

    await user.clear(screen.getByPlaceholderText('Search an app'));

    expect(screen.getByText('Communication')).toBeVisible();
  });

  it('closes the menu and focuses the trigger on Escape from the search input', async () => {
    const { user } = render(<SearchableMenu />);

    const trigger = screen.getByRole('button', { name: 'Apps' });
    await user.click(trigger);
    await user.keyboard('{Escape}');

    expect(
      screen.queryByPlaceholderText('Search an app'),
    ).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
