import { Meta, StoryObj } from '@storybook/react';

import { ButtonSkeleton, ModalSkeleton, TextSkeleton } from '.';
import useToggle from '../../hooks/useToggle/useToggle';
import { Button } from '../Button';
import { Flex } from '../Flex';

const meta: Meta<typeof ModalSkeleton> = {
  title: 'Components/Skeleton/ModalSkeleton',
  component: ModalSkeleton,
  decorators: [(Story) => <div style={{ height: '25em' }}>{Story()}</div>],
  args: {
    viewport: false,
    size: 'md',
  },
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Modal skeleton. Supports different sizes and viewport mode. Includes customizable body and footer.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ModalSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Base: Story = {
  render: (args) => {
    const [isOpen, toggle] = useToggle(false);

    function handleOpenModal() {
      toggle(true);
    }

    return (
      <>
        <Button
          type="button"
          variant="filled"
          color="primary"
          onClick={handleOpenModal}
        >
          Open Modal Skeleton
        </Button>
        {isOpen && <ModalSkeleton {...args} />}
      </>
    );
  },
};

export const FullHeight: Story = {
  ...Base,
  args: {
    size: 'lg',
    viewport: true,
    children: (
      <Flex gap="4" direction="column">
        <TextSkeleton size="lg" />
      </Flex>
    ),
    footer: (
      <>
        <ButtonSkeleton color="tertiary" />
        <ButtonSkeleton color="primary" />
      </>
    ),
  },
};
