import type { Meta, StoryObj } from '@storybook/react-vite';

import ImageEditor from './components/ImageEditor';
import { Button } from '../../../components';
import { useToggle } from '../../../hooks';

const SAMPLE_IMAGE = 'https://picsum.photos/seed/edifice/800/600';

const meta: Meta<typeof ImageEditor> = {
  title: 'Modules/Multimedia/ImageEditor',
  component: ImageEditor,
  decorators: [(Story) => <div style={{ height: '25em' }}>{Story()}</div>],
  parameters: {
    docs: {
      description: {
        component:
          'Canvas-based image editor powered by PIXI.js. Supports rotating, cropping, blurring and resizing images inside a modal.',
      },
    },
  },
  argTypes: {
    image: {
      control: 'text',
      description: 'URL of the image to edit',
    },
    isOpen: {
      control: 'boolean',
      description: 'Controls modal visibility',
    },
    legend: {
      control: 'text',
      description: 'Initial legend (title) text for the image',
    },
    altText: {
      control: 'text',
      description: 'Initial alternative text for accessibility',
    },
    onSave: {
      action: 'save',
      description:
        'Callback when save is clicked. Receives { blob, legend, altText }',
    },
    onCancel: {
      action: 'cancel',
      description: 'Callback when the modal is closed without saving',
    },
    onError: {
      action: 'error',
      description: 'Callback when the save action fails',
    },
  },
  args: {
    image: SAMPLE_IMAGE,
    legend: '',
    altText: '',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default example: click the button to open the editor.
 * Use the toolbar to rotate, crop, blur or resize the image, then save.
 */
export const Base: Story = {
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
          Open Image Editor
        </Button>
        <ImageEditor
          {...args}
          isOpen={isOpen}
          onCancel={handleCloseModal}
          onSave={async ({ blob, legend, altText }) => {
            console.log('Saved', { blob, legend, altText });
            alert(
              `Image saved — ${blob.size} bytes, legend: "${legend}", alt: "${altText}"`,
            );
            toggle(false);
          }}
        />
      </div>
    );
  },
};

/**
 * Editor pre-filled with legend and alt text.
 * Useful to test the update flow where metadata already exists.
 */
export const WithMetadata: Story = {
  args: {
    legend: 'A beautiful landscape',
    altText: 'Mountains under a blue sky',
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
          Open Image Editor
        </Button>
        <ImageEditor
          {...args}
          isOpen={isOpen}
          onCancel={handleCloseModal}
          onSave={async ({ blob, legend, altText }) => {
            console.log('Saved', { blob, legend, altText });
            alert(
              `Image saved — ${blob.size} bytes, legend: "${legend}", alt: "${altText}"`,
            );
            toggle(false);
          }}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Editor opens with pre-filled legend and alt text, simulating an update scenario.',
      },
    },
  },
};

/**
 * Example with error handling callback.
 * Open the console to see error logs when the save action fails.
 */
export const WithErrorHandler: Story = {
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
          Open Image Editor
        </Button>
        <ImageEditor
          {...args}
          isOpen={isOpen}
          onCancel={handleCloseModal}
          onSave={async ({ blob, legend, altText }) => {
            console.log('Saved', { blob, legend, altText });
            toggle(false);
          }}
          onError={(err) => {
            console.error('ImageEditor error:', err);
            alert(`Error: ${err}`);
          }}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the onError callback. Errors during save will trigger an alert and a console log.',
      },
    },
  },
};
