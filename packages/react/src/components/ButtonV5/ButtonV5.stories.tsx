import type { Meta, StoryObj } from '@storybook/react';
import { ButtonV5 } from './ButtonV5';
import { ThemeProvider } from '@mui/material/styles';
import { muiTheme } from '../../theme';
import { Add, Search, Home } from '@mui/icons-material';

const meta: Meta<typeof ButtonV5> = {
  title: 'Components/Button-mui',
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

export const Base: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    children: 'Label',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    children: 'Label',
    disabled: true,
  },

  parameters: {
    docs: {
      description: {
        story: 'Add the disabled props to the button to disable it.',
      },
    },
  },
};

export const Danger: Story = {
  args: {
    variant: 'contained',
    color: 'error',
    children: 'Label',
    disabled: false,
  },

  parameters: {
    docs: {
      description: {
        story:
          'Used for destructive actions and warning the user of an important action.',
      },
    },
  },
};

export const WithIconLeft: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    children: 'New user',
    disabled: false,
    startIcon: <Add />,
  },
};

export const WithIconRight: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    children: 'Close',
    disabled: false,
    endIcon: <Search />,
  },
};

export const WithBothIcon: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    children: 'Button',
    disabled: false,
    startIcon: <Add />,
    endIcon: <Search />,
  },
};

export const LoadingButtonWithText: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    children: 'Loading...',
    loading: true,
  },

  parameters: {
    docs: {
      description: {
        story:
          'Loading button is not disabled but we have `pointer-events:none` to desactive its behaviour. You can add the disabled props if you want. Default position of the loading icon is on the left.',
      },
    },
  },
};

export const LoadingButtonRightWithText: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    children: 'Loading...',
    loading: true,
  },

  parameters: {
    docs: {
      description: {
        story:
          "You can change the position of the loading icon by adding `loadingPosition='right'`",
      },
    },
  },
};

export const ButtonGroupWithSecondaryAction: Story = {
  render: (args) => {
    return (
      <div className="d-flex align-items-center gap-8">
        <ButtonV5 {...args} variant="outlined" color="secondary">
          Cancel
        </ButtonV5>
        <ButtonV5 {...args} variant="contained" color="secondary">
          Save
        </ButtonV5>
      </div>
    );
  },

  parameters: {
    docs: {
      description: {
        story:
          'When more than one buttons, primary action is always on the right side. Then secondary action on its left.',
      },
    },
  },
};

export const ButtonGroupWithThirdAction: Story = {
  render: (args) => {
    return (
      <div className="d-flex align-items-center gap-8">
        <ButtonV5
          {...args}
          variant="text"
          color="primary"
          startIcon={<Add />}
          endIcon={<Search />}
        >
          Button
        </ButtonV5>
        <ButtonV5
          {...args}
          variant="outlined"
          color="primary"
          startIcon={<Add />}
          endIcon={<Search />}
        >
          Button
        </ButtonV5>
        <ButtonV5
          {...args}
          variant="contained"
          color="primary"
          startIcon={<Add />}
          endIcon={<Search />}
        >
          Button
        </ButtonV5>
      </div>
    );
  },

  parameters: {
    docs: {
      description: {
        story:
          'When more than two buttons, third action is furthest to the left.',
      },
    },
  },
};

// Comparaison avec le Button de base
export const ComparisonWithBaseButton: Story = {
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
          <ButtonV5 variant="outlined" color="secondary">
            Secondary Outline
          </ButtonV5>
          <ButtonV5 variant="text" color="error">
            Error Text
          </ButtonV5>
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
        story: 'Comparaison entre ButtonV5 (MUI) et Button (Bootstrap).',
      },
    },
  },
};
