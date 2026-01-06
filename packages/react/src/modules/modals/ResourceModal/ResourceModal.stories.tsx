import { Meta, StoryObj } from '@storybook/react';

import { ResourceModal } from './ResourceModal';
import { Button, FormControl } from '../../../components';
import { useToggle } from '../../../hooks';

const meta: Meta<typeof ResourceModal> = {
  title: 'Modules/ResourceModal',
  component: ResourceModal,
  decorators: [(Story) => <div style={{ height: '25em' }}>{Story()}</div>],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Modal component for creating and editing resources across different Edifice applications.',
      },
    },
  },
  argTypes: {
    mode: {
      control: 'radio',
      options: ['create', 'update'],
      description: 'Mode of operation (create new resource or update existing)',
    },
    appCode: {
      control: 'text',
      description: 'Override default application code from context',
    },
    isOpen: {
      control: 'boolean',
      description: 'Controls modal visibility',
    },
    inputMaxLength: {
      control: { type: 'number', min: 10, max: 200 },
      description: 'Maximum length for title input field',
    },
    textareaMaxLength: {
      control: { type: 'number', min: 10, max: 1000 },
      description: 'Maximum length for description textarea',
    },
    onSuccess: {
      action: 'success',
      description: 'Callback when resource is successfully created or updated',
    },
    onCancel: {
      action: 'cancel',
      description: 'Callback when resource creation/update is cancelled',
    },
    currentFolder: {
      description: 'Target folder for resource creation (create mode only)',
    },
    resourceId: {
      description: 'ID of resource to update (update mode only)',
    },
    children: {
      description: 'Additional content to display in the modal',
    },
    translations: {
      description: 'Custom translations to override defaults',
    },
  },
  args: {
    isOpen: true,
    inputMaxLength: 60,
    textareaMaxLength: 400,
    onSuccess: () => alert('Resource created/updated successfully'),
    onCancel: () => alert('Resource creation/update cancelled'),
  },
};

export default meta;
type Story = StoryObj<typeof ResourceModal>;

/**
 * Default example for creating a new resource
 */
export const Create: Story = {
  args: {
    mode: 'create',
    currentFolder: { id: 'default' },
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
          Open Resource Modal
        </Button>
        {isOpen && (
          <ResourceModal
            {...args}
            isOpen={isOpen}
            onCancel={handleCloseModal}
          />
        )}
      </div>
    );
  },
};

/**
 * Example with custom contribution toggle
 */
export const CreateWithContribution: Story = {
  args: {
    mode: 'create',
    currentFolder: { id: 'default' },
    children: (
      <div className="border-top p-16 mt-16">
        <FormControl id="contribution" className="form-switch d-flex gap-8">
          <FormControl.Input
            type="checkbox"
            role="switch"
            className="form-check-input mt-0"
            size="md"
            onChange={(e) => console.log('Contribution:', e.target.checked)}
          />
          <FormControl.Label className="form-check-label mb-0">
            Allow contribution from community
          </FormControl.Label>
        </FormControl>
      </div>
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
          Open Resource Modal
        </Button>
        {isOpen && (
          <ResourceModal
            {...args}
            isOpen={isOpen}
            onCancel={handleCloseModal}
          />
        )}
      </div>
    );
  },
};

/**
 * Example with custom application code
 */
export const CreateWithCustomApp: Story = {
  args: {
    mode: 'create',
    appCode: 'blog',
    currentFolder: { id: 'default' },
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
          Open Resource Modal
        </Button>
        {isOpen && (
          <ResourceModal
            {...args}
            isOpen={isOpen}
            onCancel={handleCloseModal}
          />
        )}
      </div>
    );
  },
};

/**
 * Example with custom translations
 */
export const CreateWithCustomTranslations: Story = {
  args: {
    mode: 'create',
    currentFolder: { id: 'default' },
    translations: {
      title: 'Custom Title',
      description: 'Custom Description',
      header: {
        create: 'Create New Custom Resource',
      },
      create: 'Create Custom',
    },
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
          Open Resource Modal
        </Button>
        {isOpen && (
          <ResourceModal
            {...args}
            isOpen={isOpen}
            onCancel={handleCloseModal}
          />
        )}
      </div>
    );
  },
};

/**
 * Example showing a resource update scenario
 * Note: This would require a mock for useResource
 */
export const Update: Story = {
  args: {
    mode: 'update',
    resourceId: 'mock-resource-id',
  },
  parameters: {
    docs: {
      description: {
        story:
          'For actual implementation, this would require a valid resource ID and proper mocking of the resource API',
      },
    },
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
          Open Resource Modal
        </Button>
        {isOpen && (
          <ResourceModal
            {...args}
            isOpen={isOpen}
            onCancel={handleCloseModal}
          />
        )}
      </div>
    );
  },
};
