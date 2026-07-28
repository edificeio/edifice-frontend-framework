import { Meta, StoryObj } from '@storybook/react-vite';

import { ExternalLinker } from './ExternalLinker';

const meta: Meta<typeof ExternalLinker> = {
  title: 'Modules/Multimedia/ExternalLinker',
  component: ExternalLinker,
  parameters: {
    docs: {
      description: {
        component:
          'The `ExternalLinker` component is the form used to attach an external URL, typically from the editor link dialog. It edits a `{ url, text, target }` triple and reports every change through `onChange`, leaving validation and persistence to the caller. Pass an existing `link` to edit it rather than create a new one. When several nodes are selected in the editor, set `multiNodeSelected` so the component hides the link-text field — that text cannot apply to a multi-node selection. Its counterpart for internal resources is `InternalLinker`.',
      },
    },
  },
  args: {},
};

export default meta;

type Story = StoryObj<typeof ExternalLinker>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Base: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '',
      },
    },
  },
};

export const UpdateLink: Story = {
  args: {
    link: {
      url: 'www.edifice.io',
      text: 'Lien vers Edifice',
    },
  },
  parameters: {
    docs: {
      description: {
        story: '',
      },
    },
  },
};

export const SelectedText: Story = {
  args: {
    link: {
      url: 'www.edifice.io',
      text: 'Text sélectionné',
    },
  },
  parameters: {
    docs: {
      description: {
        story: '',
      },
    },
  },
};
