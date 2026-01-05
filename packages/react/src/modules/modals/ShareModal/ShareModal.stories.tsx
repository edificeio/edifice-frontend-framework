import { Meta, StoryObj } from '@storybook/react';
import { ShareModal } from '.';
import { ShareOptions } from './ShareResources';

// Mock data for props
const mockShareOptions: ShareOptions = {
  resourceId: 'resource-1',
  resourceRights: [],
  resourceCreatorId: 'user-1',
};

const meta: Meta<typeof ShareModal> = {
  title: 'Modules/Modals/ShareModal',
  component: ShareModal,
};

export default meta;

type Story = StoryObj<typeof ShareModal>;

export const Default: Story = {
  globals: {
    app: 'actualites',
  },
  args: {
    shareOptions: mockShareOptions,
    onSuccess: () => alert('Shared!'),
  },
  render: (args) => <ShareModal {...args} isOpen={true} />,
};
