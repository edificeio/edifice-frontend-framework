import { useState } from 'react';

import { Meta, StoryObj } from '@storybook/react-vite';

import TabsKids, { TabsKidsProps } from '../components/TabsKids';

const meta: Meta<typeof TabsKids> = {
  title: 'Modules/Homepage/TabsKids',
  component: TabsKids,
  parameters: {
    docs: {
      description: {
        component:
          'TabsKids displays "folder" tabs following the new design system. It is controlled (`activeId` / `onChange`) and handles the selection: the content of the selected tab is passed as `children` and rendered in a panel below the tab bar. The tabs fill the available width: the ones that do not fit are moved into an overflow dropdown, and come back as soon as there is room again. The active item always stays visible. From 3 items, the inactive tabs only display the initial of their label.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TabsKids>;

const names = [
  'Alice Martin',
  'Bob Durand',
  'Chloé Petit',
  'David Moreau',
  'Emma Leroy',
];

const avatars = [
  'https://i.pravatar.cc/150?img=1',
  'https://i.pravatar.cc/150?img=2',
  'https://i.pravatar.cc/150?img=3',
  'https://i.pravatar.cc/150?img=4',
  'https://i.pravatar.cc/150?img=5',
];

const items = names.map((name, i) => ({
  id: String(i),
  label: name,
  avatar: avatars[i],
}));

const ControlledTabs = (args: Partial<TabsKidsProps>) => {
  const [activeId, setActiveId] = useState('0');
  return (
    <TabsKids
      items={items}
      {...args}
      activeId={activeId}
      onChange={setActiveId}
    >
      <div className="p-16 bg-white rounded-2">
        {items[Number(activeId)].label}
      </div>
    </TabsKids>
  );
};

export const Base: Story = {
  render: () => <ControlledTabs items={items.slice(0, 5)} />,
};

export const SingleItem: Story = {
  render: () => <ControlledTabs items={items.slice(0, 1)} />,
};

export const WithoutAvatar: Story = {
  render: () => (
    <ControlledTabs
      items={items.slice(0, 3).map(({ id, label }) => ({ id, label }))}
    />
  ),
};

export const NarrowContainer: Story = {
  render: () => (
    <div style={{ width: 400 }}>
      <ControlledTabs items={items} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The 5 items in a 400px wide container: the tabs that do not fit are moved into the overflow dropdown, whatever the viewport width.',
      },
    },
  },
};
