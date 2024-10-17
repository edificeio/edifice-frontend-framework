import { Meta, StoryObj } from '@storybook/react';

import { ImagePicker, ImagePickerProps } from './ImagePicker';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof ImagePicker> = {
  title: 'Forms/ImagePicker',
  component: ImagePicker,
  parameters: {
    docs: {
      description: {
        component:
          'The ImagePicker allows users to upload images. Its default behavior shows the Avatar component. If the image should be read-only, please use the Avatar Component.',
      },
    },
  },
  args: {
    app: {
      address: '/blog',
      icon: 'blog-large',
      name: 'Blog',
      scope: [],
      display: false,
      displayName: '',
      isExternal: false,
    },
    label: 'Upload an image',
    addButtonLabel: 'Add image',
    deleteButtonLabel: 'Delete image',
    onUploadImage: () => {},
    onDeleteImage: () => {},
  },
  argTypes: {
    onUploadImage: {
      control: {
        type: null,
      },
    },
    onDeleteImage: {
      control: {
        type: null,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ImagePicker>;

export const Base: Story = {};

export const DisabledButton: Story = {
  parameters: {
    docs: {
      description: {
        story: 'When no image is uploaded, the delete button is disabled.',
      },
    },
  },
};

export const AppPlaceholder: Story = {
  args: {
    appCode: 'blog',
  },

  parameters: {
    docs: {
      description: {
        story:
          'When an `appCode` prop is provided with the code of an application, the ImagePicker will show app icon as a placeholder.',
      },
    },
  },
};

export const ImageURL: Story = {
  args: {
    src: 'https://imgur.com/wZt78Lv.png',
  },

  parameters: {
    docs: {
      description: {
        story:
          'When an `src` prop is provided, the ImagePicker renders it as an image. The image can be deleted by clicking the delete button. When you click the Add button, the image will be replaced with the uploaded image.',
      },
    },
  },
};

export const UploadImageWithCallbacks: Story = {
  render: (args: ImagePickerProps) => {
    function handleUploadImage(obj: any) {
      console.log(`Uploading image ${JSON.stringify(obj)}`);
    }
    function handleDeleteImage() {
      console.log('Image deleted');
    }
    return (
      <ImagePicker
        {...args}
        onUploadImage={handleUploadImage}
        onDeleteImage={handleDeleteImage}
      />
    );
  },

  parameters: {
    docs: {
      description: {
        story:
          'The `onUploadImage` and `onClearImage` props are needed to handle callbacks when the image is uploaded or deleted.',
      },
    },
  },
};
