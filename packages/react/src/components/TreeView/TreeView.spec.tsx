import { createRef } from 'react';

import { act, render, screen, within } from '~/setup';
import TreeView, { TreeViewHandlers_V1 } from './TreeView';
import { TreeData } from '../../types';

const data: TreeData[] = [
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

describe('TreeView', () => {
  it('renders the top-level nodes collapsed by default', () => {
    render(<TreeView data={data} />);

    expect(screen.getByRole('tree')).toBeInTheDocument();
    expect(screen.getAllByRole('treeitem')).toHaveLength(2);
    expect(screen.queryByText('Child 1')).not.toBeInTheDocument();
  });

  it('selects and expands a node on label click, notifying onTreeItemClick and onTreeItemUnfold', async () => {
    const onTreeItemClick = vi.fn();
    const onTreeItemUnfold = vi.fn();
    const { user } = render(
      <TreeView
        data={data}
        onTreeItemClick={onTreeItemClick}
        onTreeItemUnfold={onTreeItemUnfold}
      />,
    );

    await user.click(getLabelButton('Root 1'));

    expect(onTreeItemClick).toHaveBeenCalledWith('root1');
    expect(onTreeItemUnfold).toHaveBeenCalledWith('root1');
    expect(getNode('Root 1')).toHaveAttribute('aria-selected', 'true');
    expect(getNode('Root 1')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  it('toggles fold/unfold via the arrow button without selecting the node', async () => {
    const onTreeItemClick = vi.fn();
    const onTreeItemFold = vi.fn();
    const { user } = render(
      <TreeView
        data={data}
        onTreeItemClick={onTreeItemClick}
        onTreeItemFold={onTreeItemFold}
      />,
    );

    await user.click(getArrowButton('Root 1'));

    expect(onTreeItemClick).not.toHaveBeenCalled();
    expect(getNode('Root 1')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Child 1')).toBeInTheDocument();

    await user.click(getArrowButton('Root 1'));

    expect(getNode('Root 1')).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Child 1')).not.toBeInTheDocument();
    // Collapsing the only expanded node leaves no node in the resulting set,
    // so the fold callback (fired per remaining expanded node) never runs.
    expect(onTreeItemFold).not.toHaveBeenCalled();
  });

  it('re-notifies unfold for every already-expanded node when expanding a sibling (existing inefficiency)', async () => {
    const onTreeItemUnfold = vi.fn();
    const { user } = render(
      <TreeView data={data} onTreeItemUnfold={onTreeItemUnfold} />,
    );

    await user.click(getArrowButton('Root 1'));
    expect(onTreeItemUnfold).toHaveBeenCalledTimes(1);

    await user.click(getArrowButton('Root 2'));

    expect(onTreeItemUnfold).toHaveBeenCalledTimes(3);
    expect(onTreeItemUnfold).toHaveBeenNthCalledWith(2, 'root1');
    expect(onTreeItemUnfold).toHaveBeenNthCalledWith(3, 'root2');
  });

  it('expands the ancestor path and selects the node referenced by selectedNodeId', () => {
    render(<TreeView data={data} selectedNodeId="child1" />);

    expect(getNode('Root 1')).toHaveAttribute('aria-expanded', 'true');
    expect(getNode('Child 1')).toHaveAttribute('aria-selected', 'true');
  });

  it('shows the folder icon on section nodes only when showIcon is true', () => {
    const sectionData: TreeData[] = [
      { id: 'sec1', name: 'Section 1', section: true, children: [] },
    ];

    const { rerender } = render(<TreeView data={sectionData} showIcon />);
    expect(getLabelButton('Section 1').querySelector('svg')).not.toBeNull();

    rerender(<TreeView data={sectionData} showIcon={false} />);
    expect(getLabelButton('Section 1').querySelector('svg')).toBeNull();
  });

  it('calls onTreeItemAction when clicking the secondary action button of a section node', async () => {
    const onTreeItemAction = vi.fn();
    const sectionData: TreeData[] = [
      { id: 'sec1', name: 'Section 1', section: true, children: [] },
    ];
    const { user, container } = render(
      <TreeView data={sectionData} onTreeItemAction={onTreeItemAction} />,
    );

    await user.click(container.querySelector('.tree-btn') as HTMLElement);

    expect(onTreeItemAction).toHaveBeenCalledWith('sec1');
  });

  it('exposes select() and unselectAll() through the imperative ref', () => {
    const ref = createRef<TreeViewHandlers_V1>();
    const onTreeItemClick = vi.fn();
    render(
      <TreeView ref={ref} data={data} onTreeItemClick={onTreeItemClick} />,
    );

    act(() => ref.current?.select('root2'));
    expect(onTreeItemClick).toHaveBeenCalledWith('root2');
    expect(getNode('Root 2')).toHaveAttribute('aria-selected', 'true');

    act(() => ref.current?.unselectAll());
    expect(getNode('Root 2')).toHaveAttribute('aria-selected', 'false');
  });

  it('selects a node with Enter/Space on its label', async () => {
    const onTreeItemClick = vi.fn();
    const { user } = render(
      <TreeView data={data} onTreeItemClick={onTreeItemClick} />,
    );

    getLabelButton('Root 2').focus();
    await user.keyboard('{Enter}');

    expect(onTreeItemClick).toHaveBeenCalledWith('root2');
  });
});
