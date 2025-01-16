import { Meta, StoryObj } from '@storybook/react';
import { Content } from '@tiptap/react';
import Editor from './Editor';

const meta: Meta<typeof Editor> = {
  title: 'Modules/Editor',
  component: Editor,
  argTypes: {
    mode: {
      control: {
        type: 'select',
        options: ['edit', 'read'],
      },
    },
    toolbar: {
      control: {
        type: 'select',
        options: ['full', 'none'],
      },
    },
    variant: {
      control: {
        type: 'select',
        options: ['outline', 'ghost'],
      },
    },
    focus: {
      control: {
        type: 'select',
        options: ['start', 'end'],
      },
    },
    visibility: {
      control: {
        type: 'select',
        options: ['protected', 'public'],
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ height: '60rem' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Editor>;

export const Base: Story = {
  args: {
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' as Content,
    mode: 'edit',
    toolbar: 'full',
    variant: 'outline',
    focus: 'start',
    placeholder: 'Start typing...',
    visibility: 'protected',
  },
};

export const ReadMode: Story = {
  args: {
    ...Base.args,
    mode: 'read',
  },
};

export const EditMode: Story = {
  args: {
    ...Base.args,
    mode: 'edit',
  },
};
