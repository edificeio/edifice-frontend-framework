import { Meta, StoryObj } from '@storybook/react';
import Embed from './Embed';

const meta: Meta<typeof Embed> = {
  title: 'Modules/Multimedia/Embed',
  component: Embed,
  parameters: {
    docs: {
      description: {
        component: 'Embeded/Iframe.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Embed>;

export const Base: Story = {};
