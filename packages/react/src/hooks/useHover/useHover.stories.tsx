import { Meta, StoryObj } from '@storybook/react';
import Button from '../../components/Button/Button';
import useHover from './useHover';

const meta: Meta<typeof useHover> = {
  title: 'Hooks/useHover',
};

export default meta;
type Story = StoryObj<typeof useHover>;

export const Example: Story = {
  render: (args) => {
    const [ref, isHovered] = useHover<HTMLButtonElement>();
    return (
      <>
        <Button ref={ref}>Hover Me!</Button>
        <div>{isHovered ? '😀' : '😭'}</div>
      </>
    );
  },
};
