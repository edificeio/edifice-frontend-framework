import { Meta, StoryObj } from '@storybook/react';

import { IconHourglass } from '../../modules/icons/components';
import Loading, { LoadingProps } from './Loading';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Loading> = {
  title: 'Components/Loading',
  component: Loading,
  argTypes: {
    loadingPosition: {
      options: ['left', 'right'],
      control: { type: 'inline-radio' },
    },
  },
  args: {
    isLoading: true,
    loadingPosition: 'left',
    loadingIcon: undefined,
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `Loading` component provides a visual indicator for loading states in the application. It can be customized with different positions, colors and icons. Features include:\n\n- Left or right positioning of the loading indicator\n- Custom loading icons\n- Color customization\n- Optional loading text\n- Flexible integration with buttons and other components',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Loading>;

export const Base: Story = {
  args: {
    loadingPosition: 'left',
    children: 'Loading...',
  },

  decorators: [
    (Story) => (
      <div
        className="is-loading btn d-inline-flex align-items-center"
        style={{ backgroundColor: '#4a4a4a', color: '#fff' }}
      >
        {Story()}
      </div>
    ),
  ],
};

export const LoadingWithCustomColor: Story = {
  render: (args: LoadingProps) => {
    return <Loading {...args} color="blue" />;
  },
};

export const LoadingWithText: Story = {
  args: {
    loadingPosition: 'left',
    children: 'Loading...',
  },

  decorators: [
    (Story) => (
      <div
        className="is-loading btn d-inline-flex align-items-center"
        style={{ backgroundColor: '#4a4a4a', color: '#fff' }}
      >
        {Story()}
      </div>
    ),
  ],
};

export const LoadingRightWithText: Story = {
  args: {
    loadingPosition: 'right',
    children: 'Loading...',
  },

  decorators: [
    (Story) => (
      <div
        className="is-loading btn d-inline-flex align-items-center"
        style={{ backgroundColor: '#4a4a4a', color: '#fff' }}
      >
        {Story()}
      </div>
    ),
  ],
};

export const LoadingCustomIcon: Story = {
  args: {
    loadingPosition: 'left',
    loadingIcon: <IconHourglass />,
    children: 'Loading...',
  },

  decorators: [
    (Story) => (
      <div
        className="is-loading btn d-inline-flex align-items-center"
        style={{ backgroundColor: '#4a4a4a', color: '#fff' }}
      >
        {Story()}
      </div>
    ),
  ],
};

export const LoadingCustomIconWithColor: Story = {
  args: {
    loadingPosition: 'left',
    loadingIcon: <IconHourglass color="blue" />,
    children: 'Loading...',
  },
};

export const LoadingRightCustomIcon: Story = {
  args: {
    loadingPosition: 'right',
    loadingIcon: <IconHourglass color="blue" />,
    children: 'Loading...',
  },

  decorators: [
    (Story) => (
      <div
        className="is-loading btn d-inline-flex align-items-center"
        style={{ backgroundColor: '#4a4a4a', color: '#fff' }}
      >
        {Story()}
      </div>
    ),
  ],
};
