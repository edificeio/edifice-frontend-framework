import { Meta, StoryObj } from '@storybook/react-vite';

import { useState } from 'react';

import { CreateDocumentModal } from './CreateDocumentModal';
import { OfficeToolType, Tools, ToolsProps } from './Tools';
import { buildLoolCreateUrl } from './utils';

function ToolsWithCreateDocumentModal(props: ToolsProps) {
  const [modalType, setModalType] = useState<OfficeToolType | null>(null);

  return (
    <>
      <Tools {...props} onOfficeToolClick={setModalType} />
      {modalType && (
        <CreateDocumentModal
          defaultType={modalType}
          onClose={() => setModalType(null)}
          onCreate={(type, name) => {
            alert(`Nouvel onglet :\n${buildLoolCreateUrl(type, name)}`);
            setModalType(null);
          }}
        />
      )}
    </>
  );
}

const meta: Meta<typeof Tools> = {
  title: 'Modules/Homepage/Tools',
  component: Tools,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400, width: '100%' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    onOfficeToolClick: (tool) => alert(`Outil : ${tool}`),
  },
  parameters: {
    docs: {
      description: {
        component:
          'Widget Outils — raccourcis de création de documents (Word, PowerPoint, Excel) et de captation (vidéo, audio). Un clic sur vidéo ou audio ouvre la modale de captation correspondante. Variante `secondary` de `HomeCard`.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tools>;

export const Default: Story = {
  parameters: {
    docs: {
      description: { story: 'Affichage avec tous les outils.' },
    },
  },
};

export const WithCreateDocumentModal: Story = {
  render: (args) => <ToolsWithCreateDocumentModal {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          'Comportement de `ToolsContainer` : un clic sur Word, PowerPoint ou Excel ouvre la modale de création (type + nom). La validation affiche l’URL LOOL (création du document dans l’espace documentaire) qui serait ouverte dans un nouvel onglet.',
      },
    },
  },
};

export const OfficeOnly: Story = {
  args: {
    tools: ['word', 'powerpoint', 'excel'],
  },
  parameters: {
    docs: {
      description: { story: 'Affichage limité aux outils bureautiques.' },
    },
  },
};
