import { Meta, StoryObj } from '@storybook/react';
import { IconLandscape } from '../../modules/icons/components';
import { Badge } from '../Badge';
import Tabs from './components/Tabs';
import TabsItem, { TabsItemProps } from './components/TabsItem';
import TabsPanel from './components/TabsPanel';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  args: {
    defaultId: '1',
  },
  parameters: {
    docs: {
      description: {
        component:
          'Tabs component allows you to organize content into separate views which can be navigated through tab items. Each tab item can have its own content and can be selected to display the corresponding content panel.',
      },
    },
  },
  subcomponents: {
    TabsItem,
    TabsPanel,
  },
};

export default meta;

type Story = StoryObj<typeof Tabs>;

const data: TabsItemProps[] = [
  {
    id: '1',
    icon: <IconLandscape />,
    label: 'Tab item',
    content: (
      <div className="p-24">
        <p>Panel 1</p>
      </div>
    ),
  },
  {
    id: '2',
    icon: <IconLandscape />,
    label: 'Tab item',
    content: (
      <div className="p-24">
        <p>Panel 2</p>
      </div>
    ),
  },
  {
    id: '3',
    icon: <IconLandscape />,
    label: 'Tab item',
    content: (
      <div className="p-24">
        <p>Panel 3</p>
      </div>
    ),
  },
  {
    id: '4',
    icon: <IconLandscape />,
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
        icon: <IconLandscape />,
        label: 'Tab item',
        content: (
          <div className="p-24">
            <p>Panel 1</p>
          </div>
        ),
      },
      {
        id: '2',
        icon: <IconLandscape />,
        label: 'Tab item',
        content: (
          <div className="p-24">
            <p>Panel 2</p>
          </div>
        ),
      },
      {
        id: '3',
        icon: <IconLandscape />,
        label: 'Tab item',
        content: (
          <div className="p-24">
            <p>Panel 3</p>
          </div>
        ),
      },
      {
        id: '4',
        icon: <IconLandscape />,
        label: 'Tab item',
        content: (
          <div className="p-24">
            <p>Panel 4</p>
          </div>
        ),
      },
      {
        id: '5',
        icon: <IconLandscape />,
        label: 'Tab item',
        content: (
          <div className="p-24">
            <p>Panel 5</p>
          </div>
        ),
      },
      {
        id: '6',
        icon: <IconLandscape />,
        label: 'Tab item',
        content: (
          <div className="p-24">
            <p>Panel 6</p>
          </div>
        ),
      },
      {
        id: '7',
        icon: <IconLandscape />,
        label: 'Tab item',
        content: (
          <div className="p-24">
            <p>Panel 7</p>
          </div>
        ),
      },
      {
        id: '8',
        icon: <IconLandscape />,
        label: 'Tab item',
        content: (
          <div className="p-24">
            <p>Panel 8</p>
          </div>
        ),
      },
      {
        id: '9',
        icon: <IconLandscape />,
        label: 'Tab item',
        content: (
          <div className="p-24">
            <p>Panel 9</p>
          </div>
        ),
      },
      {
        id: '10',
        icon: <IconLandscape />,
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
          'Tabs become horizontally scrollable when the layout is too small and the content starts to overflow.',
      },
    },
  },
};

export const WithBadge: Story = {
  render: (args) => {
    return <Tabs {...args} />;
  },
  args: {
    items: [
      {
        id: '1',
        icon: <IconLandscape />,
        label: 'Tab item',
        badge: (
          <Badge
            variant={{
              level: 'danger',
              type: 'notification',
            }}
          >
            9
          </Badge>
        ),
        content: (
          <div className="p-24">
            <p>Panel 1</p>
          </div>
        ),
      },
      {
        id: '2',
        icon: <IconLandscape />,
        label: 'Tab item',
        badge: (
          <Badge
            variant={{
              level: 'danger',
              type: 'notification',
            }}
          >
            9
          </Badge>
        ),
        content: (
          <div className="p-24">
            <p>Panel 2</p>
          </div>
        ),
      },
      {
        id: '3',
        icon: <IconLandscape />,
        label: 'Tab item',
        badge: (
          <Badge
            variant={{
              level: 'danger',
              type: 'notification',
            }}
          >
            9
          </Badge>
        ),
        content: (
          <div className="p-24">
            <p>Panel 3</p>
          </div>
        ),
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Tabs become horizontally scrollable when the layout is too small and the content starts to overflow.',
      },
    },
  },
};

