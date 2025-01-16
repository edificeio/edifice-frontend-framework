import { Meta, StoryObj } from '@storybook/react';

import Workspace from './Workspace';

const meta: Meta<typeof Workspace> = {
  title: 'Modules/Multimedia/Workspace',
  component: Workspace,
  args: {},
};

export default meta;

type Story = StoryObj<typeof Workspace>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Base: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'The Workspace component allows the user to choose one or more files among all the online files he has access to in the system.',
      },
    },
  },
  render: (args: any) => {
    return <Workspace {...args} />;
  },
};
