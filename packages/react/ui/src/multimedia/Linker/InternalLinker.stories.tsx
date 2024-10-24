import { Meta, StoryObj } from "@storybook/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { IResource, WorkspaceElement } from "edifice-ts-client";
import { OdeClientProvider } from "../../core";
import { MockedDataProvider } from "../../utils";
import InternalLinker from "./InternalLinker";

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

export const WikiExample: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Example of InternalLinker with wikis provided by the wiki app and applications list hidden",
      },
    },
  },
  render: (args: any) => {
    const mockedWikis = [
      {
        application: "wiki",
        modifiedAt: "2023-10-23T00:00:00.000Z",
        name: "Wiki of the creator",
        modifierId: "user1",
        modifierName: "Alice",
        thumbnail: "",
        rights: ["creator:user1", "user:user2:read"],
      } as IResource,
      {
        application: "wiki",
        modifiedAt: "2023-10-23T01:00:00.000Z",
        name: "Wiki with contribution rights",
        modifierId: "user2",
        modifierName: "Bob",
        thumbnail: "",
        rights: ["user:user1:contrib", "group:group1:read"],
      } as IResource,
      {
        application: "wiki",
        modifiedAt: "2023-10-23T02:00:00.000Z",
        name: "Wiki with management rights",
        modifierId: "user3",
        modifierName: "Charlie",
        thumbnail: "",
        rights: ["user:user1:manager", "group:group2:contrib"],
      } as IResource,
      {
        application: "wiki",
        modifiedAt: "2023-10-23T03:00:00.000Z",
        name: "Wiki with group rights",
        modifierId: "user4",
        modifierName: "David",
        thumbnail: "",
        rights: ["group:group1:manager", "user:user3:read"],
      } as IResource,
    ];

    return (
      <MockedDataProvider
        mocks={{
          workflows: [
            "net.atos.wiki.controllers.WikiController|listWikis",
            "net.atos.wiki.controllers.WikiController|createWiki",
          ],
        }}
      >
        <QueryClientProvider client={null as unknown as QueryClient}>
          <OdeClientProvider params={{ app: "wiki" }}>
            <InternalLinker
              {...args}
              resourceList={mockedWikis}
              defaultAppCode="wiki"
              showApplicationSelector={false}
              applicationList={[{ application: "wiki", label: "Wiki" }]}
            ></InternalLinker>
          </OdeClientProvider>
        </QueryClientProvider>
      </MockedDataProvider>
    );
  },
};
