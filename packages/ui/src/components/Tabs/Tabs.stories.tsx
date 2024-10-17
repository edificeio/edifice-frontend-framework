import { Meta, StoryObj } from '@storybook/react';
import { Landscape } from '../../../../icons/dist';

import Tabs from './Tabs';
import { TabsItemProps } from './TabsItem';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  args: {
    defaultId: '1',
  },
};

export default meta;

type Story = StoryObj<typeof Tabs>;

const data: TabsItemProps[] = [
  {
    id: '1',
    icon: <Landscape />,
    label: 'Tab item',
    content: (
      <div className="p-24">
        <p>Panel 1</p>
      </div>
    ),
  },
  {
    id: '2',
    icon: <Landscape />,
    label: 'Tab item',
    content: (
      <div className="p-24">
        <p>Panel 2</p>
      </div>
    ),
  },
  {
    id: '3',
    icon: <Landscape />,
    label: 'Tab item',
    content: (
      <div className="p-24">
        <p>Panel 3</p>
      </div>
    ),
  },
  {
    id: '4',
    icon: <Landscape />,
    label: 'Tab item',
    content: (
      <div className="p-24">
        <p>Panel 4</p>
      </div>
    ),
  },
];

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Base: Story = {
  render: (args) => {
    return <Tabs {...args} />;
  },
  args: {
    items: data,
  },
};

export const Scroll: Story = {
  render: (args) => {
    return <Tabs {...args} />;
  },
  args: {
    items: [
      {
        id: '1',
        icon: <Landscape />,
        label: 'Tab item',
        content: (
          <div className="p-24">
            <p>Panel 1</p>
          </div>
        ),
      },
      {
        id: '2',
        icon: <Landscape />,
        label: 'Tab item',
        content: (
          <div className="p-24">
            <p>Panel 2</p>
          </div>
        ),
      },
      {
        id: '3',
        icon: <Landscape />,
        label: 'Tab item',
        content: (
          <div className="p-24">
            <p>Panel 3</p>
          </div>
        ),
      },
      {
        id: '4',
        icon: <Landscape />,
        label: 'Tab item',
        content: (
          <div className="p-24">
            <p>Panel 4</p>
          </div>
        ),
      },
      {
        id: '5',
        icon: <Landscape />,
        label: 'Tab item',
        content: (
          <div className="p-24">
            <p>Panel 5</p>
          </div>
        ),
      },
      {
        id: '6',
        icon: <Landscape />,
        label: 'Tab item',
        content: (
          <div className="p-24">
            <p>Panel 6</p>
          </div>
        ),
      },
      {
        id: '7',
        icon: <Landscape />,
        label: 'Tab item',
        content: (
          <div className="p-24">
            <p>Panel 7</p>
          </div>
        ),
      },
      {
        id: '8',
        icon: <Landscape />,
        label: 'Tab item',
        content: (
          <div className="p-24">
            <p>Panel 8</p>
          </div>
        ),
      },
      {
        id: '9',
        icon: <Landscape />,
        label: 'Tab item',
        content: (
          <div className="p-24">
            <p>Panel 9</p>
          </div>
        ),
      },
      {
        id: '10',
        icon: <Landscape />,
        label: 'Tab item',
        content: (
          <div className="p-24">
            <p>Panel 10</p>
          </div>
        ),
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Tabs becomes horizontaly scrollable when layout is too small and content start to overflow.',
      },
    },
  },
};
