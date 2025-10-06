import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { Meta, StoryObj } from '@storybook/react';
import { AntdProvider } from '../../providers/AntdProvider';
import { ButtonV3 } from './ButtonV3';

const meta: Meta<typeof ButtonV3> = {
  title: 'Components/Button-antd',
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
      options: ['filled', 'ghost', 'outline'],
      description: 'Couleur du bouton',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger', 'tertiary'],
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

export const Base: Story = {
  args: {
    color: 'primary',
    variant: 'filled',
    children: 'Label',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    color: 'primary',
    variant: 'filled',
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
    variant: 'filled',
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
    variant: 'filled',
    children: 'New user',
    disabled: false,
    startIcon: <PlusOutlined />,
  },
};

export const WithIconRight: Story = {
  args: {
    color: 'primary',
    variant: 'filled',
    children: 'Close',
    disabled: false,
    endIcon: <SearchOutlined />,
  },
};

export const WithBothIcon: Story = {
  args: {
    color: 'primary',
    variant: 'filled',
    children: 'Button',
    disabled: false,
    startIcon: <PlusOutlined />,
    endIcon: <SearchOutlined />,
  },
};

export const LoadingButtonWithText: Story = {
  args: {
    color: 'primary',
    variant: 'filled',
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
    color: 'primary',
    variant: 'filled',
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
        <ButtonV3 {...args} color="secondary">
          Cancel
        </ButtonV3>
        <ButtonV3 {...args} color="primary">
          Save
        </ButtonV3>
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
        <ButtonV3
          {...args}
          color="danger"
          variant="ghost"
          startIcon={<PlusOutlined />}
          endIcon={<SearchOutlined />}
        >
          Button
        </ButtonV3>
        <ButtonV3
          {...args}
          variant="filled"
          startIcon={<PlusOutlined />}
          endIcon={<SearchOutlined />}
        >
          Button
        </ButtonV3>
        <ButtonV3
          {...args}
          color="secondary"
          variant="outline"
          startIcon={<PlusOutlined />}
          endIcon={<SearchOutlined />}
        >
          Button
        </ButtonV3>
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
        <h4>ButtonV3 (Ant Design)</h4>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <ButtonV3 color="primary">Primary</ButtonV3>
          <ButtonV3 variant="outline" color="primary">
            Secondary
          </ButtonV3>
          <ButtonV3 variant="ghost" color="danger">
            Ghost
          </ButtonV3>
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
        story: 'Comparaison entre ButtonV3 (Ant Design) et Button (Bootstrap).',
      },
    },
  },
};
