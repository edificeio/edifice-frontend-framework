import type { Meta, StoryObj } from '@storybook/react';
import ConfirmModal from './ConfirmModal';
import { Button } from '../../../components/Button';
import { useToggle } from '@uidotdev/usehooks';

const meta: Meta<typeof ConfirmModal> = {
  title: 'Modules/Modals/ConfirmModal',
  component: ConfirmModal,
  decorators: [(Story) => <div style={{ height: '25em' }}>{Story()}</div>],
  args: {
    id: 'modal',
    isOpen: false,
    okText: 'Confirm button',
    header: 'Confirm Action',
    body: 'Are you sure?',
  },
  argTypes: {
    body: {
      control: {
        type: 'text',
      },
    },
    header: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Module of Comfirm Modal to proceed an action on CTA button.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    id: 'confirm-modal',
    header: <>Title of confirm modal</>,
    body: (
      <p>
        Are you <strong>sure</strong>?
      </p>
    ),
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
          Open Confirm Modal
        </Button>
        <ConfirmModal
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
