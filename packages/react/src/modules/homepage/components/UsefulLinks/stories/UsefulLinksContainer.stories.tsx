import { Meta, StoryObj } from '@storybook/react-vite';

import { UsefulLinksContainer } from '../UsefulLinksContainer';

const meta: Meta<typeof UsefulLinksContainer> = {
  title: 'Modules/Homepage/UsefulLinks/Container',
  component: UsefulLinksContainer,
  decorators: [
    (Story) => <div style={{ maxWidth: 400, width: '100%' }}>{Story()}</div>,
  ],
  parameters: {
    docs: {
      description: {
        component:
          "UsefulLinksContainer connecte le widget « Liens utiles » à l'API directory (mockée ici via MSW). Ouvrez « Éditer » pour tester le CRUD complet (ajout, modification, suppression).",
      },
    },
    // Interaction demo: no visual regression value beyond what
    // UsefulLinks/UsefulLinksModal/LinkForm stories already cover.
    chromatic: { disableSnapshot: true },
  },
};

export default meta;
type Story = StoryObj<typeof UsefulLinksContainer>;

export const Default: Story = {};
