import { Meta, StoryObj } from "@storybook/react";
import { IconLandscape } from "../../modules/icons/components";
import Tabs from "./components/Tabs";
import TabsItem, { TabsItemProps } from "./components/TabsItem";
import TabsPanel from "./components/TabsPanel";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  args: {
    defaultId: "1",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Tabs component allows you to organize content into separate views which can be navigated through tab items. Each tab item can have its own content and can be selected to display the corresponding content panel.",
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
    id: "1",
    icon: <IconLandscape />,
    label: "Tab item",
    content: (
      <div className="p-24">
        <p>Panel 1</p>
      </div>
    ),
  },
  {
    id: "2",
    icon: <IconLandscape />,
    label: "Tab item",
    content: (
      <div className="p-24">
        <p>Panel 2</p>
      </div>
    ),
  },
  {
    id: "3",
    icon: <IconLandscape />,
    label: "Tab item",
    content: (
      <div className="p-24">
        <p>Panel 3</p>
      </div>
    ),
  },
  {
    id: "4",
    icon: <IconLandscape />,
    label: "Tab item",
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
        id: "1",
        icon: <IconLandscape />,
        label: "Tab item",
        content: (
          <div className="p-24">
            <p>Panel 1</p>
          </div>
        ),
      },
      {
        id: "2",
        icon: <IconLandscape />,
        label: "Tab item",
        content: (
          <div className="p-24">
            <p>Panel 2</p>
          </div>
        ),
      },
      {
        id: "3",
        icon: <IconLandscape />,
        label: "Tab item",
        content: (
          <div className="p-24">
            <p>Panel 3</p>
          </div>
        ),
      },
      {
        id: "4",
        icon: <IconLandscape />,
        label: "Tab item",
        content: (
          <div className="p-24">
            <p>Panel 4</p>
          </div>
        ),
      },
      {
        id: "5",
        icon: <IconLandscape />,
        label: "Tab item",
        content: (
          <div className="p-24">
            <p>Panel 5</p>
          </div>
        ),
      },
      {
        id: "6",
        icon: <IconLandscape />,
        label: "Tab item",
        content: (
          <div className="p-24">
            <p>Panel 6</p>
          </div>
        ),
      },
      {
        id: "7",
        icon: <IconLandscape />,
        label: "Tab item",
        content: (
          <div className="p-24">
            <p>Panel 7</p>
          </div>
        ),
      },
      {
        id: "8",
        icon: <IconLandscape />,
        label: "Tab item",
        content: (
          <div className="p-24">
            <p>Panel 8</p>
          </div>
        ),
      },
      {
        id: "9",
        icon: <IconLandscape />,
        label: "Tab item",
        content: (
          <div className="p-24">
            <p>Panel 9</p>
          </div>
        ),
      },
      {
        id: "10",
        icon: <IconLandscape />,
        label: "Tab item",
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
          "Tabs become horizontally scrollable when the layout is too small and the content starts to overflow.",
      },
    },
  },
};
