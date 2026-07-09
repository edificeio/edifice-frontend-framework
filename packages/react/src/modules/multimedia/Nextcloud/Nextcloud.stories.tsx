import { Meta, StoryObj } from '@storybook/react-vite';

import Nextcloud from './Nextcloud';

const meta: Meta<typeof Nextcloud> = {
  title: 'Modules/Multimedia/Nextcloud',
  component: Nextcloud,
  args: {},
};

export default meta;

type Story = StoryObj<typeof Nextcloud>;

export const Base: Story = {
  args: {
    multiple: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'The Nextcloud component allows the user to choose one or more files among his Nextcloud documents.',
      },
    },
  },
  render: (args: any) => {
    return <Nextcloud {...args} />;
  },
};

export const MultipleSelection: Story = {
  args: {
    multiple: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'The Nextcloud component allowing multiple file selection.',
      },
    },
  },
  render: (args: any) => {
    return <Nextcloud {...args} />;
  },
};
