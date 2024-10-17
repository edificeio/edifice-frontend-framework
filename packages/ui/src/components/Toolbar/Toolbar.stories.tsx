import { Meta, StoryObj } from '@storybook/react';

import {
  Delete,
  Plus,
  Record,
  RecordVideo,
  Save,
  Write,
} from '../../../../icons/dist';
import { Dropdown } from '../Dropdown';
import Toolbar from './Toolbar';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Toolbar> = {
  title: 'Components/Toolbar',
  component: Toolbar,
  parameters: {
    docs: {
      description: {
        component: '',
      },
    },
  },
  argTypes: {
    variant: {
      options: ['default', 'no-shadow'],
      control: { type: 'select' },
    },
    isBlock: { control: 'boolean' },
    align: {
      options: ['left', 'center', 'space', 'right'],
      control: { type: 'select' },
    },
  },
  args: {
    items: [
      {
        type: 'icon',
        name: 'record',
        props: {
          icon: <RecordVideo />,
          onClick: () => console.log('on click'),
          disabled: true,
        },
      },
      {
        type: 'icon',
        name: 'save',
        props: {
          icon: <Save />,
          onClick: () => console.log('on click'),
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'icon',
        name: 'write',
        props: {
          icon: <Write />,
          onClick: () => console.log('on click'),
          disabled: true,
        },
      },
      {
        type: 'icon',
        name: 'delete',
        props: {
          icon: <Delete />,
          onClick: () => console.log('on click'),
        },
      },
    ],
  },
};

export default meta;

type Story = StoryObj<typeof Toolbar>;

export const Base: Story = {
  render: (args) => <Toolbar {...args} />,
};

export const Hidden: Story = {
  render: (args) => <Toolbar {...args} />,
  args: {
    items: [
      {
        type: 'icon',
        name: 'record',
        props: {
          icon: <RecordVideo />,
          onClick: () => console.log('on click'),
        },
        visibility: 'hide',
      },
      {
        type: 'icon',
        name: 'save',
        props: {
          icon: <Save />,
          onClick: () => console.log('on click'),
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'icon',
        name: 'write',
        props: {
          icon: <Write />,
          onClick: () => console.log('on click'),
        },
      },
      {
        type: 'icon',
        name: 'delete',
        props: {
          icon: <Delete />,
          onClick: () => console.log('on click'),
        },
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'When data object has `visibility` set to `hide`, it will not be displayed',
      },
    },
  },
};

export const WithDivider: Story = {
  render: (args) => <Toolbar {...args} />,
  args: {
    items: [
      {
        type: 'icon',
        name: 'record',
        props: {
          icon: <RecordVideo />,
          onClick: () => console.log('on click'),
        },
      },
      {
        type: 'icon',
        name: 'save',
        props: {
          icon: <Save />,
          onClick: () => console.log('on click'),
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'icon',
        name: 'write',
        props: {
          icon: <Write />,
          onClick: () => console.log('on click'),
        },
      },
      {
        type: 'icon',
        name: 'delete',
        props: {
          icon: <Delete />,
          onClick: () => console.log('on click'),
        },
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Add a data object only with `type` to `divider` to show a divider element',
      },
    },
  },
};

export const WithPrimaryAction: Story = {
  render: (args) => <Toolbar {...args} />,
  args: {
    items: [
      {
        type: 'button',
        name: 'save',
        props: {
          children: (
            <>
              <Save />
              <span>Delete</span>
            </>
          ),
          onClick: () => console.log('on click'),
        },
      },
      {
        type: 'icon',
        name: 'delete',
        props: {
          icon: <Delete />,
          onClick: () => console.log('on click'),
        },
      },
      {
        type: 'primary',
        name: 'plus',
        props: {
          children: (
            <>
              <Plus />
              <span>Add</span>
            </>
          ),
          onClick: () => console.log('on click'),
        },
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'A data object with `type` to `primary` will be considered as primary action and will be shown to the end of Toolbar. It will accept the same properties as a data object',
      },
    },
  },
};

export const WithDropdownAction: Story = {
  render: (args) => <Toolbar {...args} />,
  decorators: [
    (Story) => (
      <div className="m-24" style={{ height: '300px' }}>
        {Story()}
      </div>
    ),
  ],
  args: {
    items: [
      {
        type: 'button',
        name: 'record',
        props: {
          disabled: false,
          children: (
            <>
              <Record />
              <span>Record</span>
            </>
          ),
          onClick: () => console.log('on click'),
        },
      },
      {
        type: 'button',
        name: 'save',
        props: {
          disabled: false,
          children: (
            <>
              <Save />
              <span>Delete</span>
            </>
          ),
          onClick: () => console.log('on click'),
        },
      },
      {
        type: 'dropdown',
        name: 'others',
        props: {
          children: () => (
            <>
              <Dropdown.Trigger variant="ghost" label="More..." />
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => alert('click 1')}>
                  Write something...
                </Dropdown.Item>
                <Dropdown.Item onClick={() => alert('click 2')}>
                  Edit something...
                </Dropdown.Item>
              </Dropdown.Menu>
            </>
          ),
        },
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Using an item of type `dropdown`, you have to provide its children through props',
      },
    },
  },
};

export const WithoutShadow: Story = {
  render: (args) => <Toolbar {...args} variant="no-shadow" />,
  parameters: {
    docs: {
      description: {
        story: 'By adding `variant` to `no-shadow`, box-shadow is disabled.',
      },
    },
  },
};
