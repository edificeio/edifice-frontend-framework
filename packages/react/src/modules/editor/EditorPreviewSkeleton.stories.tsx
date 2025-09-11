import { Meta, StoryObj } from '@storybook/react';
import EditorPreviewSkeleton from './components/Editor/EditorPreviewSkeleton';

const meta: Meta<typeof EditorPreviewSkeleton> = {
  title: 'Modules/Editor/EditorPreviewSkeleton',
  component: EditorPreviewSkeleton,
  argTypes: {
    variant: {
      control: {
        type: 'select',
        options: ['outline', 'ghost'],
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'EditorPreviewSkeleton component to render a placeholder for the EditorPreview component. ' +
          'It can be used in `outline` variant to indicate that the preview is loading or in `ghost` variant to show a placeholder for the content. ' +
          'This skeleton is useful for providing visual feedback while the preview content is being loaded or processed.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof EditorPreviewSkeleton>;

export const OutlinePreviewSkeletonVariant: Story = {
  args: {
    variant: 'outline',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '60rem' }}>
        <Story />
      </div>
    ),
  ],
  name: 'Outline Variant',
};

export const GhostPreviewSkeletonVariant: Story = {
  args: {
    variant: 'ghost',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '60rem' }}>
        <Story />
      </div>
    ),
  ],
  name: 'Ghost Variant',
};
