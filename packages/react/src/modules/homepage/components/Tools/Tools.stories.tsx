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

export const Loading: Story = {
  args: {
    isLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "État de chargement : l'en-tête et les outils sont remplacés par des skeletons.",
      },
    },
  },
};

export const SkeletonAboveTheLoadedList: Story = {
  render: () => (
    <div className="skeleton-overlay-stack">
      <Tools isLoading />
      <Tools />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The loading state stacked on top of the loaded card. Any difference in height between the two is the layout shift the user would see when the tools arrive.',
      },
    },
  },
};

export const SkeletonSuperimposedOnTheLoadedList: Story = {
  render: () => (
    <div className="skeleton-overlay">
      <Tools />
      <div className="skeleton-overlay-top">
        <Tools isLoading />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The loading state superimposed on the loaded card, at partial opacity. Each grey circle should sit over the tool it replaces; the title width follows translated text and is representative.',
      },
    },
  },
};
