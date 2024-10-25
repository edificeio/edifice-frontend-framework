import { Meta, StoryObj } from "@storybook/react";

import { MockedDataProvider } from "../../utils";
import { APP, IResource, WorkspaceElement } from "edifice-ts-client";
import InternalLinker from "./InternalLinker";
import { OdeClientProvider } from "../../core";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const mockedDocuments: WorkspaceElement[] = [];

const meta: Meta<typeof InternalLinker> = {
  title: "Multimedia/InternalLinker",
  component: InternalLinker,
  args: {},
};

export default meta;

type Story = StoryObj<typeof InternalLinker>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Base: Story = {
  parameters: {
    docs: {
      description: {
        story: "",
      },
    },
  },
  render: (args: any) => {
    return (
      <MockedDataProvider
        mocks={{
          appResources: {
            timelinegenerator: [
              {
                application: "timelinegenerator",
                modifiedAt: "2023-10-23T00:00:00.000Z",
                name: "A fake timelinegenerator",
                modifierId: "major",
                modifierName: "Motoko",
                thumbnail: "",
              } as IResource,
              {
                application: "timelinegenerator",
                modifiedAt: "2023-10-23T01:00:00.000Z",
                name: "Another fake timelinegenerator with a very long name that should now overflow aloooooot, don't you think ?",
                modifierId: "sarge",
                modifierName: "Batou",
                thumbnail: "",
              } as IResource,
              {
                application: "timelinegenerator",
                modifiedAt: "2023-10-23T02:00:00.000Z",
                name: "A real timelinegenerator ?",
                modifierId: "newbie",
                modifierName: "Togusa",
                thumbnail: "",
              } as IResource,
            ],
          },
          workflows: [
            "org.entcore.workspace.controllers.WorkspaceController|listDocuments",
            "org.entcore.workspace.controllers.WorkspaceController|listFolders",
          ],
          workspaceDocuments: mockedDocuments,
        }}
      >
        <QueryClientProvider client={null as unknown as QueryClient}>
          <OdeClientProvider params={{ app: "timelinegenerator" }}>
            <InternalLinker {...args}></InternalLinker>
          </OdeClientProvider>
        </QueryClientProvider>
      </MockedDataProvider>
    );
  },
};
