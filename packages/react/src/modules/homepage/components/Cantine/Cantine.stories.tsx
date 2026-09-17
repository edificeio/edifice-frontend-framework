import { Meta, StoryObj } from '@storybook/react-vite';
import Cantine from './Cantine';
import { CantineDish, CantineSection } from './useCantine';

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
        component: 'Menu de la cantine',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Cantine>;

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

export const Default: Story = {
  args: {
    status: 'default',
    sections: mockSections,
    handleFullScreenClick: () => {},
  },
};

export const Chargement: Story = {
  args: {
    status: 'loading',
    sections: [],
    handleFullScreenClick: () => {},
  },
};

export const Vide: Story = {
  args: {
    status: 'empty',
    sections: [],
    handleFullScreenClick: () => {},
  },
};

export const Erreur: Story = {
  args: {
    status: 'error',
    sections: [],
    handleFullScreenClick: () => {},
  },
};
