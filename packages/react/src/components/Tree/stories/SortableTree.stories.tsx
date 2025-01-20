import { Meta, StoryObj } from '@storybook/react';
import SortableTree from '../components/SortableTree';
import { SortableTreeProps, UpdateTreeData } from '../types';

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

export const WithIcons: Story = {
  render: (args) => <SortableTree {...args} showIcon />,
  args: {
    ...meta.args,
  },
  parameters: {
    docs: {
      description: {
        story: 'SortableTree component with icons displayed for each node.',
      },
      source: {
        code: `<SortableTree showIcon />`,
      },
    },
  },
};

export const ExpandedNodes: Story = {
  render: (args) => <SortableTree {...args} shouldExpandAllNodes />,
  args: {
    ...meta.args,
  },
  parameters: {
    docs: {
      description: {
        story: 'SortableTree component with all nodes expanded by default.',
      },
      source: {
        code: `<SortableTree shouldExpandAllNodes />`,
      },
    },
  },
};

export const DisabledNodes: Story = {
  render: (args) => (
    <SortableTree
      {...args}
      isDisabled={(node) => node === '3' || node === '6'}
    />
  ),
  args: {
    ...meta.args,
  },
  parameters: {
    docs: {
      description: {
        story:
          'SortableTree component with some nodes disabled. These nodes cannot be dragged or dropped.',
      },
      source: {
        code: ` <SortableTree isDisabled={(node) => node === '3' || node === '6'} />`,
      },
    },
  },
};

export const DisabledAllNodes: Story = {
  render: (args) => <SortableTree {...args} isDisabled={() => true} />,
  args: {
    ...meta.args,
  },
  parameters: {
    docs: {
      description: {
        story:
          'SortableTree component with all nodes disabled. No nodes can be dragged or dropped.',
      },
      source: {
        code: `<SortableTree isDisabled={() => true} />`,
      },
    },
  },
};

export const CustomRenderNode: Story = {
  render: (args) => (
    <SortableTree
      {...args}
      renderNode={(payload) => (
        <div className="custom-node">
          <span>{payload?.node?.name}</span> - <span>{payload?.node?.id}</span>
        </div>
      )}
    />
  ),
  args: {
    ...meta.args,
  },
  parameters: {
    docs: {
      description: {
        story: 'SortableTree component with a custom renderNode function.',
      },
      source: {
        code: `<SortableTree
  renderNode={(payload) => (
    <div className="custom-node">
      <span>{payload?.node?.name}</span> - <span>{payload?.node?.id}</span>
    </div>
  )}
/>`,
      },
    },
  },
};

const fakePUTRequest = (nodes: UpdateTreeData[]) => {
  console.log('Fake API call completed');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          pages: nodes.map((page) => ({
            _id: page._id,
            parentId: page.parentId!,
            position: page.position ?? 0,
          })),
        },
      });
    }, 1000);
  });
};

export const UpdatePagesOnSortable: Story = {
  render: (args) => (
    <SortableTree
      {...args}
      onSortable={async (nodes) => {
        const updatedPosition = await fakePUTRequest(nodes);
        alert(JSON.stringify(updatedPosition));
      }}
    />
  ),
  args: {
    ...meta.args,
  },
  parameters: {
    docs: {
      description: {
        story:
          'SortableTree component with onSortable prop to update the position of pages via an API PUT request.',
      },
      source: {
        code: `<SortableTree onSortable={async (nodes) => {
  const fakePUTRequest = (nodes: UpdateTreeData[]) => {
  console.log('Fake API call completed');

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          pages: nodes.map((page) => ({
            _id: page._id,
            parentId: page.parentId!,
            position: page.position ?? 0,
          })),
        },
      });
    }, 1000);
  });
};

  const updatedPosition = await fakePUTRequest(nodes);
  alert(JSON.stringify(updatedPosition));
}}
/>`,
      },
    },
  },
};
