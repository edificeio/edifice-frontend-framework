import { render, screen, within } from '~/setup';
import SortableTree from './components/SortableTree';
import { TreeItem } from './types';

// Full drag-and-drop simulation through @dnd-kit's sensors is not exercised
// here (jsdom has no real pointer geometry) — this covers rendering,
// selection and fold/unfold only, matching the reused Tree/useTree logic.

const nodes: TreeItem[] = [
  {
    id: 'root1',
    name: 'Root 1',
    children: [{ id: 'child1', name: 'Child 1' }],
  },
  { id: 'root2', name: 'Root 2' },
];

function getNode(name: string) {
  return screen.getByText(name).closest('li[role="treeitem"]') as HTMLElement;
}

function getLabelButton(name: string) {
  return screen.getByRole('button', { name });
}

function getArrowButton(name: string) {
  return within(getNode(name)).getAllByRole('button')[0];
}

describe('SortableTree', () => {
  it('renders the top-level nodes collapsed by default', () => {
    render(
      <SortableTree
        nodes={nodes}
        onTreeItemClick={vi.fn()}
        onSortable={vi.fn()}
      />,
    );

    expect(screen.getByRole('tree')).toBeInTheDocument();
    expect(screen.getAllByRole('treeitem')).toHaveLength(2);
    expect(screen.queryByText('Child 1')).not.toBeInTheDocument();
  });

  it('selects and expands a node on label click', async () => {
    const onTreeItemClick = vi.fn();
    const { user } = render(
      <SortableTree
        nodes={nodes}
        onTreeItemClick={onTreeItemClick}
        onSortable={vi.fn()}
      />,
    );

    await user.click(getLabelButton('Root 1'));

    expect(onTreeItemClick).toHaveBeenCalledWith('root1');
    expect(getNode('Root 1')).toHaveAttribute('aria-selected', 'true');
    expect(getNode('Root 1')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Child 1')).toBeInTheDocument();
  });

  it('toggles fold/unfold via the arrow button without selecting the node', async () => {
    const onTreeItemClick = vi.fn();
    const { user } = render(
      <SortableTree
        nodes={nodes}
        onTreeItemClick={onTreeItemClick}
        onSortable={vi.fn()}
      />,
    );

    await user.click(getArrowButton('Root 1'));

    expect(onTreeItemClick).not.toHaveBeenCalled();
    expect(getNode('Root 1')).toHaveAttribute('aria-expanded', 'true');

    await user.click(getArrowButton('Root 1'));
    expect(getNode('Root 1')).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Child 1')).not.toBeInTheDocument();
  });

  it('renders normally when isDisabled marks a node as non-sortable', () => {
    render(
      <SortableTree
        nodes={nodes}
        onTreeItemClick={vi.fn()}
        onSortable={vi.fn()}
        isDisabled={(id) => id === 'root2'}
      />,
    );

    expect(screen.getAllByRole('treeitem')).toHaveLength(2);
  });
});
