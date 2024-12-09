import { Meta, StoryObj } from '@storybook/react';

import { UploadCard } from '../../modules/multimedia/UploadCard';
import Dropzone from './Dropzone';
import { useDropzoneContext } from './DropzoneContext';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Dropzone> = {
  title: 'Components/Dropzone',
  component: Dropzone,
  args: {
    accept: [],
    multiple: true,
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `Dropzone` component provides a drag-and-drop interface for file uploads. It handles file selection through both drag-and-drop and click-to-browse interactions. Key features include:\n\n- Support for single or multiple file uploads\n- Customizable file type restrictions\n- Drag overlay visual feedback\n- Flexible children rendering for custom upload UI\n- File validation and error handling\n- Accessible keyboard interactions',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dropzone>;

const DropzoneFiles = () => {
  const { files } = useDropzoneContext();

  return (
    <div>
      {files.map((file) => (
        <UploadCard
          key={file.name}
          item={{
            src: '',
            name: file.name,
          }}
        />
      ))}
    </div>
  );
};

export const Base: Story = {
  render: (args) => {
    return (
      <Dropzone {...args}>
        <DropzoneFiles />
      </Dropzone>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'The Dropzone component accepts a custom component as children to handle the UI rendering of uploaded files. In this example, we pass `DropzoneFiles` which displays the list of files using UploadCard components. This pattern allows for flexible customization of how files are displayed while the Dropzone handles the drag-and-drop functionality.',
      },
    },
  },
};

export const DropzoneDragOverlay: Story = {
  render: (args) => {
    return (
      <Dropzone {...args} handle className="is-dragging">
        <DropzoneFiles />
      </Dropzone>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'To manually display the file drop screen, pass `handle` prop and add the `is-dragging` class to the Dropzone component.',
      },
    },
  },
};

export const SingleFile: Story = {
  render: (args) => {
    return (
      <Dropzone {...args} multiple={false}>
        <DropzoneFiles />
      </Dropzone>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'By default, Dropzone allows to add multiple files. If you want to disable this behaviour, add `multilple={false}`',
      },
    },
  },
};
