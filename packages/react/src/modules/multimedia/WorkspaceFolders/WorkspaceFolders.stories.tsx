import { Meta, StoryObj } from '@storybook/react';

import Workspace from './WorkspaceFolders';
import WorkspaceFolders from './WorkspaceFolders';

const meta: Meta<typeof Workspace> = {
  title: 'Modules/Multimedia/WorkspaceFolders',
  component: WorkspaceFolders,
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
