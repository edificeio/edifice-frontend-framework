import { Meta, StoryObj } from '@storybook/react';
import EditorSkeleton from './components/Editor/EditorSkeleton';

const meta: Meta<typeof EditorSkeleton> = {
  title: 'Modules/Editor/EditorSkeleton',
  component: EditorSkeleton,
  argTypes: {
    mode: {
      control: {
        type: 'select',
        options: ['edit', 'read'],
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'EditorSkeleton component to render a placeholder for the Editor component. ' +
          'It can be used in `edit` mode to indicate that the editor is loading or in `read` mode to show a placeholder for the content. ' +
          'This skeleton is useful for providing visual feedback while the editor content is being loaded or processed.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof EditorSkeleton>;

export const EditSkeletonMode: Story = {
  args: {
    mode: 'edit',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '60rem' }}>
        <Story />
      </div>
    ),
  ],
  name: 'Edit Mode',
};

export const ReadMode: Story = {
  args: {
    mode: 'read',
  },
  name: 'Read Mode',
};
