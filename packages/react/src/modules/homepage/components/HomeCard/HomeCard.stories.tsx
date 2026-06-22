import { Meta, StoryObj } from '@storybook/react-vite';

import hillsBackground from '@edifice.io/bootstrap/dist/images/backgrounds/hills.svg';
import { ButtonBeta, Flex } from '../../../../components';
import {
  IconArrowRight,
  IconClose,
  IconSettings,
} from '../../../icons/components';
import HomeCard, { HomeCardProps } from './HomeCard';

const meta: Meta<typeof HomeCard> = {
  title: 'Modules/Homepage/HomeCard',
  component: HomeCard,
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: '100vh',
          padding: '4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: `url(${hillsBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Compound component utilisé sur la homepage. Compose un `Header` (titre + bouton optionnel) et un `Content`. Trois variantes : `user`, `primary`, `secondary`.',
      },
    },
  },
  argTypes: {
    variant: {
      options: ['user', 'primary', 'secondary'],
      control: { type: 'radio' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof HomeCard>;

const renderCard = (args: HomeCardProps) => (
  <div style={{ maxWidth: 400 }}>
    <HomeCard {...args}>
      <HomeCard.Header
        title="Mes infos"
        actionLabel="Voir plus"
        actionRightIcon={<IconArrowRight />}
        onActionClick={() => alert('Action clicked')}
      />
      <HomeCard.Content>
        <p>Contenu de la carte. À remplacer par le contenu utile.</p>
      </HomeCard.Content>
    </HomeCard>
  </div>
);

export const User: Story = {
  args: { variant: 'user' },
  render: renderCard,
  parameters: {
    docs: {
      description: { story: 'Variante `user` — padding 16, gap 16.' },
    },
  },
};

export const Primary: Story = {
  args: { variant: 'primary' },
  render: renderCard,
  parameters: {
    docs: {
      description: {
        story:
          'Variante `primary` — padding 8/16/16/16, gap 8. Titre en font title.',
      },
    },
  },
};

export const Secondary: Story = {
  args: { variant: 'secondary' },
  render: renderCard,
  parameters: {
    docs: {
      description: {
        story:
          'Variante `secondary` — padding 8/16/16/16, gap 4, fond grey-100, titre en font body bold/small.',
      },
    },
  },
};

export const WithoutAction: Story = {
  args: { variant: 'primary' },
  render: (args: HomeCardProps) => (
    <div style={{ maxWidth: 400 }}>
      <HomeCard {...args}>
        <HomeCard.Header title="Titre simple" />
        <HomeCard.Content>
          <p>Pas de bouton dans le header.</p>
        </HomeCard.Content>
      </HomeCard>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Le bouton du `Header` n'est rendu que si `actionLabel` ET `onActionClick` sont fournis.",
      },
    },
  },
};

export const Nested: Story = {
  args: { variant: 'primary' },
  render: (args: HomeCardProps) => (
    <div style={{ maxWidth: 400 }}>
      <HomeCard {...args}>
        <HomeCard.Header
          title="Mes infos"
          actionLabel="Voir plus"
          actionRightIcon={<IconArrowRight />}
          onActionClick={() => alert('Action clicked')}
        />
        <HomeCard.Content>
          <HomeCard variant="secondary">
            <HomeCard.Header
              title="Sous-section"
              actionLabel="Voir"
              onActionClick={() => alert('Sous-action')}
            />
            <HomeCard.Content>
              <p>Contenu de la sous-carte secondary imbriquée.</p>
            </HomeCard.Content>
          </HomeCard>
        </HomeCard.Content>
      </HomeCard>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Carte `primary` contenant une carte `secondary` imbriquée dans son `Content` — illustre la composition de variantes.',
      },
    },
  },
};

export const CustomHeader: Story = {
  args: { variant: 'primary' },
  render: (args: HomeCardProps) => (
    <div style={{ maxWidth: 400 }}>
      <HomeCard {...args}>
        <Flex
          align="center"
          justify="between"
          gap="8"
          className="home-card-header"
        >
          <Flex align="center" gap="8">
            <IconSettings />
            <h3 className="home-card-header-title">Paramètres du widget</h3>
          </Flex>
          <ButtonBeta
            color="default"
            variant="ghost"
            aria-label="Fermer"
            onClick={() => alert('Fermer')}
            leftIcon={<IconClose />}
          />
        </Flex>
        <HomeCard.Content>
          <p>Contenu de la carte. À remplacer par le contenu utile.</p>
        </HomeCard.Content>
      </HomeCard>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Le slot `Header` accepte n'importe quel contenu : ici un header custom avec une icône à gauche du titre et un bouton de fermeture à droite, sans utiliser `HomeCard.Header`.",
      },
    },
  },
};
