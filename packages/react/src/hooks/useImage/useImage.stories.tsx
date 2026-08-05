import imagePlaceholder from '@edifice.io/bootstrap/dist/images/common/image-placeholder.png';
import { Meta, StoryObj } from '@storybook/react-vite';
import useImage from './useImage';

const meta: Meta<typeof useImage> = {
  title: 'Hooks/useImage',
  // A hook has no visual surface of its own: this story is an interactive demo
  // embedded in the MDX guide, not a design system visual to watch for
  // regressions. Excluding it keeps the Chromatic budget for components.
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};

export default meta;
type Story = StoryObj<typeof useImage>;

export const Example: Story = {
  render: () => {
    const src = '';
    const alt = 'alternative text';
    const placeholder = imagePlaceholder;
    const { imgSrc, onError } = useImage({ src, placeholder });

    return <img alt={alt} onError={onError} src={imgSrc} />;
  },
};
