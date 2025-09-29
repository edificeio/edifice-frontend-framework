import type { Meta, StoryObj } from '@storybook/react';
import { ButtonV3 } from './ButtonV3';
import { AntdProvider } from '../../providers/AntdProvider';
import { HomeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';

const meta: Meta<typeof ButtonV3> = {
  title: 'Components/ButtonV3',
  component: ButtonV3,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Nouveau composant bouton utilisant Ant Design. Remplace progressivement le composant Button basé sur Bootstrap.',
      },
    },
  },
  decorators: [
    (Story) => (
      <AntdProvider>
        <Story />
      </AntdProvider>
    ),
  ],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'primary',
        'secondary',
        'success',
        'warning',
        'danger',
        'info',
        'ghost',
        'dashed',
        'link',
        'text',
      ],
      description: 'Variante du bouton',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
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
type Story = StoryObj<typeof ButtonV3>;

// Story par défaut
export const Default: Story = {
  args: {
    children: 'Button V3',
    variant: 'primary',
    size: 'medium',
  },
};

// Variantes de couleurs
export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <ButtonV3 variant="primary">Primary</ButtonV3>
      <ButtonV3 variant="secondary">Secondary</ButtonV3>
      <ButtonV3 variant="success">Success</ButtonV3>
      <ButtonV3 variant="warning">Warning</ButtonV3>
      <ButtonV3 variant="danger">Danger</ButtonV3>
      <ButtonV3 variant="info">Info</ButtonV3>
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
      <ButtonV3 variant="primary">Primary</ButtonV3>
      <ButtonV3 variant="ghost">Ghost</ButtonV3>
      <ButtonV3 variant="dashed">Dashed</ButtonV3>
      <ButtonV3 variant="link">Link</ButtonV3>
      <ButtonV3 variant="text">Text</ButtonV3>
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
      <ButtonV3 size="small">Small</ButtonV3>
      <ButtonV3 size="medium">Medium</ButtonV3>
      <ButtonV3 size="large">Large</ButtonV3>
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
      <ButtonV3>Normal</ButtonV3>
      <ButtonV3 loading>Loading</ButtonV3>
      <ButtonV3 disabled>Disabled</ButtonV3>
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
      <ButtonV3 startIcon={<PlusOutlined />}>Left Icon</ButtonV3>
      <ButtonV3 endIcon={<SearchOutlined />}>Right Icon</ButtonV3>
      <ButtonV3 startIcon={<PlusOutlined />} endIcon={<SearchOutlined />}>
        Both Icons
      </ButtonV3>
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
      <ButtonV3 loading>Loading</ButtonV3>
      <ButtonV3 loading startIcon={<HomeOutlined />}>
        Loading with Icon
      </ButtonV3>
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
          <ButtonV3 variant="primary">Primary</ButtonV3>
          <ButtonV3 variant="ghost">Ghost</ButtonV3>
          <ButtonV3 variant="dashed">Dashed</ButtonV3>
        </div>
      </div>
      <div>
        <h4>Secondary</h4>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <ButtonV3 variant="secondary">Secondary</ButtonV3>
          <ButtonV3 variant="ghost">Ghost</ButtonV3>
          <ButtonV3 variant="dashed">Dashed</ButtonV3>
        </div>
      </div>
      <div>
        <h4>Danger</h4>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <ButtonV3 variant="danger">Danger</ButtonV3>
          <ButtonV3 variant="ghost">Ghost</ButtonV3>
          <ButtonV3 variant="dashed">Dashed</ButtonV3>
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
        <h4>ButtonV3 (Ant Design)</h4>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <ButtonV3 variant="primary">Primary</ButtonV3>
          <ButtonV3 variant="secondary">Secondary</ButtonV3>
          <ButtonV3 variant="ghost">Ghost</ButtonV3>
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
        story: 'Comparaison entre ButtonV3 (Ant Design) et Button (Bootstrap).',
      },
    },
  },
};
