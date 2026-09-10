import type { Meta, StoryObj } from '@storybook/react-vite';
import HelpZone from './HelpZone';

const meta: Meta<typeof HelpZone> = {
  title: 'Modules/Homepage/HelpZone',
  component: HelpZone,
  // No local `#portal` decorator: the global preview already renders one
  // (apps/docs/.storybook/preview.tsx) — a second one would duplicate the id.
  parameters: {
    docs: {
      description: {
        component:
          'Composant présentationnel du bouton d’aide, agnostique du prestataire de support sous-jacent : entièrement piloté par les props `isReady`/`isOpen`/`onOpen`/`onClose`.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof HelpZone>;

export const Closed: Story = {
  args: {
    isReady: true,
    isOpen: false,
    onOpen: () => {},
    onClose: () => {},
  },
};

export const Open: Story = {
  args: {
    isReady: true,
    isOpen: true,
    onOpen: () => {},
    onClose: () => {},
  },
};

export const NotReady: Story = {
  args: {
    isReady: false,
    isOpen: false,
    onOpen: () => {},
    onClose: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Ne rend rien tant que le widget de support n’est pas prêt.',
      },
    },
  },
};
