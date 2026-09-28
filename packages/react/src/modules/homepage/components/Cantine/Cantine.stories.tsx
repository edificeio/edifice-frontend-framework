import { School } from '@edifice.io/client';
import { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { mockSchools } from '../../../../../../config/src/msw/data/schoolSpace';
import Cantine, { CantineProps } from './Cantine';
import CantineModal from './CantineModal';
import {
  CantineDish,
  CantineMenuType,
  CantineSection,
} from './hooks/useCantineMenu';

const meta: Meta<typeof Cantine> = {
  title: 'Modules/Homepage/Cantine',
  component: Cantine,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 397 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Menu de la cantine. Le bouton plein écran ouvre la modale de navigation par jour, avec sélection de l’établissement et du service.',
      },
    },
  },
};

export default meta;

function dish(overrides: Partial<CantineDish>): CantineDish {
  return {
    id: overrides.label ?? 'dish',
    label: 'Plat',
    vegetarien: false,
    faitmaison: false,
    bio: false,
    local: false,
    allergens: [],
    ...overrides,
  };
}

const mockSections: CantineSection[] = [
  {
    category: 'entree',
    items: [
      dish({
        id: 'coleslaw',
        label: 'Coleslaw',
        vegetarien: true,
        faitmaison: true,
        allergens: ['gluten', 'oeuf', 'soja lait', 'moutarde'],
      }),
      dish({
        id: 'concombre',
        label: 'Concombre à la crème',
        vegetarien: true,
        bio: true,
        allergens: ['lait'],
      }),
      dish({ id: 'melon', label: 'Melon charentais', vegetarien: true }),
    ],
  },
  {
    category: 'plat',
    items: [
      dish({
        id: 'blanquette',
        label: 'Blanquette de veau',
        faitmaison: true,
        local: true,
        allergens: ['gluten', 'lait', 'celeri'],
      }),
    ],
  },
  {
    category: 'accompagnement',
    items: [
      dish({
        id: 'riz',
        label: 'Riz pilaf',
        vegetarien: true,
        bio: true,
        local: true,
      }),
    ],
  },
  {
    category: 'laitage',
    items: [
      dish({ id: 'saint-moret', label: 'Saint môret', allergens: ['lait'] }),
      dish({
        id: 'chevretine',
        label: 'Chevretine',
        local: true,
        allergens: ['lait'],
      }),
    ],
  },
  {
    category: 'dessert',
    items: [
      dish({
        id: 'fruits',
        label: 'Fruits au sirop',
        vegetarien: true,
        faitmaison: true,
        bio: true,
        local: true,
      }),
    ],
  },
];

interface CantineWithModalProps extends Omit<
  CantineProps,
  'handleFullScreenClick'
> {
  schools: School[];
  hasDinner: boolean;
}

/**
 * Story-only wrapper: mounts the widget together with the modal it opens,
 * so a click on the full-screen button shows the real `CantineModal` instead
 * of leaving it as a separate, disconnected story.
 */
function CantineWithModal({
  schools,
  hasDinner,
  ...cantineProps
}: CantineWithModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [schoolId, setSchoolId] = useState(schools[0]?.id);
  const [menuType, setMenuType] = useState<CantineMenuType>('lunch');

  const selectedSchool = schools.find((school) => school.id === schoolId);

  return (
    <>
      <Cantine
        {...cantineProps}
        handleFullScreenClick={() => setIsOpen(true)}
      />
      <CantineModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        schools={schools}
        selectedSchool={selectedSchool}
        onSchoolChange={setSchoolId}
        hasDinner={hasDinner}
        menuType={menuType}
        onMenuTypeChange={setMenuType}
        date="2026-06-18"
        canGoPrevious
        canGoNext
        onPreviousDay={() => {}}
        onNextDay={() => {}}
        sections={cantineProps.sections}
        status={cantineProps.status}
      />
    </>
  );
}

type Story = StoryObj<typeof CantineWithModal>;

const baseArgs = {
  status: 'default' as const,
  sections: mockSections,
  schools: mockSchools,
  hasDinner: true,
};

export const Default: Story = {
  render: (args) => <CantineWithModal {...args} />,
  args: baseArgs,
  parameters: {
    docs: {
      description: {
        story:
          'Plusieurs établissements et déjeuner + dîner : la modale affiche les deux sélections.',
      },
    },
  },
};

export const UnSeulEtablissement: Story = {
  render: (args) => <CantineWithModal {...args} />,
  args: {
    ...baseArgs,
    schools: [mockSchools[0]],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Un seul établissement : la modale n’affiche pas de sélection d’établissement.',
      },
    },
  },
};

export const UnMenu: Story = {
  render: (args) => <CantineWithModal {...args} />,
  args: {
    ...baseArgs,
    hasDinner: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Seul le déjeuner est proposé : la modale n’affiche pas de sélection du service.',
      },
    },
  },
};

export const Chargement: Story = {
  render: (args) => <CantineWithModal {...args} />,
  args: {
    ...baseArgs,
    status: 'loading',
    sections: [],
  },
};

export const Vide: Story = {
  render: (args) => <CantineWithModal {...args} />,
  args: {
    ...baseArgs,
    status: 'empty',
    sections: [],
  },
};

export const Erreur: Story = {
  render: (args) => <CantineWithModal {...args} />,
  args: {
    ...baseArgs,
    status: 'error',
    sections: [],
  },
};
