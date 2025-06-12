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
  args: {
    defaultFolder: 'owner',
    showPublicFolder: false,
    multiple: false,
  },
  argTypes: {
    multiple: {
      control: {
        type: 'boolean',
        options: [true, false],
      },
    },
  },
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

export const WithRoles: Story = {
  args: {
    roles: ['img'],
  },
  parameters: {
    docs: {
      description: {
        story:
          'The Workspace component displaying only media elements with specific roles.',
      },
    },
  },
  render: (args: any) => {
    return <Workspace {...args} />;
  },
};

export const WithDefaultFolder: Story = {
  args: {
    defaultFolder: 'shared',
  },
  parameters: {
    docs: {
      description: {
        story: 'The Workspace component with a default folder selected.',
      },
    },
  },
  render: (args: any) => {
    return <Workspace {...args} />;
  },
};

export const ShowPublicFolder: Story = {
  args: {
    defaultFolder: 'public',
    showPublicFolder: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'The Workspace component allowing selection of public documents.',
      },
    },
  },
  render: (args: any) => {
    return <Workspace {...args} />;
  },
};

export const MultipleSelection: Story = {
  args: {
    multiple: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'The Workspace component allowing multiple file selection. Default is true.',
      },
    },
  },
  render: (args: any) => {
    return <Workspace {...args} />;
  },
};
