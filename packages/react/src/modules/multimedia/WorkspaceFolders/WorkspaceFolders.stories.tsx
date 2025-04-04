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
  args: {
    onFolderSelected: (folderId: string) => {
      console.log('Selected folder ID:', folderId);
    },
  },
  argTypes: {},
  parameters: {
    docs: {
      description: {
        story:
          'The Workspace component listing folders and allowing selection of a folder.',
      },
    },
  },
  render: (args: any) => {
    const handleFolderSelected = (folderId: string) => {
      alert(`Selected folder ID: ${folderId}`);
    };
    return (
      <WorkspaceFolders {...args} onFolderSelected={handleFolderSelected} />
    );
  },
};
