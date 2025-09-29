import type { Meta, StoryObj } from '@storybook/react';
import { ButtonV4 } from './ButtonV4';
import { MantineProvider } from '../../providers/MantineProvider';
import { IconHome, IconPlus, IconSearch } from '@tabler/icons-react';

const meta: Meta<typeof ButtonV4> = {
  title: 'Components/ButtonV4',
  component: ButtonV4,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Nouveau composant bouton utilisant Mantine. Remplace progressivement le composant Button basé sur Bootstrap.',
      },
    },
  },
  decorators: [
    (Story) => (
      <MantineProvider>
        <Story />
      </MantineProvider>
    ),
  ],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['filled', 'outline', 'light', 'subtle', 'gradient', 'default'],
      description: 'Variante du bouton',
    },
    color: {
      control: { type: 'select' },
      options: [
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'gray',
      ],
      description: 'Couleur du bouton',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Taille du bouton',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'État désactivé',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'État de chargement',
    },
    children: {
      control: { type: 'text' },
      description: 'Texte du bouton',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ButtonV4>;

// Story par défaut
export const Default: Story = {
  args: {
    children: 'Button V4',
    variant: 'filled',
    color: 'primary',
    size: 'md',
  },
};

// Variantes de couleurs
export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <ButtonV4 variant="filled" color="primary">
        Primary
      </ButtonV4>
      <ButtonV4 variant="filled" color="secondary">
        Secondary
      </ButtonV4>
      <ButtonV4 variant="filled" color="success">
        Success
      </ButtonV4>
      <ButtonV4 variant="filled" color="warning">
        Warning
      </ButtonV4>
      <ButtonV4 variant="filled" color="danger">
        Danger
      </ButtonV4>
      <ButtonV4 variant="filled" color="info">
        Info
      </ButtonV4>
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
      <ButtonV4 variant="filled" color="primary">
        Filled
      </ButtonV4>
      <ButtonV4 variant="outline" color="primary">
        Outline
      </ButtonV4>
      <ButtonV4 variant="light" color="primary">
        Light
      </ButtonV4>
      <ButtonV4 variant="subtle" color="primary">
        Subtle
      </ButtonV4>
      <ButtonV4 variant="gradient" color="primary">
        Gradient
      </ButtonV4>
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
      <ButtonV4 size="xs" color="primary">
        Extra Small
      </ButtonV4>
      <ButtonV4 size="sm" color="primary">
        Small
      </ButtonV4>
      <ButtonV4 size="md" color="primary">
        Medium
      </ButtonV4>
      <ButtonV4 size="lg" color="primary">
        Large
      </ButtonV4>
      <ButtonV4 size="xl" color="primary">
        Extra Large
      </ButtonV4>
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
      <ButtonV4 color="primary">Normal</ButtonV4>
      <ButtonV4 loading color="primary">
        Loading
      </ButtonV4>
      <ButtonV4 disabled color="primary">
        Disabled
      </ButtonV4>
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
      <ButtonV4 leftSection={<IconPlus size={16} />} color="primary">
        Left Icon
      </ButtonV4>
      <ButtonV4 rightSection={<IconSearch size={16} />} color="primary">
        Right Icon
      </ButtonV4>
      <ButtonV4
        leftSection={<IconPlus size={16} />}
        rightSection={<IconSearch size={16} />}
        color="primary"
      >
        Both Icons
      </ButtonV4>
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
      <ButtonV4 loading color="primary">
        Loading
      </ButtonV4>
      <ButtonV4 loading leftSection={<IconHome size={16} />} color="primary">
        Loading with Icon
      </ButtonV4>
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
          <ButtonV4 variant="filled" color="primary">
            Filled
          </ButtonV4>
          <ButtonV4 variant="outline" color="primary">
            Outline
          </ButtonV4>
          <ButtonV4 variant="light" color="primary">
            Light
          </ButtonV4>
        </div>
      </div>
      <div>
        <h4>Secondary</h4>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <ButtonV4 variant="filled" color="secondary">
            Filled
          </ButtonV4>
          <ButtonV4 variant="outline" color="secondary">
            Outline
          </ButtonV4>
          <ButtonV4 variant="light" color="secondary">
            Light
          </ButtonV4>
        </div>
      </div>
      <div>
        <h4>Danger</h4>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <ButtonV4 variant="filled" color="danger">
            Filled
          </ButtonV4>
          <ButtonV4 variant="outline" color="danger">
            Outline
          </ButtonV4>
          <ButtonV4 variant="light" color="danger">
            Light
          </ButtonV4>
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
        <h4>ButtonV4 (Mantine)</h4>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <ButtonV4 variant="filled" color="primary">
            Primary
          </ButtonV4>
          <ButtonV4 variant="filled" color="secondary">
            Secondary
          </ButtonV4>
          <ButtonV4 variant="outline" color="primary">
            Outline
          </ButtonV4>
        </div>
      </div>
      <div>
        <h4>Button (Bootstrap)</h4>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <button className="btn btn-primary">Primary</button>
          <button className="btn btn-secondary">Secondary</button>
          <button className="btn btn-outline-primary">Outline</button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparaison entre ButtonV4 (Mantine) et Button (Bootstrap).',
      },
    },
  },
};
