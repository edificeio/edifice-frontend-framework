import { Meta, StoryObj } from '@storybook/react';
import Button from '../../components/Button/Button';
import useScrollToTop from './useScrollToTop';

const meta: Meta<typeof useScrollToTop> = {
  title: 'Hooks/useScrollToTop',
};

export default meta;
type Story = StoryObj<typeof useScrollToTop>;

export const Example: Story = {
  render: (args) => {
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
