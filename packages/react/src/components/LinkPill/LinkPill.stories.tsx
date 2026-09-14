import { Meta, StoryObj } from '@storybook/react-vite';
import LinkPill from './LinkPill';

const meta: Meta<typeof LinkPill> = {
  title: 'Components/LinkPill',
  component: LinkPill,
  args: {
    href: 'https://example.com',
    label: 'Nom du lien',
  },
  argTypes: {
    illustrationType: {
      options: ['icon', 'img'],
      control: { type: 'inline-radio' },
    },
    illustrationPosition: {
      options: ['left', 'right'],
      control: { type: 'inline-radio' },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'LinkPill displays a link to an external resource as a small rounded pill (icon/image + label). It always opens its href in a new tab.',
      },
    },
  },
  decorators: [(Story) => <div style={{ maxWidth: '340px' }}>{Story()}</div>],
};

export default meta;
type Story = StoryObj<typeof LinkPill>;

export const Base: Story = {};

export const IllustrationRight: Story = {
  args: {
    illustrationPosition: 'right',
  },
};

export const ImageIllustration: Story = {
  args: {
    illustrationType: 'img',
    illustration: <img src="https://placehold.co/72x72" alt="" />,
  },
};

export const WithSubtitle: Story = {
  args: {
    label: 'Physique - Chimie',
    subtitle: 'Mme Martin',
  },
  parameters: {
    docs: {
      description: {
        story:
          'An optional subtitle can be displayed below the label; it does not change the label font size.',
      },
    },
  },
};

export const LongLabel: Story = {
  args: {
    label:
      'Le règlement général sur la protection des données (RGPD) - mode d’emploi complet pour les établissements',
  },
  parameters: {
    docs: {
      description: {
        story: 'The label is truncated with an ellipsis on a single line.',
      },
    },
  },
};