export const StickyBar: Story = {
  render: (args) => {
    return <Tabs {...args} />;
  },
  args: {
    items: [
      {
        id: '1',
        icon: <IconLandscape />,
        label: 'Tab item',
        content: (
          <div className="p-24">
            <p>
              Lorem ipsum is a dummy or placeholder text commonly used in
              graphic design, publishing, and web development. Its purpose is to
              permit a page layout to be designed, independently of the copy
              that will subsequently populate it, or to demonstrate various
              fonts of a typeface without meaningful text that could be
              distracting. Lorem ipsum is typically a corrupted version of De
              finibus bonorum et malorum, a 1st-century BCE text by the Roman
              statesman and philosopher Cicero, with words altered, added, and
              removed to make it nonsensical and improper Latin. The first two
              words are the truncation of dolorem ipsum ("pain itself").
              Versions of the Lorem ipsum text have been used in typesetting
              since the 1960s, when advertisements for Letraset transfer sheets
              popularized it.[1] Lorem ipsum was introduced to the digital world
              in the mid-1980s, when Aldus employed it in graphic and
              word-processing templates for its desktop publishing program
              PageMaker. Other popular word processors, including Pages and
              Microsoft Word, have since adopted Lorem ipsum,[2] as have many
              LaTeX packages,[3][4][5] web content managers such as Joomla! and
              WordPress, and CSS libraries such as Semantic UI.
            </p>
            <p>
              Lorem ipsum is a dummy or placeholder text commonly used in
              graphic design, publishing, and web development. Its purpose is to
              permit a page layout to be designed, independently of the copy
              that will subsequently populate it, or to demonstrate various
              fonts of a typeface without meaningful text that could be
              distracting. Lorem ipsum is typically a corrupted version of De
              finibus bonorum et malorum, a 1st-century BCE text by the Roman
              statesman and philosopher Cicero, with words altered, added, and
              removed to make it nonsensical and improper Latin. The first two
              words are the truncation of dolorem ipsum ("pain itself").
              Versions of the Lorem ipsum text have been used in typesetting
              since the 1960s, when advertisements for Letraset transfer sheets
              popularized it.[1] Lorem ipsum was introduced to the digital world
              in the mid-1980s, when Aldus employed it in graphic and
              word-processing templates for its desktop publishing program
              PageMaker. Other popular word processors, including Pages and
              Microsoft Word, have since adopted Lorem ipsum,[2] as have many
              LaTeX packages,[3][4][5] web content managers such as Joomla! and
              WordPress, and CSS libraries such as Semantic UI.
            </p>
            <p>
              Lorem ipsum is a dummy or placeholder text commonly used in
              graphic design, publishing, and web development. Its purpose is to
              permit a page layout to be designed, independently of the copy
              that will subsequently populate it, or to demonstrate various
              fonts of a typeface without meaningful text that could be
              distracting. Lorem ipsum is typically a corrupted version of De
              finibus bonorum et malorum, a 1st-century BCE text by the Roman
              statesman and philosopher Cicero, with words altered, added, and
              removed to make it nonsensical and improper Latin. The first two
              words are the truncation of dolorem ipsum ("pain itself").
              Versions of the Lorem ipsum text have been used in typesetting
              since the 1960s, when advertisements for Letraset transfer sheets
              popularized it.[1] Lorem ipsum was introduced to the digital world
              in the mid-1980s, when Aldus employed it in graphic and
              word-processing templates for its desktop publishing program
              PageMaker. Other popular word processors, including Pages and
              Microsoft Word, have since adopted Lorem ipsum,[2] as have many
              LaTeX packages,[3][4][5] web content managers such as Joomla! and
              WordPress, and CSS libraries such as Semantic UI.
            </p>
            <p>
              Lorem ipsum is a dummy or placeholder text commonly used in
              graphic design, publishing, and web development. Its purpose is to
              permit a page layout to be designed, independently of the copy
              that will subsequently populate it, or to demonstrate various
              fonts of a typeface without meaningful text that could be
              distracting. Lorem ipsum is typically a corrupted version of De
              finibus bonorum et malorum, a 1st-century BCE text by the Roman
              statesman and philosopher Cicero, with words altered, added, and
              removed to make it nonsensical and improper Latin. The first two
              words are the truncation of dolorem ipsum ("pain itself").
              Versions of the Lorem ipsum text have been used in typesetting
              since the 1960s, when advertisements for Letraset transfer sheets
              popularized it.[1] Lorem ipsum was introduced to the digital world
              in the mid-1980s, when Aldus employed it in graphic and
              word-processing templates for its desktop publishing program
              PageMaker. Other popular word processors, including Pages and
              Microsoft Word, have since adopted Lorem ipsum,[2] as have many
              LaTeX packages,[3][4][5] web content managers such as Joomla! and
              WordPress, and CSS libraries such as Semantic UI.
            </p>
          </div>
        ),
      },
      {
        id: '2',
        icon: <IconLandscape />,
        label: 'Tab item',
        content: (
          <div className="p-24">
            <p>Panel 2</p>
          </div>
        ),
      },
    ],
    isSticky: true,
    stickyTop: 0,
  },
};
