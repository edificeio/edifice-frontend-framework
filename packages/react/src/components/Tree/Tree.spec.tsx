import { render, screen, within } from '~/setup';
import Tree from './components/Tree';
import { TreeItem } from './types';

const nodes: TreeItem[] = [
  {
    id: 'root1',
    name: 'Root 1',
    children: [
      { id: 'child1', name: 'Child 1' },
      { id: 'child2', name: 'Child 2' },
    ],
  },
  {
    id: 'root2',
    name: 'Root 2',
    children: [{ id: 'child3', name: 'Child 3' }],
  },
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

describe('Tree', () => {
  it('renders the top-level nodes collapsed by default', () => {
    render(<Tree nodes={nodes} onTreeItemClick={vi.fn()} />);

    expect(screen.getByRole('tree')).toBeInTheDocument();
    expect(screen.getAllByRole('treeitem')).toHaveLength(2);
    expect(screen.queryByText('Child 1')).not.toBeInTheDocument();
  });

  it('selects and expands a node on label click', async () => {
    const onTreeItemClick = vi.fn();
    const { user } = render(
      <Tree nodes={nodes} onTreeItemClick={onTreeItemClick} />,
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
      <Tree nodes={nodes} onTreeItemClick={onTreeItemClick} />,
    );

    await user.click(getArrowButton('Root 1'));

    expect(onTreeItemClick).not.toHaveBeenCalled();
    expect(getNode('Root 1')).toHaveAttribute('aria-expanded', 'true');

    await user.click(getArrowButton('Root 1'));
    expect(getNode('Root 1')).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Child 1')).not.toBeInTheDocument();
  });

  it('shows the folder icon only when showIcon is true', () => {
    // The arrow toggle always renders an svg for nodes with children, so
    // compare svg counts rather than presence/absence.
    const getActionSvgCount = () =>
      getLabelButton('Root 1').parentElement?.querySelectorAll('svg').length;

    const { rerender } = render(
      <Tree nodes={nodes} onTreeItemClick={vi.fn()} showIcon />,
    );
    expect(getActionSvgCount()).toBe(2);

    rerender(<Tree nodes={nodes} onTreeItemClick={vi.fn()} showIcon={false} />);
    expect(getActionSvgCount()).toBe(1);
  });

  it('replaces the default label with renderNode', () => {
    render(
      <Tree
        nodes={nodes}
        onTreeItemClick={vi.fn()}
        renderNode={({ node }) => <strong>Custom {node.name}</strong>}
      />,
    );

    expect(screen.getByText('Custom Root 1')).toBeInTheDocument();
    expect(screen.queryByText('Root 1')).not.toBeInTheDocument();
  });

  it('expands the ancestor path and selects the node referenced by selectedNodeId', () => {
    render(
      <Tree nodes={nodes} onTreeItemClick={vi.fn()} selectedNodeId="child1" />,
    );

    expect(getNode('Root 1')).toHaveAttribute('aria-expanded', 'true');
    expect(getNode('Child 1')).toHaveAttribute('aria-selected', 'true');
  });

  it('expands every top-level node when shouldExpandAllNodes is true', () => {
    render(
      <Tree nodes={nodes} onTreeItemClick={vi.fn()} shouldExpandAllNodes />,
    );

    expect(getNode('Root 1')).toHaveAttribute('aria-expanded', 'true');
    expect(getNode('Root 2')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 3')).toBeInTheDocument();
  });
});
