import { Meta, StoryObj } from '@storybook/react';
import { useId } from 'react';

import { Button } from '../Button';
import { PopoverBody, PopoverFooter, PopoverHeader, Popover } from './Popover';
import Avatar from '../Avatar/Avatar';
import useHover from '../../hooks/useHover/useHover';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  args: {
    id: 'popover',
    isVisible: false,
    className: '',
  },
  parameters: {
    docs: {
      description: {
        component: 'Popover Component',
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          height: '200px',
          display: 'grid',
          placeItems: 'center',
          marginBottom: '10em',
        }}
        className="position-relative"
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Base: Story = {
  render: (args) => {
    const [popoverRef, isPopoverHovered] = useHover<HTMLButtonElement>();
    return (
      <div className="position-relative">
        <Button
          ref={popoverRef}
          aria-haspopup="true"
          aria-expanded={isPopoverHovered}
        >
          Hover me!
        </Button>
        <Popover {...args} isVisible={isPopoverHovered}>
          <PopoverHeader>
            <p>Header</p>
          </PopoverHeader>
          <PopoverBody>
            <p>Body</p>
          </PopoverBody>
          <PopoverFooter className="border-top border-ghost">
            <p>Footer</p>
          </PopoverFooter>
        </Popover>
      </div>
    );
  },
};

export const PopoverWithCustomContent: Story = {
  render: (args) => {
    const [popoverRef, isPopoverHovered] = useHover<HTMLButtonElement>();
    return (
      <div className="position-relative">
        <Button
          ref={popoverRef}
          aria-haspopup="true"
          aria-expanded={isPopoverHovered}
        >
          Hover me!
        </Button>
        <Popover
          {...args}
          isVisible={isPopoverHovered}
          className="d-flex align-items-center justify-content-center p-16"
        >
          <Avatar
            src="https://i.pravatar.cc/300"
            size="md"
            variant="circle"
            alt="alternative text"
          />
        </Popover>
      </div>
    );
  },
};
