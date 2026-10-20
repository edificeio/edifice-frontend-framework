import { useState } from 'react';

import { Meta, StoryObj } from '@storybook/react-vite';

import hillsBackground from '@edifice.io/bootstrap/dist/images/backgrounds/hills.svg';

import {
  IconCopy,
  IconEdit,
  IconPrint,
  IconShare,
} from '../../modules/icons/components';
import { Button } from '../Button';
import {
  Popover,
  PopoverBody,
  PopoverFooter,
  PopoverHeader,
  PopoverProps,
} from './Popover';

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  subcomponents: { PopoverHeader, PopoverBody, PopoverFooter },
  parameters: {
    docs: {
      description: {
        component:
          'Popover component displays floating content below a trigger element. It is positioned absolutely, so its parent must be `position-relative`. It can be composed with `PopoverHeader`, `PopoverBody` and `PopoverFooter`.',
      },
    },
  },
  argTypes: {
    align: {
      control: 'radio',
      options: ['center', 'end'],
    },
    isVisible: {
      control: 'boolean',
    },
  },
  args: {
    id: 'popover',
    isVisible: true,
    align: 'center',
    className: 'bg-white',
  },
  decorators: [
    (Story) => (
      <div
        className="d-flex justify-content-center align-items-start"
        style={{
          minHeight: 400,
          padding: '2rem',
          backgroundImage: `url(${hillsBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Popover>;

const Template = (args: PopoverProps) => (
  <div className="position-relative">
    <Button type="button" variant="filled" color="primary">
      Trigger
    </Button>
    <Popover {...args} />
  </div>
);

export const Base: Story = {
  render: Template,

  args: {
    children: (
      <>
        <PopoverHeader>Actions</PopoverHeader>
        <PopoverBody>
          <ul className="list-unstyled d-flex flex-column gap-8 m-0">
            {[
              { icon: <IconEdit />, label: 'Edit' },
              { icon: <IconCopy />, label: 'Duplicate' },
              { icon: <IconShare />, label: 'Share' },
              { icon: <IconPrint />, label: 'Print' },
            ].map(({ icon, label }) => (
              <li key={label}>
                <Button
                  type="button"
                  variant="ghost"
                  color="tertiary"
                  size="sm"
                  leftIcon={icon}
                >
                  {label}
                </Button>
              </li>
            ))}
          </ul>
        </PopoverBody>
      </>
    ),
  },
};

export const WithHeaderAndFooter: Story = {
  render: Template,

  args: {
    children: (
      <>
        <PopoverHeader>Popover title</PopoverHeader>
        <PopoverBody>
          Optio minus varius reprehenderit ridiculus praesentium metus porttitor
          tellus.
        </PopoverBody>
        <PopoverFooter className="d-flex justify-content-end">
          <Button type="button" variant="ghost" color="tertiary" size="sm">
            Cancel
          </Button>
          <Button type="button" color="primary" size="sm">
            Confirm
          </Button>
        </PopoverFooter>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use `PopoverHeader`, `PopoverBody` and `PopoverFooter` to structure the content.',
      },
    },
  },
};

export const AlignEnd: Story = {
  render: (args) => (
    <div className="d-flex justify-content-end w-100">
      <Template {...args} />
    </div>
  ),

  args: {
    align: 'end',
    children: (
      <PopoverBody>
        Aligned with the right edge of the trigger to avoid overflowing the
        viewport.
      </PopoverBody>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          '`align="end"` aligns the popover\'s right edge with the trigger\'s right edge. Useful when the trigger sits near the right edge of the viewport.',
      },
    },
  },
};

export const Toggle: Story = {
  render: (args) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
      <div className="position-relative">
        <Button
          type="button"
          variant="filled"
          color="primary"
          aria-expanded={isVisible}
          aria-controls={args.id}
          onClick={() => setIsVisible((prev) => !prev)}
        >
          {isVisible ? 'Hide popover' : 'Show popover'}
        </Button>
        <Popover {...args} isVisible={isVisible} />
      </div>
    );
  },

  args: {
    children: (
      <PopoverBody>Click the button again to close the popover.</PopoverBody>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Visibility is controlled by the parent through the `isVisible` prop.',
      },
    },
  },
};
