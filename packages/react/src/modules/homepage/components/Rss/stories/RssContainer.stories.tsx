import { Meta, StoryObj } from '@storybook/react-vite';
import { Toaster } from 'react-hot-toast';

import { RssContainer } from '../RssContainer';

const meta: Meta<typeof RssContainer> = {
  title: 'Modules/Homepage/Rss/Container',
  component: RssContainer,
  decorators: [
    // The success toasts need a Toaster, rendered by PageLayout in the apps.
    (Story) => (
      <div style={{ maxWidth: 400, width: '100%' }}>
        {Story()}
        <Toaster />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "RssContainer connecte le widget « RSS » à l'API rss (mockée ici via MSW). Changez de flux pour voir les états articles / vide / erreur, et ouvrez l'édition pour tester l'ajout, la modification et la suppression.",
      },
    },
    // Interaction demo: the Widget/Modal/Form stories already cover the
    // visual states.
    chromatic: { disableSnapshot: true },
  },
};

export default meta;
type Story = StoryObj<typeof RssContainer>;

export const Default: Story = {};
