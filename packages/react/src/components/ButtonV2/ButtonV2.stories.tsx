import type { Meta, StoryObj } from '@storybook/react';
import { ChakraProvider } from '@chakra-ui/react';
import { ButtonV2 } from './index';
import theme from '../../theme';

const meta: Meta<typeof ButtonV2> = {
  title: 'Components/ButtonV2',
  component: ButtonV2,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Nouveau composant bouton utilisant Chakra UI. Remplace progressivement le composant Button basé sur Bootstrap.',
      },
    },
  },
  decorators: [
    (Story) => (
      <ChakraProvider value={theme}>
        <Story />
      </ChakraProvider>
    ),
  ],
  argTypes: {
    color: {
      control: { type: 'select' },
      options: [
        'primary',
        'secondary',
        'tertiary',
        'danger',
        'success',
        'warning',
        'info',
      ],
      description: 'Couleur du bouton',
    },
    variant: {
      control: { type: 'select' },
      options: ['solid', 'outline', 'ghost'],
      description: 'Style du bouton',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Taille du bouton',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: 'État de chargement',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'État désactivé',
    },
    children: {
      control: { type: 'text' },
      description: 'Texte du bouton',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ButtonV2>;

// Story par défaut
export const Default: Story = {
  args: {
    children: 'Button V2',
    color: 'primary',
    variant: 'solid',
    size: 'md',
  },
};

// Variantes de couleurs
export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <ButtonV2 color="primary">Primary</ButtonV2>
      <ButtonV2 color="secondary">Secondary</ButtonV2>
      <ButtonV2 color="tertiary">Tertiary</ButtonV2>
      <ButtonV2 color="danger">Danger</ButtonV2>
      <ButtonV2 color="success">Success</ButtonV2>
      <ButtonV2 color="warning">Warning</ButtonV2>
      <ButtonV2 color="info">Info</ButtonV2>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Toutes les couleurs disponibles pour le bouton.',
      },
    },
  },
};

// Variantes de style
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <ButtonV2 variant="solid">Solid</ButtonV2>
      <ButtonV2 variant="outline">Outline</ButtonV2>
      <ButtonV2 variant="ghost">Ghost</ButtonV2>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Les différents styles de bouton disponibles.',
      },
    },
  },
};

// Tailles
export const Sizes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <ButtonV2 size="sm">Small</ButtonV2>
      <ButtonV2 size="md">Medium</ButtonV2>
      <ButtonV2 size="lg">Large</ButtonV2>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Les différentes tailles de bouton disponibles.',
      },
    },
  },
};

// États
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <ButtonV2>Normal</ButtonV2>
      <ButtonV2 isLoading>Loading</ButtonV2>
      <ButtonV2 disabled>Disabled</ButtonV2>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Les différents états du bouton.',
      },
    },
  },
};

// Avec icônes
export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <ButtonV2 leftIcon="→">Left Icon</ButtonV2>
      <ButtonV2 rightIcon="←">Right Icon</ButtonV2>
      <ButtonV2 leftIcon="→" rightIcon="←">
        Both Icons
      </ButtonV2>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Boutons avec icônes à gauche, à droite, ou des deux côtés.',
      },
    },
  },
};

// Loading avec position
export const LoadingPositions: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <ButtonV2 isLoading loadingPosition="left">
        Loading Left
      </ButtonV2>
      <ButtonV2 isLoading loadingPosition="right">
        Loading Right
      </ButtonV2>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Position du spinner de chargement.',
      },
    },
  },
};

// Combinaisons de couleurs et variants
export const ColorVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
      }}
    >
      <div>
        <h4>Primary</h4>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <ButtonV2 color="primary" variant="solid">
            Solid
          </ButtonV2>
          <ButtonV2 color="primary" variant="outline">
            Outline
          </ButtonV2>
          <ButtonV2 color="primary" variant="ghost">
            Ghost
          </ButtonV2>
        </div>
      </div>
      <div>
        <h4>Secondary</h4>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <ButtonV2 color="secondary" variant="solid">
            Solid
          </ButtonV2>
          <ButtonV2 color="secondary" variant="outline">
            Outline
          </ButtonV2>
          <ButtonV2 color="secondary" variant="ghost">
            Ghost
          </ButtonV2>
        </div>
      </div>
      <div>
        <h4>Danger</h4>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <ButtonV2 color="danger" variant="solid">
            Solid
          </ButtonV2>
          <ButtonV2 color="danger" variant="outline">
            Outline
          </ButtonV2>
          <ButtonV2 color="danger" variant="ghost">
            Ghost
          </ButtonV2>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Combinaisons de couleurs et de variants.',
      },
    },
  },
};

// Comparaison avec l'ancien Button
export const Comparison: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <div>
        <h4>ButtonV2 (Chakra UI)</h4>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <ButtonV2 color="primary">Primary</ButtonV2>
          <ButtonV2 color="secondary" variant="outline">
            Secondary Outline
          </ButtonV2>
          <ButtonV2 color="danger" variant="ghost">
            Danger Ghost
          </ButtonV2>
        </div>
      </div>
      <div>
        <h4>Button (Bootstrap)</h4>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <button className="btn btn-filled btn-primary">Primary</button>
          <button className="btn btn-outline-secondary">
            Secondary Outline
          </button>
          <button className="btn btn-ghost-danger">Danger Ghost</button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparaison entre ButtonV2 (Chakra UI) et Button (Bootstrap).',
      },
    },
  },
};
