import { Meta, StoryObj } from "@storybook/react";
import TreeView from "./TreeView";
import { TreeNode } from "./TreeNode";
import { useState } from "react";
import React from "react";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof TreeView> = {
  title: "Components/TreeView",
  component: TreeView,
};

export default meta;

type Story = StoryObj<typeof TreeView>;

const data: TreeNode = {
  id: "root",
  name: "Section Element",
  section: true,
  children: [
    {
      id: "1",
      name: "level 1 arborescence tree",
      children: [
        {
          id: "4",
          name: "level 2 arborescence tree",
          children: [
            {
              id: "8",
              name: "level 3 arborescence tree",
              children: [
                {
                  id: "12",
                  name: "level 4 arborescence tree",
                },
                {
                  id: "13",
                  name: "level 4 arborescence tree",
                },
              ],
            },
            {
              id: "9",
              name: "level 3 arborescence tree",
            },
          ],
        },
        {
          id: "5",
          name: "level 2 arborescence tree",
          children: [
            {
              id: "10",
              name: "level 3 arborescence tree",
            },
            {
              id: "11",
              name: "level 3 arborescence tree",
            },
          ],
        },
      ],
    },
    {
      id: "2",
      name: "level 1 arborescence tree",
      children: [
        {
          id: "6",
          name: "level 2 arborescence tree",
        },
        {
          id: "7",
          name: "level 2 arborescence tree",
        },
      ],
    },
    {
      id: "3",
      name: "level 1 arborescence tree",
    },
  ],
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => {
  const [events, setEvents] = useState<Array<string>>([]);

  const maxEventHistory = 20;

  const setRotativeEvents = (event: string) => {
    if (events.length >= maxEventHistory) {
      setEvents([event]);
      return;
    }
    setEvents([...events, event]);
  };

  const handleTreeItemSelect = (nodeId: string) => {
    setRotativeEvents(`Select / Node = ${nodeId}`);
  };

  const handleTreeItemFold = (nodeId: string) => {
    setRotativeEvents(`Fold / Node = ${nodeId}`);
  };

  const handleTreeItemUnfold = (nodeId: string) => {
    setRotativeEvents(`Unfold / Node = ${nodeId}`);
  };

  const handleTreeItemFocus = (nodeId: string) => {
    setRotativeEvents(`Focus / Node = ${nodeId}`);
  };

  const handleTreeItemBlur = (nodeId: string) => {
    setRotativeEvents(`Blur / Node = ${nodeId}`);
  };

  const treeViewArgs = {
    data,
    onTreeItemSelect: handleTreeItemSelect,
    onTreeItemFold: handleTreeItemFold,
    onTreeItemUnfold: handleTreeItemUnfold,
    onTreeItemFocus: handleTreeItemFocus,
    onTreeItemBlur: handleTreeItemBlur,
  };

  return (
    <>
      <TreeView {...args} {...treeViewArgs} />
      <div
        className="bg-light position-absolute p-8"
        style={{
          top: "8px",
          right: "8px",
          fontSize: "1rem",
        }}
      >
        <span>
          Events history (for debug only/cleared after {maxEventHistory}{" "}
          events):
        </span>
        <ul>
          {events.map((event, index) => (
            <li key={index}>{event}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export const Base: Story = {
  render: Template,
};
