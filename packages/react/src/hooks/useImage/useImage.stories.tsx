import imagePlaceholder from '@edifice.io/bootstrap/dist/images/common/image-placeholder.png';
import { Meta, StoryObj } from '@storybook/react';
import useImage from './useImage';

const meta: Meta<typeof useImage> = {
  title: 'Hooks/useImage',
};

export default meta;
type Story = StoryObj<typeof useImage>;

export const Example: Story = {
  render: (args) => {
    const src = '';
    const alt = 'alternative text';
    const placeholder = imagePlaceholder;
    const { imgSrc, onError } = useImage({ src, placeholder });

    return <img alt={alt} onError={onError} src={imgSrc} />;
  },
};
