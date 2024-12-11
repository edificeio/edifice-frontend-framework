import { Meta, StoryObj } from '@storybook/react';
import SortableTree from '../components/SortableTree';
import { SortableTreeProps } from '../types';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof SortableTree> = {
  title: 'Components/Tree/SortableTree',
  component: SortableTree,
  parameters: {
    docs: {
      description: {
        component:
          'SortableTree component allows you to display hierarchical data in a tree structure with drag-and-drop functionality. Each node can have its own properties and children, and the tree can be expanded or collapsed to show or hide its branches. Nodes can be reordered by dragging and dropping them to new positions.',
      },
    },
  },
  args: {
    nodes: [
      {
        id: '1',
        name: 'First Element',
        section: true,
        children: [
          {
            id: '3',
            name: 'level 1 arborescence tree',
          },
          {
            id: '4',
            name: 'level 2 arborescence tree',
          },
        ],
      },
      {
        id: '2',
        name: 'Second Element',
        children: [
          {
            id: '6',
            name: 'level 1 arborescence tree',
          },
          {
            id: '7',
            name: 'level 2 arborescence tree',
          },
        ],
      },
    ],
    selectedNodeId: '1',
    renderNode: (payload) => (
      <div className="d-flex align-items-center">{payload?.node?.name}</div>
    ),
    onSortable: (nodes) => console.log(nodes),
    onTreeItemClick: (nodeId) => console.log(nodeId),
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

export default meta;

type Story = StoryObj<typeof SortableTree>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args: SortableTreeProps) => {
  return <SortableTree {...args} />;
};

export const Base: Story = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'SortableTree component allows to drag and drop tree nodes to reorder them',
      },
    },
  },
};
