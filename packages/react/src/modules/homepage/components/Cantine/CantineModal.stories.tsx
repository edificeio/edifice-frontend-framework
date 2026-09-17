import { School } from '@edifice.io/client';
import { Meta, StoryObj } from '@storybook/react-vite';
import CantineModal from './CantineModal';
import { CantineDish, CantineSection } from './hooks/useCantineMenu';

const meta: Meta<typeof CantineModal> = {
  title: 'Modules/Homepage/CantineModal',
  component: CantineModal,
  parameters: {
    docs: {
      description: {
        component:
          'Menu de la cantine en plein écran : navigation par jour, sélection de l’établissement et du service.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CantineModal>;

function school(id: string, name: string): School {
  return { id, name, UAI: `UAI-${id}`, exports: [], classes: [] } as School;
}

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
        allergens: ['lait'],
      }),
      dish({
        id: 'melon',
        label: 'Melon charentais',
        vegetarien: true,
        faitmaison: true,
      }),
      dish({
        id: 'radis',
        label: 'Radis Beurre',
        vegetarien: true,
        allergens: ['lait'],
      }),
    ],
  },
  {
    category: 'plat',
    items: [
      dish({
        id: 'blanquette',
        label: 'Blanquette de veau',
        vegetarien: true,
        faitmaison: true,
        allergens: ['gluten', 'lait', 'celeri'],
      }),
    ],
  },
  {
    category: 'accompagnement',
    items: [dish({ id: 'riz', label: 'Riz pilaf', vegetarien: true })],
  },
  {
    category: 'laitage',
    items: [
      dish({ id: 'saint-moret', label: 'Saint môret', allergens: ['lait'] }),
      dish({ id: 'chevretine', label: 'Chevretine', allergens: ['lait'] }),
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
      }),
    ],
  },
];

const schools = [
  school('school-1', 'École Jacques Prévert'),
  school('school-2', 'École Victor Hugo'),
];

const baseArgs = {
  isOpen: true,
  onClose: () => {},
  schools,
  selectedSchool: schools[0],
  onSchoolChange: () => {},
  hasDinner: true,
  menuType: 'lunch' as const,
  onMenuTypeChange: () => {},
  date: '2026-06-18',
  canGoPrevious: true,
  canGoNext: true,
  onPreviousDay: () => {},
  onNextDay: () => {},
  sections: mockSections,
  status: 'default' as const,
};

export const Default: Story = {
  args: baseArgs,
};

export const SansFormulaire: Story = {
  args: {
    ...baseArgs,
    schools: [schools[0]],
    hasDinner: false,
  },
};

export const MenuIndisponible: Story = {
  args: {
    ...baseArgs,
    sections: [],
    status: 'empty',
  },
};

export const Chargement: Story = {
  args: {
    ...baseArgs,
    sections: [],
    status: 'loading',
  },
};
