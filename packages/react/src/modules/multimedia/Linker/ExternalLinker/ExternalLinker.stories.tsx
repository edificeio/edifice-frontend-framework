import { Meta, StoryObj } from '@storybook/react';

import { ExternalLinker } from './ExternalLinker';

const meta: Meta<typeof ExternalLinker> = {
  title: 'Modules/Multimedia/ExternalLinker',
  component: ExternalLinker,
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
