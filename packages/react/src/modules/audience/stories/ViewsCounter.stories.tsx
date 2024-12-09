import { Meta, StoryObj } from '@storybook/react';

import ViewsCounter, { ViewsCounterProps } from '../ViewsCounter';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof ViewsCounter> = {
  title: 'Modules/Audience/Views counter',
  component: ViewsCounter,
  args: {
    viewsCounter: 3,
    onClick: () => {
      console.log('Clicked');
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'ViewsCounter is a component that displays the number of views for content. It shows a counter with an eye icon and can be clicked to show more detailed view information. The component provides a simple way to track and display content engagement metrics.',
      },
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
