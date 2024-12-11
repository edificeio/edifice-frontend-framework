import { Meta, StoryObj } from '@storybook/react';

import { MediaLibrary } from '..';
import { useMediaLibrary } from '../../../hooks';
import { useEdificeClient } from '../../../providers/EdificeClientProvider/EdificeClientProvider.hook';
import ImagePicker, { ImagePickerProps } from './ImagePicker';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof ImagePicker> = {
  title: 'Modules/Multimedia/ImagePicker',
  component: ImagePicker,
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
          'When the `appCode` prop is provided, the ImagePickerWorkspace displays the corresponding app icon as a placeholder.',
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
          'When the `src` prop is provided, the ImagePickerWorkspace displays the image. You can delete the image by clicking the delete button. Clicking the Add button will replace the current image with a new uploaded image.',
      },
    },
  },
};

export const UploadImageWithCallbacks: Story = {
  render: (args: ImagePickerProps) => {
    const { appCode } = useEdificeClient();
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
        <ImagePicker
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
          'The `onUploadImage` and `onDeleteImage` props are required to manage the callbacks for image upload and deletion events.',
      },
    },
  },
};
