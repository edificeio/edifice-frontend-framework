import { Meta, StoryObj } from '@storybook/react';

import {
  IconAlertCircle,
  IconAlignLeft,
  IconCalendar,
  IconSmiley,
} from '../../../modules/icons/components';
import { Menu } from '../components/Menu';

const meta: Meta<typeof Menu> = {
  title: 'Components/Menu',
  component: Menu,
  args: {
    label: 'My resource',
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `Menu` component provides a menu interface with customizable items and icons. Features include:\n\n- Custom menu labels\n- Left and right icon support\n- Selected state styling\n- Flexible menu item configuration\n- Click event handling\n- Consistent dropdown positioning',
      },
    },
  },
  decorators: [(Story) => <div style={{ width: '30rem' }}>{Story()}</div>],
};

export default meta;
type Story = StoryObj<typeof Menu>;

const menuItem = {
  onClick: () => console.log(''),
  leftIcon: <IconAlignLeft />,
  rightIcon: <IconSmiley />,
  children: 'Text',
  selected: false,
};

export const Base: Story = {
  render: (args) => {
    return (
      <Menu {...args}>
        <Menu.Item>
          <Menu.Button
            onClick={menuItem.onClick}
            leftIcon={menuItem.leftIcon}
            rightIcon={menuItem.rightIcon}
            selected={menuItem.selected}
          >
            {menuItem.children}
          </Menu.Button>
        </Menu.Item>
      </Menu>
    );
  },
};

export const Label: Story = {
  render: (args) => {
    return (
      <Menu {...args}>
        <Menu.Item>
          <Menu.Button
            onClick={menuItem.onClick}
            leftIcon={menuItem.leftIcon}
            rightIcon={menuItem.rightIcon}
            selected={menuItem.selected}
          >
            {menuItem.children}
          </Menu.Button>
        </Menu.Item>
      </Menu>
    );
  },
  args: {
    label: 'Wiki',
  },
};

const data = [
  {
    id: '1',
    children: 'Node 1',
    onClick: () => console.log('node 1'),
    leftIcon: <IconAlertCircle />,
  },
  {
    id: '2',
    children: 'Node 2',
    onClick: () => console.log('node 2'),
    leftIcon: <IconCalendar />,
  },
];

export const Data: Story = {
  render: (args) => {
    return (
      <Menu {...args}>
        {data.map((item) => (
          <Menu.Item key={item.id}>
            <Menu.Button leftIcon={item.leftIcon} onClick={item.onClick}>
              {item.children}
            </Menu.Button>
          </Menu.Item>
        ))}
      </Menu>
    );
  },
};

export const SelectedState: Story = {
  render: (args) => {
    return (
      <Menu {...args}>
        {data.map((item, index) => (
          <Menu.Item key={item.id}>
            <Menu.Button
              leftIcon={item.leftIcon}
              onClick={item.onClick}
              selected={index === 0}
            >
              {item.children}
            </Menu.Button>
          </Menu.Item>
        ))}
      </Menu>
    );
  },
};

export const CustomMenuElement: Story = {
  render: (args) => {
    return (
      <Menu {...args}>
        <Menu.Item>
          <div>Custom Component</div>
        </Menu.Item>
      </Menu>
    );
  },
};

const data2 = [
  {
    id: '1',
    children: 'Node 1 with big size and truncate at the second line',
    onClick: () => console.log('node 1'),
    leftIcon: <IconAlertCircle />,
  },
  {
    id: '2',
    children: 'Node 2',
    onClick: () => console.log('node 2'),
    leftIcon: <IconCalendar />,
  },
];

export const LargeButton: Story = {
  render: (args) => {
    return (
      <div style={{ width: '20rem' }}>
        <Menu {...args}>
          {data2.map((item) => (
            <Menu.Item key={item.id}>
              <Menu.Button
                size="lg"
                leftIcon={item.leftIcon}
                onClick={item.onClick}
              >
                {item.children}
              </Menu.Button>
            </Menu.Item>
          ))}
        </Menu>
      </div>
    );
  },
};
