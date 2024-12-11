import { Meta, StoryObj } from '@storybook/react';
import AudioRecorder from './AudioRecorder';

const meta: Meta<typeof AudioRecorder> = {
  title: 'Modules/Multimedia/AudioRecorder',
  component: AudioRecorder,
  parameters: {
    docs: {
      description: {
        component:
          'Audio recorder component that allows user to record an audio through the micro device.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof AudioRecorder>;

export const Base: Story = {};
