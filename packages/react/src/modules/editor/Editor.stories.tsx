import { Meta, StoryObj } from '@storybook/react';
import { Content } from '@tiptap/react';
import Editor from './components/Editor/Editor';

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
  parameters: {
    docs: {
      description: {
        component:
          'Editor component to render rich content. It can be used in `edit` mode to allow content modifications, or in `read` mode to display content. ' +
          'This editor is built using the Tiptap library, which is a headless, framework-agnostic, and highly extensible rich-text editor. ' +
          'Tiptap provides a set of default extensions for common rich-text features like bold, italic, links, and more. ' +
          'Additionally, we have implemented custom extensions to support specific requirements of our application. ' +
          'The `visibility` prop is part of the workspace module and controls the visibility of the content, allowing it to be either `protected` or `public`.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Editor>;

const allArgs = {
  content:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' as Content,
  placeholder: 'Start typing...',
};

export const EditMode: Story = {
  args: {
    ...allArgs,
    mode: 'edit',
    toolbar: 'full',
    variant: 'outline',
    focus: 'start',
    visibility: 'protected',
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
    ...EditMode.args,
    mode: 'read',
  },
  name: 'Read Mode',
};

export const ReadModeWithGhostVariant: Story = {
  args: {
    ...EditMode.args,
    mode: 'read',
    variant: 'ghost',
  },
  name: 'Read Mode with Ghost Variant',
  parameters: {
    docs: {
      description: {
        story:
          'Editor in `read` mode with the `ghost` variant. Prop can be either `outline` or `ghost`.',
      },
    },
  },
};

export const EditModeWithoutToolbar: Story = {
  args: {
    ...allArgs,
    mode: 'edit',
    toolbar: 'none',
    variant: 'outline',
    focus: 'start',
    visibility: 'public',
  },
  name: 'Edit Mode without Toolbar',
  parameters: {
    docs: {
      description: {
        story:
          'Editor in `edit` mode without a toolbar. ' +
          'The toolbar is hidden when the `toolbar` prop is set to `none`.' +
          ' You can use tiptap shortcuts to format the text.',
      },
    },
  },
};

export const EditorModeVariantGhost: Story = {
  args: {
    ...allArgs,
    mode: 'edit',
    toolbar: 'none',
    variant: 'ghost',
    focus: 'start',
    visibility: 'protected',
  },
  name: 'Edit Mode with Ghost Variant',
  parameters: {
    docs: {
      description: {
        story:
          'Editor in `edit` mode with the `ghost` variant. Prop can be either `outline` or `ghost`.',
      },
    },
  },
};

export const EditorVisibilityProp: Story = {
  args: {
    ...allArgs,
    mode: 'edit',
    toolbar: 'full',
    variant: 'outline',
    focus: 'end',
    visibility: 'public',
  },
  name: 'Edit Mode with Visibility Prop',
  parameters: {
    docs: {
      description: {
        story:
          'Editor accepts a `visibility` prop to set the visibility of the content. ' +
          'The prop can be either `protected` or `public`. ' +
          'This will impact where the uploaded files will be stored and the availability of the public media files.',
      },
    },
  },
};

export const EditorFocusProp: Story = {
  args: {
    ...allArgs,
    mode: 'edit',
    toolbar: 'full',
    variant: 'outline',
    focus: 'end',
    visibility: 'public',
  },
  name: 'Edit Mode with focus props',
  parameters: {
    docs: {
      description: {
        story:
          'Editor accepts a props `focus` to set the focus position to the editor. Can be either `start` or `end`.',
      },
    },
  },
};
