import { Meta, StoryObj } from '@storybook/react-vite';

import Workspace from './WorkspaceFolders';
import WorkspaceFolders from './WorkspaceFolders';

const meta: Meta<typeof Workspace> = {
  title: 'Modules/Multimedia/WorkspaceFolders',
  component: WorkspaceFolders,
  parameters: {
    docs: {
      description: {
        component:
          'The `WorkspaceFolders` component displays the workspace folder tree — personal folders and shared folders — with a search field and the ability to create a folder. It is the destination picker used when copying a document into the workspace. Each selection triggers `onFolderSelected` with the folder id **and** a `canCopyFileInto` flag, since the user may browse a shared folder without holding write access to it: the caller must honour that flag before enabling its own confirm action. Folders are fetched by the component itself through `useWorkspaceFolders`.',
      },
    },
  },
  args: {},
};

export default meta;

type Story = StoryObj<typeof Workspace>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Base: Story = {
  args: {},
  argTypes: {},
  parameters: {
    docs: {
      description: {
        story:
          'The Workspace component displays a list of folders and allows users to select one.',
      },
    },
  },
  render: (args: any) => {
    const handleFolderSelected = (
      folderId: string,
      canCopyFileInto: boolean,
    ) => {
      console.log(
        `Selected folderId: '${folderId}' and canCopyFileInto: ${canCopyFileInto}`,
      );
    };
    return (
      <WorkspaceFolders {...args} onFolderSelected={handleFolderSelected} />
    );
  },
};
