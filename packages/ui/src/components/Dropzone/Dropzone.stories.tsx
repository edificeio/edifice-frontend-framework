import { Meta, StoryObj } from '@storybook/react';

import Dropzone from './Dropzone';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Dropzone> = {
  title: 'Components/Dropzone',
  component: Dropzone,
  args: {
    accept: [],
  },
};

export default meta;
type Story = StoryObj<typeof Dropzone>;

export const Base: Story = {};

export const Handle: Story = {
  render: (args) => {
    return <Dropzone {...args} handle={true} />;
  },
};

export const OneElement: Story = {
  render: (args) => {
    return <Dropzone {...args} multiple={false} />;
  },
};

export const MultipleElement: Story = {
  render: (args) => {
    return <Dropzone {...args} multiple={true} />;
  },
};
