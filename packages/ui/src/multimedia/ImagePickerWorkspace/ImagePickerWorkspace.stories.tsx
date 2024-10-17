import { Meta, StoryObj } from '@storybook/react';

import ImagePickerWorkspace, {
  ImagePickerWorkspaceProps,
} from './ImagePickerWorkspace';
import { MediaLibrary } from '..';
import { useMediaLibrary, useOdeClient } from '../../core';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof ImagePickerWorkspace> = {
  title: 'Forms/ImagePickerWorkspace',
  component: ImagePickerWorkspace,
  parameters: {
    docs: {
      description: {
        component:
          'The ImagePickerWorkspace allows users to upload images from the bbm. Its default behavior shows the Avatar component. If the image should be read-only, please use the Avatar Component.',
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
type Story = StoryObj<typeof ImagePickerWorkspace>;

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
          'When an `src` prop is provided, the ImagePickerWorkspace renders it as an image. The image can be deleted by clicking the delete button. When you click the Add button, the image will be replaced with the uploaded image.',
      },
    },
  },
};

export const UploadImageWithCallbacks: Story = {
  render: (args: ImagePickerWorkspaceProps) => {
    const { appCode } = useOdeClient();
    const {
      ref: mediaLibraryRef,
      libraryMedia,
      ...mediaLibraryHandlers
    } = useMediaLibrary();
    function handleUploadImage(obj: any) {
      console.log(`Uploading image ${JSON.stringify(obj)}`);
    }
    function handleDeleteImage() {
      console.log('Image deleted');
    }
    return (
      <>
        <ImagePickerWorkspace
          {...args}
          onUploadImage={handleUploadImage}
          onDeleteImage={handleDeleteImage}
          libraryMedia={libraryMedia}
          mediaLibraryRef={mediaLibraryRef}
        />
        <MediaLibrary
          appCode={appCode}
          ref={mediaLibraryRef}
          multiple={false}
          visibility="protected"
          {...mediaLibraryHandlers}
        />
      </>
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
