import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../../Button';
import Tree from '../components/Tree';
import { TreeProps } from '../types';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Tree> = {
  title: 'Components/Tree',
  component: Tree,
  parameters: {
    docs: {
      description: {
        component:
          'Tree component allows you to display hierarchical data in a tree structure. Each node can have its own properties and children, and the tree can be expanded or collapsed to show or hide its branches.',
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
  },
};

export default meta;

type Story = StoryObj<typeof Tree>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args: TreeProps) => {
  return <Tree {...args} />;
};

export const Base: Story = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Tree component works on its own and will open/close any node with children',
      },
    },
  },
};

export const SyncTreeView: Story = {
  render: (args) => {
    const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(
      undefined,
    );

    return (
      <>
        <div className="my-16">
          <Button onClick={() => setSelectedNodeId('7')}>Open node 7</Button>
          <Button onClick={() => setSelectedNodeId('4')}>Open node 4</Button>
        </div>
        <Tree {...args} selectedNodeId={selectedNodeId} />
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'If you need to open a specific node, you can do it with the `selectedNodeId` props. You will sync the treeview with an external source',
      },
    },
  },
};

export const ExpandAllNodes: Story = {
  render: (args) => <Tree {...args} shouldExpandAllNodes />,
  parameters: {
    docs: {
      description: {
        story:
          'This story demonstrates the Tree component with all nodes expanded by default using the `shouldExpandAllNodes` prop.',
      },
    },
  },
};

export const TreeItemFoldUnfold: Story = {
  render: (args) => {
    const [unfolded, setUnfolded] = useState('');

    const handleFold = (nodeId: string) => {
      console.log(`Node ${nodeId} folded`);
    };

    const handleUnfold = (nodeId: string) => {
      console.log(`Node ${nodeId} unfolded`);
      setUnfolded(nodeId);
    };

    return (
      <div className="d-flex align-items-center justify-content-between">
        <Tree
          {...args}
          onTreeItemFold={handleFold}
          onTreeItemUnfold={handleUnfold}
        />
        <div>Node unfolded : {unfolded}</div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'This story demonstrates the Tree component with fold and unfold callbacks using the `onTreeItemFold` and `onTreeItemUnfold` props.',
      },
    },
  },
};
