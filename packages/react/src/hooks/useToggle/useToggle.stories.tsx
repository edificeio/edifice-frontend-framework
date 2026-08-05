import Button from '../../components/Button/Button';
import Heading from '../../components/Heading/Heading';
import useToggle from './useToggle';
import { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Hooks/useToggle',
  // A hook has no visual surface of its own: this story is an interactive demo
  // embedded in the MDX guide, not a design system visual to watch for
  // regressions. Excluding it keeps the Chromatic budget for components.
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};

export default meta;
type Story = StoryObj;

export const Example: Story = {
  render: () => {
    const [state, toggle] = useToggle(false);

    return (
      <>
        <Heading level="h1" headingStyle="h3">
          {state.toString()}
        </Heading>
        <Button color="primary" variant="filled" onClick={toggle}>
          Toggle
        </Button>
      </>
    );
  },
};
