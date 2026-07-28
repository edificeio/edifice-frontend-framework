import { Meta, StoryObj } from '@storybook/react-vite';
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
  parameters: {
    docs: {
      description: {
        component:
          'The `ShareModal` component is the standard sharing dialog: it wraps `ShareResources` in a modal and adds the confirm/cancel actions. It expects `shareOptions` describing the resource (id, current rights, creator id) and calls `onSuccess` once sharing succeeded, `onCancel` when the user backs out. By default the modal performs the share request itself; pass the optional `shareResource` mutation only when the host app needs optimistic UI — it must then be a React Query mutation. The `children` slot lets an app inject its own specific block into the dialog (as the Blog does).',
      },
    },
  },
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
