import { useState } from 'react';

import { Meta, StoryObj } from '@storybook/react';
import Button from '../../components/Button/Button';
import useClickOutside from './useClickOutside';

const meta: Meta<typeof useClickOutside> = {
  title: 'Hooks/useClickOutside',
};

export default meta;
type Story = StoryObj<typeof useClickOutside>;

export const Example: Story = {
  render: (args) => {
    const [isOpen, setOpen] = useState<boolean>(true);

    const ref = useClickOutside(() => setOpen(false));

    if (isOpen) {
      return (
        <Button ref={ref} type="button" color="primary" variant="filled">
          Click outside of me
        </Button>
      );
    }

    return (
      <Button
        type="button"
        color="secondary"
        variant="filled"
        onClick={() => setOpen(true)}
      >
        Restart
      </Button>
    );
  },
};
