import { Meta, StoryObj } from '@storybook/react-vite';

import { CreateDocumentModal } from './CreateDocumentModal';

const meta: Meta<typeof CreateDocumentModal> = {
  title: 'Modules/Homepage/Tools/CreateDocumentModal',
  component: CreateDocumentModal,
  args: {
    defaultType: 'word',
    onClose: () => {},
    onCreate: (type, name) => alert(`Création : ${type} — ${name}`),
  },
  argTypes: {
    defaultType: {
      control: 'select',
      options: ['word', 'powerpoint', 'excel'],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Modale ouverte au clic sur un outil office du widget Outils : choix du type de document et saisie du nom. Dans `ToolsContainer`, la validation ouvre la création du document avec LOOL (dans l’espace documentaire) dans un nouvel onglet.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof CreateDocumentModal>;

export const Default: Story = {};

export const Spreadsheet: Story = {
  args: { defaultType: 'excel' },
};
