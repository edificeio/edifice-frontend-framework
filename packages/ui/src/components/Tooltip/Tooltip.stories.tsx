import { Meta, StoryObj } from '@storybook/react';

import { AlertCircle } from '../../../../icons/dist';
import { Button } from '../Button';
import Tooltip, { TooltipProps } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component:
          'Wrapper component to show a contextual description on hover',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args: TooltipProps) => {
  return (
    <>
      <Tooltip {...args} />
    </>
  );
};

export const Base: Story = {
  render: Template,

  args: {
    message:
      'Optio minus varius reprehenderit ridiculus praesentium metus porttitor tellus.',
    children: (
      <>
        <Button type="button" variant="filled" color="primary">
          Default tooltip
        </Button>
      </>
    ),
  },
};

export const Bottom: Story = {
  render: Template,

  args: {
    placement: 'bottom',
    message:
      'Optio minus varius reprehenderit ridiculus praesentium metus porttitor tellus.',
    children: (
      <Button type="button" variant="filled" color="primary">
        Bottom Tooltip
      </Button>
    ),
  },
};

export const Icon: Story = {
  render: Template,

  args: {
    placement: 'right',
    message:
      'Optio minus varius reprehenderit ridiculus praesentium metus porttitor tellus.',
    icon: <AlertCircle />,
    children: (
      <Button type="button" variant="filled" color="primary">
        Icon Tooltip
      </Button>
    ),
  },
};
