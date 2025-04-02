import type { Meta, StoryObj } from '@storybook/react';
import AddAttachmentToWorkspaceModal from './AddAttachmentToWorkspaceModal';
import { Button } from '../../../components/Button';
import { useToggle } from '@uidotdev/usehooks';

const meta: Meta<typeof AddAttachmentToWorkspaceModal> = {
  title: 'Modules/Modals/AddAttachmentToWorkspaceModal',
  component: AddAttachmentToWorkspaceModal,
  decorators: [(Story) => <div style={{ height: '25em' }}>{Story()}</div>],
  args: {
    id: 'modal',
    isOpen: false,
  },
  argTypes: {},
  parameters: {
    docs: {
      description: {
        component: 'Module of Modal to add attachement to workspace.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    id: 'add-attachment-to-workspace-modal',
  },
  render: (args) => {
    const [isOpen, toggle] = useToggle(false);

    function handleOpenModal() {
      toggle(true);
    }

    function handleCloseModal() {
      toggle(false);
    }

    return (
      <div style={{ padding: '2em' }}>
        <Button
          type="button"
          variant="filled"
          color="primary"
          onClick={handleOpenModal}
        >
          Open Modal
        </Button>
        <AddAttachmentToWorkspaceModal
          {...args}
          isOpen={isOpen}
          onCancel={handleCloseModal}
          onSuccess={() => {
            alert('Confirm action');
            toggle(false);
          }}
        />
      </div>
    );
  },
};
