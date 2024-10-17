import { Meta, StoryObj } from '@storybook/react';

import ViewsCounter, { ViewsCounterProps } from '../ViewsCounter';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof ViewsCounter> = {
  title: 'Components/Audience/Views counter',
  component: ViewsCounter,
  args: {
    viewsCounter: 3,
    onClick: () => {
      console.log('Clicked');
    },
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

export default meta;
type Story = StoryObj<typeof ViewsCounter>;

export const Base: Story = {
  render: (props: ViewsCounterProps) => {
    return <ViewsCounter {...props} />;
  },
};
