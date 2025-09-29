import type { Meta, StoryObj } from '@storybook/react';
import { ButtonV4 } from './ButtonV4';
import { MantineProvider } from '../../providers/MantineProvider';
import { IconPlus, IconSearch } from '@tabler/icons-react';

const meta: Meta<typeof ButtonV4> = {
  title: 'Components/Button-mantine',
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

export const Base: Story = {
  args: {
    variant: 'filled',
    color: 'primary',
    children: 'Label',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    variant: 'filled',
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
    variant: 'filled',
    color: 'danger',
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
    variant: 'filled',
    color: 'primary',
    children: 'New user',
    disabled: false,
    leftSection: <IconPlus size={16} />,
  },
};

export const WithIconRight: Story = {
  args: {
    variant: 'filled',
    color: 'primary',
    children: 'Close',
    disabled: false,
    rightSection: <IconSearch size={16} />,
  },
};

export const WithBothIcon: Story = {
  args: {
    variant: 'filled',
    color: 'primary',
    children: 'Button',
    disabled: false,
    leftSection: <IconPlus size={16} />,
    rightSection: <IconSearch size={16} />,
  },
};

export const LoadingButtonWithText: Story = {
  args: {
    variant: 'filled',
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
    variant: 'filled',
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
        <ButtonV4 {...args} variant="outline" color="secondary">
          Cancel
        </ButtonV4>
        <ButtonV4 {...args} variant="filled" color="secondary">
          Save
        </ButtonV4>
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
        <ButtonV4
          {...args}
          variant="light"
          color="primary"
          leftSection={<IconPlus size={16} />}
          rightSection={<IconSearch size={16} />}
        >
          Button
        </ButtonV4>
        <ButtonV4
          {...args}
          variant="outline"
          color="primary"
          leftSection={<IconPlus size={16} />}
          rightSection={<IconSearch size={16} />}
        >
          Button
        </ButtonV4>
        <ButtonV4
          {...args}
          variant="filled"
          color="primary"
          leftSection={<IconPlus size={16} />}
          rightSection={<IconSearch size={16} />}
        >
          Button
        </ButtonV4>
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
        <h4>ButtonV4 (Mantine)</h4>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <ButtonV4 variant="filled" color="primary">
            Primary
          </ButtonV4>
          <ButtonV4 variant="outline" color="secondary">
            Secondary Outline
          </ButtonV4>
          <ButtonV4 variant="light" color="danger">
            Danger Light
          </ButtonV4>
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
        story: 'Comparaison entre ButtonV4 (Mantine) et Button (Bootstrap).',
      },
    },
  },
};
