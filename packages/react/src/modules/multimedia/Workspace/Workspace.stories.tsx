import { Meta, StoryObj } from "@storybook/react";

import { WorkspaceElement } from "@edifice.io/ts-client";
import { MockedDataProvider } from "../../../providers/MockedDataProvider";
import Workspace from "./Workspace";

const mockedDocuments: WorkspaceElement[] = [
  {
    _id: "folder1",
    name: "level 1 arborescence tree",
    eType: "folder",
    eParent: "",
    _isShared: false,
    _shared: [],
    children: null!,
    created: null as any,
    owner: null as any,
  },
  {
    _id: "folder2",
    name: "level 1 arborescence tree",
    eType: "folder",
    eParent: "",
    _isShared: false,
    _shared: [],
    children: null!,
    created: null as any,
    owner: null as any,
  },
  {
    _id: "file1",
    name: "File 1",
    eType: "file",
    eParent: "",
    _isShared: false,
    _shared: [],
    children: null!,
    created: null as any,
    owner: null as any,
  },
];

const meta: Meta<typeof Workspace> = {
  title: "Modules/Multimedia/Workspace",
  component: Workspace,
  args: {},
};

export default meta;

type Story = StoryObj<typeof Workspace>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Base: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          "The Workspace component allows the user to choose one or more files among all the online files he has access to in the system.",
      },
    },
  },
  render: (args: any) => {
    return (
      <MockedDataProvider
        mocks={{
          workflows: [
            "org.entcore.workspace.controllers.WorkspaceController|listDocuments",
            "org.entcore.workspace.controllers.WorkspaceController|listFolders",
          ],
          workspaceDocuments: mockedDocuments,
        }}
      >
        <Workspace {...args}></Workspace>
      </MockedDataProvider>
    );
  },
};
