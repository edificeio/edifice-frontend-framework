import type { Meta, StoryObj } from '@storybook/react';
import { ChakraProvider } from '@chakra-ui/react';
import { ButtonV2 } from './index';
import theme from '../../theme';

const meta: Meta<typeof ButtonV2> = {
  title: 'Components/Button-chakra',
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

export const Base: Story = {
  args: {
    color: 'primary',
    variant: 'solid',
    children: 'Label',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    color: 'primary',
    variant: 'solid',
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
    color: 'danger',
    variant: 'solid',
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
    color: 'primary',
    variant: 'solid',
    children: 'New user',
    disabled: false,
    leftIcon: '→',
  },
};

export const WithIconRight: Story = {
  args: {
    color: 'primary',
    variant: 'solid',
    children: 'Close',
    disabled: false,
    rightIcon: '×',
  },
};

export const WithBothIcon: Story = {
  args: {
    color: 'primary',
    variant: 'solid',
    children: 'Button',
    disabled: false,
    leftIcon: '←',
    rightIcon: '→',
  },
};

export const LoadingButtonWithText: Story = {
  args: {
    color: 'primary',
    variant: 'solid',
    children: 'Loading...',
    isLoading: true,
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
    color: 'primary',
    variant: 'solid',
    children: 'Loading...',
    isLoading: true,
    loadingPosition: 'right',
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
        <ButtonV2 {...args} color="secondary" variant="outline">
          Cancel
        </ButtonV2>
        <ButtonV2 {...args} color="secondary" variant="solid">
          Save
        </ButtonV2>
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
        <ButtonV2
          {...args}
          color="primary"
          variant="ghost"
          leftIcon="←"
          rightIcon="→"
        >
          Button
        </ButtonV2>
        <ButtonV2
          {...args}
          color="primary"
          variant="outline"
          leftIcon="←"
          rightIcon="→"
        >
          Button
        </ButtonV2>
        <ButtonV2
          {...args}
          color="primary"
          variant="solid"
          leftIcon="←"
          rightIcon="→"
        >
          Button
        </ButtonV2>
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
        <h4>ButtonV2 (Chakra UI)</h4>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <ButtonV2 color="primary" variant="solid">
            Primary
          </ButtonV2>
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
