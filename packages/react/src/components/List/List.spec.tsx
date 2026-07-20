import { List } from './List';

import { render, screen } from '~/setup';

type Item = { _id: string; label: string };

const data: Item[] = [
  { _id: '1', label: 'Item 1' },
  { _id: '2', label: 'Item 2' },
  { _id: '3', label: 'Item 3' },
];

function renderNode(node: Item, checkbox?: JSX.Element) {
  return (
    <div data-testid={`row-${node._id}`}>
      {checkbox}
      {node.label}
    </div>
  );
}

describe('List', () => {
  beforeAll(() => {
    // useBreakpoint relies on window.matchMedia, absent from jsdom.
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it('renders every item via renderNode, without a header toolbar by default', () => {
    render(<List data={data} renderNode={renderNode} />);

    expect(screen.getByTestId('row-1')).toHaveTextContent('Item 1');
    expect(screen.getByTestId('row-2')).toHaveTextContent('Item 2');
    expect(screen.queryByText(/^\(\d+\)$/)).not.toBeInTheDocument();
  });

  it('shows a select-all checkbox and count when isCheckable is true', () => {
    render(<List data={data} renderNode={renderNode} isCheckable />);

    expect(screen.getByText('(0)')).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(1 + data.length);
  });

  it('selects an item and reports selected ids via onSelectedItems', async () => {
    const onSelectedItems = vi.fn();
    const { user } = render(
      <List
        data={data}
        renderNode={renderNode}
        isCheckable
        onSelectedItems={onSelectedItems}
      />,
    );

    expect(onSelectedItems).toHaveBeenCalledWith([]);

    const row1Checkbox = screen
      .getByTestId('row-1')
      .querySelector('input[type="checkbox"]') as HTMLElement;
    await user.click(row1Checkbox);

    expect(onSelectedItems).toHaveBeenCalledWith(['1']);
    expect(screen.getByText('(1)')).toBeInTheDocument();
  });

  it('selects all items when the header checkbox is toggled', async () => {
    const onSelectedItems = vi.fn();
    const { user } = render(
      <List
        data={data}
        renderNode={renderNode}
        isCheckable
        onSelectedItems={onSelectedItems}
      />,
    );

    const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
    await user.click(selectAllCheckbox);

    expect(onSelectedItems).toHaveBeenCalledWith(['1', '2', '3']);
    expect(screen.getByText('(3)')).toBeInTheDocument();
  });
});
