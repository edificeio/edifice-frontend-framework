import { Meta, StoryObj } from '@storybook/react';
import clsx from 'clsx';
import { useState } from 'react';
import { ToolbarItem } from '..';
import {
  IconCopy,
  IconDelete,
  IconFolderMove,
  IconForgoing,
  IconPrint,
  IconSee,
} from '../../modules/icons/components';
import { List } from './List';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof List> = {
  title: 'Components/List',
  component: List,
  parameters: {
    docs: {
      description: {
        component:
          'The `List` component provides a flexible way to display collections of items with optional toolbar actions. It supports various item types and interactive elements like icons and tooltips. Features include:\n\n- Customizable list items with icons and text\n- Optional toolbar with action buttons\n- Optional checkbox for all data\n- Tooltip support for actions\n- Flexible styling options\n- Support for selection and interaction states',
      },
    },
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

export default meta;
type Story = StoryObj<typeof List>;

const items: ToolbarItem[] = [
  {
    type: 'icon',
    name: 'read',
    props: {
      icon: <IconSee />,
    },
  },
  {
    type: 'icon',
    name: 'move',
    props: {
      icon: <IconFolderMove />,
    },
  },
  {
    type: 'icon',
    name: 'duplicate',
    props: {
      icon: <IconCopy />,
    },
  },
  {
    type: 'icon',
    name: 'history',
    props: {
      icon: <IconForgoing />,
    },
  },
  {
    type: 'icon',
    name: 'print',
    props: {
      icon: <IconPrint />,
    },
  },
  {
    type: 'icon',
    name: 'delete',
    props: {
      icon: <IconDelete />,
    },
    tooltip: {
      message: 'tooltip message',
      position: 'bottom',
    },
  },
];

interface Data {
  _id: string;
  title: string;
}

const data: Data[] = [
  {
    _id: 'ab60dbdb-f3f0-4c99-a239-64c8a2f50c77',
    title: 'Title 1',
  },
  {
    _id: 'a0d86fe6-909e-4c4a-8ceb-c15daee525a9',
    title: 'Title 2',
  },
];

export const Base: Story = {
  render: (args) => {
    return (
      <List
        data={data}
        renderNode={(node) => (
          <div
            className={clsx('grid gap-24 py-8 px-12 mb-2', {
              'bg-secondary-200 rounded': node._id === data[1]._id,
            })}
            style={{ '--edifice-columns': 8 } as React.CSSProperties}
          >
            <div className="d-flex align-items-center gap-8 g-col-3">
              <p className="text-truncate text-truncate-2">{node.title}</p>
            </div>
          </div>
        )}
      />
    );
  },
};

export const ListWithToolbar: Story = {
  render: (args) => {
    return (
      <List
        data={data}
        items={items}
        renderNode={(node, checkbox) => (
          <div
            className={clsx('grid gap-24 px-12 py-8 mb-2')}
            style={{ '--edifice-columns': 8 } as React.CSSProperties}
          >
            <div className="d-flex align-items-center gap-8 g-col-3">
              {checkbox}
              <p className="text-truncate text-truncate-2">{node.title}</p>
            </div>
          </div>
        )}
        onSelectedItems={(selectedIds) => console.log(selectedIds)}
      />
    );
  },
};

export const ListWithCheckboxes: Story = {
  render: (args) => {
    return (
      <>
        <List
          isCheckable={true}
          data={data}
          renderNode={(node, checkbox, checked) => (
            <div
              className={clsx('grid gap-24 px-12 py-8 mb-2', {
                'bg-secondary-200 rounded': checked,
              })}
              style={{ '--edifice-columns': 8 } as React.CSSProperties}
            >
              <div className="d-flex align-items-center gap-8 g-col-3">
                {checkbox}
                <p className="text-truncate text-truncate-2">{node.title}</p>
              </div>
            </div>
          )}
        />
      </>
    );
  },
};

export const ListWithCheckboxesAndToolbar: Story = {
  render: (args) => {
    return (
      <>
        <List
          items={items}
          data={data}
          renderNode={(node, checkbox, checked) => (
            <div
              className={clsx('grid gap-24 px-12 py-8 mb-2', {
                'bg-secondary-200 rounded': checked,
              })}
              style={{ '--edifice-columns': 8 } as React.CSSProperties}
            >
              <div className="d-flex align-items-center gap-8 g-col-3">
                {checkbox}
                <p className="text-truncate text-truncate-2">{node.title}</p>
              </div>
            </div>
          )}
        />
      </>
    );
  },
};

export const ListWithOnSelectedItems: Story = {
  render: (args) => {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    return (
      <>
        Selected items : {selectedItems.join(', ')}
        <List
          items={items}
          data={data}
          renderNode={(node, checkbox, checked) => (
            <div
              onClick={() => console.log('container clicked')}
              className={clsx('grid gap-24 px-12 py-8 mb-2', {
                'bg-secondary-200 rounded': checked,
              })}
              style={{ '--edifice-columns': 8 } as React.CSSProperties}
            >
              <div className="d-flex align-items-center gap-8 g-col-3">
                {checkbox}
                <p className="text-truncate text-truncate-2">{node.title}</p>
              </div>
            </div>
          )}
          onSelectedItems={setSelectedItems}
        />
      </>
    );
  },
};
