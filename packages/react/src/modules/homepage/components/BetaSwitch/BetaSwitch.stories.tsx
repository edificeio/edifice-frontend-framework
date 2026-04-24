import type { Meta, StoryObj } from '@storybook/react';
import BetaSwitch, { BetaSwitchProps } from './BetaSwitch';

const meta: Meta<typeof BetaSwitch> = {
  title: 'Modules/Homepage/BetaSwitch',
  component: BetaSwitch,
  parameters: {
    docs: {
      description: {
        component:
          "Ce storybook documente le composant BetaSwitch, un bandeau permettant à l'utilisateur de désactiver la version bêta de la page d'accueil.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof BetaSwitch>;

const renderWithProps = (props: BetaSwitchProps) => () => (
  <div style={{ maxWidth: 640 }}>
    <BetaSwitch {...props} />
  </div>
);

export const Default: Story = {
  render: renderWithProps({
    isSwitching: false,
    onSwitchClick: () => alert('Switch clicked'),
  }),
  parameters: {
    docs: {
      description: {
        story: `
État par défaut du composant.
<ul>
<li>Affiche un titre, une description et un bouton</li>
<li>Le bouton est actif et cliquable</li>
<li>Callback déclenché au clic sur le bouton</li>
</ul>`,
      },
    },
  },
};

export const Loading: Story = {
  render: renderWithProps({
    isSwitching: true,
    onSwitchClick: () => alert('Switch clicked'),
  }),
  parameters: {
    docs: {
      description: {
        story: `État de chargement : le bouton est désactivé et affiche un loader pendant l'appel API.`,
      },
    },
  },
};
