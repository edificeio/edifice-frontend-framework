import { Meta, StoryObj } from '@storybook/react';
import Heading from '../../components/Heading/Heading';
import useTitle from './useTitle';

const meta: Meta<typeof useTitle> = {
  title: 'Hooks/useTitle',
};

export default meta;
type Story = StoryObj<typeof useTitle>;

export const Example: Story = {
  render: (args) => {
    const title = useTitle();

    return (
      <Heading level="h1" headingStyle="h3">
        {title}
      </Heading>
    );
  },
};
