import { Meta, StoryObj } from '@storybook/react';
import VideoEmbed from './VideoEmbed';

const meta: Meta<typeof VideoEmbed> = {
  title: 'Multimedia/VideoEmbed',
  component: VideoEmbed,
  parameters: {
    docs: {
      description: {
        component: 'Video Embed.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof VideoEmbed>;

export const Base: Story = {};
