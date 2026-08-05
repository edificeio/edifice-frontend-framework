import { Meta, StoryObj } from '@storybook/react-vite';
import Button from '../../components/Button/Button';
import useScrollToTop from './useScrollToTop';

const meta: Meta<typeof useScrollToTop> = {
  title: 'Hooks/useScrollToTop',
  // A hook has no visual surface of its own: this story is an interactive demo
  // embedded in the MDX guide, not a design system visual to watch for
  // regressions. Excluding it keeps the Chromatic budget for components.
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};

export default meta;
type Story = StoryObj<typeof useScrollToTop>;

export const Example: Story = {
  render: () => {
    const scrollTotop = useScrollToTop();
    return (
      <>
        <Button color="primary" variant="filled" onClick={scrollTotop}>
          Go to Top
        </Button>
        <div style={{ height: 300 }}></div>
      </>
    );
  },
};
