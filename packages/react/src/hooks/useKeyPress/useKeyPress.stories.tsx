import useKeyPress from './useKeyPress';
// @ts-ignore
import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Button from '../../components/Button/Button';

const meta: Meta<typeof useKeyPress> = {
  title: 'Hooks/useKeyPress',
};

export default meta;
type Story = StoryObj<typeof useKeyPress>;

export const Example: Story = {
  render: (args) => {
    const [isVisible, setIsVisible] = useState<boolean>(true);
    useKeyPress(() => {
      setIsVisible(false);
    }, ['Escape']);

    return (
      <div>
        {isVisible ? (
          <Button type="button" color="primary" variant="filled">
            Press the Escape key to hide me
          </Button>
        ) : (
          <p className="body">You hide the button with the Escape Key</p>
        )}
      </div>
    );
  },
};
