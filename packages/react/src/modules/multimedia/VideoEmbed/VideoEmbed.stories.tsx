import { Meta, StoryObj } from '@storybook/react';
import VideoEmbed from './VideoEmbed';

const meta: Meta<typeof VideoEmbed> = {
  title: 'Modules/Multimedia/VideoEmbed',
  component: VideoEmbed,
  parameters: {
    docs: {
      description: {
        component:
          'The `VideoEmbed` component provides an interface for embedding video content from various sources. It creates a responsive container that maintains aspect ratio and properly displays embedded video players. This component is commonly used for integrating video content from platforms like YouTube, Vimeo, or other video hosting services into your application.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof VideoEmbed>;

export const Base: Story = {};
