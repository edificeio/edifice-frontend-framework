import { Meta, StoryObj } from "@storybook/react";
import useImage from "./useImage";

const meta: Meta<typeof useImage> = {
  title: "Hooks/useImage",
};

export default meta;
type Story = StoryObj<typeof useImage>;

const base = import.meta.env.BASE_URL;

export const Example: Story = {
  render: (args) => {
    const src = "";
    const alt = "alternative text";
    const placeholder = `${base}assets/themes/edifice-bootstrap/images/common/image-placeholder.png`;
    const { imgSrc, onError } = useImage({ src, placeholder });

    return <img alt={alt} onError={onError} src={imgSrc} />;
  },
};
