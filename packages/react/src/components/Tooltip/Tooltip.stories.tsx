import { Meta, StoryObj } from '@storybook/react';

import { IconAlertCircle } from '../../modules/icons/components';
import { Button } from '../Button';
import Tooltip, { TooltipProps } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component:
          'Tooltip component allows you to display additional information when users hover over or focus on an element. It supports various placements and can be customized with different messages and styles.',
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
    icon: <IconAlertCircle />,
    children: (
      <Button type="button" variant="filled" color="primary">
        Icon Tooltip
      </Button>
    ),
  },
};
