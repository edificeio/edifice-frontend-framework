import { Meta, StoryObj } from '@storybook/react';
import { useRef, useState } from 'react';
import { Button } from '../Button';
import TreeView, { TreeViewHandlers } from './TreeView';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof TreeView> = {
  title: 'Components/TreeView (deprecated)',
  component: TreeView,
  parameters: {
    docs: {
      description: {
        component:
          'TreeView component allows you to display hierarchical data in a tree structure. Each node can have its own properties and children, and the tree can be expanded or collapsed to show or hide its branches. This component is deprecated and will be removed in future versions.',
      },
    },
  },
  args: {
    data: {
      id: 'default',
      name: 'Section Element',
      section: true,
      children: [
        {
          id: '1',
          name: 'level 1 arborescence tree',
          children: [
            {
              id: '4',
              name: 'level 2 arborescence tree',
              children: [
                {
                  id: '8',
                  name: 'level 3 arborescence tree',
                  children: [
                    {
                      id: '12',
                      name: 'level 4 arborescence tree',
                    },
                    {
                      id: '13',
                      name: 'level 4 arborescence tree',
                    },
                  ],
                },
                {
                  id: '9',
                  name: 'level 3 arborescence tree',
                },
              ],
            },
            {
              id: '5',
              name: 'level 2 arborescence tree',
              children: [
                {
                  id: '10',
                  name: 'level 3 arborescence tree',
                },
                {
                  id: '11',
                  name: 'level 3 arborescence tree',
                },
              ],
            },
          ],
        },
        {
          id: '2',
          name: 'level 1 arborescence tree',
          children: [
            {
              id: '6',
              name: 'level 2 arborescence tree',
            },
            {
              id: '7',
              name: 'level 2 arborescence tree',
            },
          ],
        },
        {
          id: '3',
          name: 'level 1 arborescence tree',
        },
      ],
    },
  },
};

export default meta;

type Story = StoryObj<typeof TreeView>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => {
  return <TreeView {...args} />;
};

export const Base: Story = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'TreeView component works on its own and will open/close any node with children',
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
          <Button onClick={() => setSelectedNodeId('2')}>Open node 2</Button>
        </div>
        <TreeView {...args} selectedNodeId={selectedNodeId} />
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

export const SyncTreeViewWithRef: Story = {
  render: (args) => {
    const treeViewRef = useRef<TreeViewHandlers>(null);

    return (
      <>
        <div className="my-16">
          <Button onClick={() => treeViewRef?.current.select('7')}>
            Open node 7
          </Button>
          <Button onClick={() => treeViewRef?.current.select('2')}>
            Open node 2
          </Button>
        </div>
        <TreeView ref={treeViewRef} {...args} />
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'If you need to open a specific node, you can do it with a `ref`. TreeView exposes its own handlers `TreeViewHandlers` ',
      },
    },
  },
};
