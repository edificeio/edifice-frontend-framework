import type { Meta, StoryObj } from '@storybook/react';
import { ButtonV5 } from './ButtonV5';
import { ThemeProvider } from '@mui/material/styles';
import { muiTheme } from '../../theme';
import { Add, Search, Home } from '@mui/icons-material';

const meta: Meta<typeof ButtonV5> = {
  title: 'Components/ButtonV5',
  component: ButtonV5,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Nouveau composant bouton utilisant Material-UI. Remplace progressivement le composant Button basé sur Bootstrap.',
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={muiTheme}>
        <Story />
      </ThemeProvider>
    ),
  ],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['contained', 'outlined', 'text'],
      description: 'Variante du bouton',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'error', 'warning', 'info'],
      description: 'Couleur du bouton',
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
type Story = StoryObj<typeof ButtonV5>;

// Story par défaut
export const Default: Story = {
  args: {
    children: 'Button V5',
    variant: 'contained',
    color: 'primary',
    size: 'medium',
  },
};

// Variantes de couleurs
export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <ButtonV5 variant="contained" color="primary">
        Primary
      </ButtonV5>
      <ButtonV5 variant="contained" color="secondary">
        Secondary
      </ButtonV5>
      <ButtonV5 variant="contained" color="success">
        Success
      </ButtonV5>
      <ButtonV5 variant="contained" color="warning">
        Warning
      </ButtonV5>
      <ButtonV5 variant="contained" color="error">
        Error
      </ButtonV5>
      <ButtonV5 variant="contained" color="info">
        Info
      </ButtonV5>
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
      <ButtonV5 variant="contained" color="primary">
        Contained
      </ButtonV5>
      <ButtonV5 variant="outlined" color="primary">
        Outlined
      </ButtonV5>
      <ButtonV5 variant="text" color="primary">
        Text
      </ButtonV5>
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
      <ButtonV5 size="small" color="primary">
        Small
      </ButtonV5>
      <ButtonV5 size="medium" color="primary">
        Medium
      </ButtonV5>
      <ButtonV5 size="large" color="primary">
        Large
      </ButtonV5>
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
      <ButtonV5 color="primary">Normal</ButtonV5>
      <ButtonV5 loading color="primary">
        Loading
      </ButtonV5>
      <ButtonV5 disabled color="primary">
        Disabled
      </ButtonV5>
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
      <ButtonV5 startIcon={<Add />} color="primary">
        Left Icon
      </ButtonV5>
      <ButtonV5 endIcon={<Search />} color="primary">
        Right Icon
      </ButtonV5>
      <ButtonV5 startIcon={<Add />} endIcon={<Search />} color="primary">
        Both Icons
      </ButtonV5>
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
      <ButtonV5 loading color="primary">
        Loading
      </ButtonV5>
      <ButtonV5 loading startIcon={<Home />} color="primary">
        Loading with Icon
      </ButtonV5>
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
          <ButtonV5 variant="contained" color="primary">
            Contained
          </ButtonV5>
          <ButtonV5 variant="outlined" color="primary">
            Outlined
          </ButtonV5>
          <ButtonV5 variant="text" color="primary">
            Text
          </ButtonV5>
        </div>
      </div>
      <div>
        <h4>Secondary</h4>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <ButtonV5 variant="contained" color="secondary">
            Contained
          </ButtonV5>
          <ButtonV5 variant="outlined" color="secondary">
            Outlined
          </ButtonV5>
          <ButtonV5 variant="text" color="secondary">
            Text
          </ButtonV5>
        </div>
      </div>
      <div>
        <h4>Error</h4>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <ButtonV5 variant="contained" color="error">
            Contained
          </ButtonV5>
          <ButtonV5 variant="outlined" color="error">
            Outlined
          </ButtonV5>
          <ButtonV5 variant="text" color="error">
            Text
          </ButtonV5>
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
        <h4>ButtonV5 (MUI)</h4>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <ButtonV5 variant="contained" color="primary">
            Primary
          </ButtonV5>
          <ButtonV5 variant="contained" color="secondary">
            Secondary
          </ButtonV5>
          <ButtonV5 variant="outlined" color="primary">
            Outlined
          </ButtonV5>
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
        story: 'Comparaison entre ButtonV5 (MUI) et Button (Bootstrap).',
      },
    },
  },
};
