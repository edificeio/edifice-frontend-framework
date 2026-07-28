import { Meta, StoryObj } from '@storybook/react-vite';
import Button from '../../components/Button/Button';
import useHover from './useHover';

const meta: Meta<typeof useHover> = {
  title: 'Hooks/useHover',
  // A hook has no visual surface of its own: this story is an interactive demo
  // embedded in the MDX guide, not a design system visual to watch for
  // regressions. Excluding it keeps the Chromatic budget for components.
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};

export default meta;
type Story = StoryObj<typeof useHover>;

export const Example: Story = {
  render: () => {
    const [ref, isHovered] = useHover<HTMLButtonElement>();
    return (
      <>
        <Button ref={ref}>Hover Me!</Button>
        <div>{isHovered ? '😀' : '😭'}</div>
      </>
    );
  },
};
