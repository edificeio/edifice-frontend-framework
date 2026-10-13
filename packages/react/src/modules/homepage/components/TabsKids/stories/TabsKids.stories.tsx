import { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';

import TabsKids, { TabsKidsProps } from '../components/TabsKids';

const meta: Meta<typeof TabsKids> = {
  title: 'Modules/Homepage/TabsKids',
  component: TabsKids,
  args: {
    showTabBar: true,
    ariaLabel: 'Enfants',
    overflowLabel: 'Voir plus',
  },
  argTypes: {
    items: { control: 'object' },
    activeId: { control: 'text' },
    // Driven by the stories themselves.
    onChange: { control: false },
    children: { control: false },
  },
  // Storybook hooks must be called in the story function itself.
  render: function Render(args) {
    const [, updateArgs] = useArgs<TabsKidsProps>();
    const activeItem = args.items.find((item) => item.id === args.activeId);

    return (
      <TabsKids
        {...args}
        onChange={(activeId) => {
          args.onChange?.(activeId);
          updateArgs({ activeId });
        }}
      >
        <div className="p-16 bg-white rounded-2">{activeItem?.label}</div>
      </TabsKids>
    );
  },
  parameters: {
    docs: {
      description: {
        component:
          'TabsKids displays "folder" tabs following the new design system. It is controlled (`activeId` / `onChange`) and handles the selection: the content of the selected tab is passed as `children` and rendered in a panel below the tab bar. The tabs fill the available width: the ones that do not fit are moved into an overflow dropdown, and come back as soon as there is room again. The active item always stays visible. From 3 items, the inactive tabs only display the initial of their label. The tab bar is displayed even with a single item, unless `showTabBar` is `false`.',
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

export const Base: Story = {
  args: { items, activeId: '0' },
};

export const SingleItem: Story = {
  args: { items: items.slice(0, 1), activeId: '0' },
};

export const WithoutTabBar: Story = {
  args: { items: items.slice(0, 1), activeId: '0', showTabBar: false },
  parameters: {
    docs: {
      description: {
        story:
          'With `showTabBar={false}`, only the panel of the active item is rendered, e.g. for a student viewing their own data.',
      },
    },
  },
};

export const WithoutAvatar: Story = {
  args: {
    items: items.slice(0, 3).map(({ id, label }) => ({ id, label })),
    activeId: '0',
  },
};

export const NarrowContainer: Story = {
  args: { items, activeId: '0' },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'The 5 items in a 400px wide container: the tabs that do not fit are moved into the overflow dropdown, whatever the viewport width.',
      },
    },
  },
};
