import { Meta, StoryObj } from '@storybook/react-vite';
import Heading from '../../components/Heading/Heading';
import useTitle from './useTitle';

const meta: Meta<typeof useTitle> = {
  title: 'Hooks/useTitle',
  // A hook has no visual surface of its own: this story is an interactive demo
  // embedded in the MDX guide, not a design system visual to watch for
  // regressions. Excluding it keeps the Chromatic budget for components.
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};

export default meta;
type Story = StoryObj<typeof useTitle>;

export const Example: Story = {
  render: () => {
    const title = useTitle();

    return (
      <Heading level="h1" headingStyle="h3">
        {title}
      </Heading>
    );
  },
};
