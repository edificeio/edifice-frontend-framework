import { Meta, StoryObj } from "@storybook/react";

import ImagePicker, { ImagePickerProps } from "./ImagePicker";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof ImagePicker> = {
  title: "Forms/ImagePicker",
  component: ImagePicker,
  parameters: {
    docs: {
      description: {
        component:
          "The `ImagePicker` component provides a user interface for uploading and managing images. It includes an upload button, preview area, and delete functionality. The component is commonly used in forms and content editors where image selection is needed. Features include:\n\n- Image upload button with customizable label\n- Image preview display\n- Delete button for removing selected images\n- Optional app-specific placeholder images\n- Built-in disabled states",
      },
    },
  },
  args: {
    app: {
      address: "/blog",
      icon: "blog-large",
      name: "Blog",
      scope: [],
      display: false,
      displayName: "",
      isExternal: false,
    },
    label: "Upload an image",
    addButtonLabel: "Add image",
    deleteButtonLabel: "Delete image",
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
        story: "When no image is uploaded, the delete button is disabled.",
      },
    },
  },
};

export const AppPlaceholder: Story = {
  args: {
    appCode: "blog",
  },

  parameters: {
    docs: {
      description: {
        story:
          "When an `appCode` prop is provided with the code of an application, the ImagePicker will show app icon as a placeholder.",
      },
    },
  },
};

export const ImageURL: Story = {
  args: {
    src: "https://imgur.com/wZt78Lv.png",
  },

  parameters: {
    docs: {
      description: {
        story:
          "When an `src` prop is provided, the ImagePicker renders it as an image. The image can be deleted by clicking the delete button. When you click the Add button, the image will be replaced with the uploaded image.",
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
      console.log("Image deleted");
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
          "The `onUploadImage` and `onClearImage` props are needed to handle callbacks when the image is uploaded or deleted.",
      },
    },
  },
};
