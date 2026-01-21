import { Meta, StoryObj } from '@storybook/react';
import PromotionCard, { PromotionCardProps } from './PromotionCard';
import { Button } from '../Button';
import { IconEdit, IconMinus, IconPlus } from '../../modules/icons/components';

const meta: Meta<typeof PromotionCard> = {
  title: 'Components/PromotionCard',
  component: PromotionCard,
  parameters: {
    docs: {
      description: {
        component:
          'The PromotionCard component is used to display promotional content in a card format.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PromotionCard>;

export const Base: Story = {
  render: () => {
    return (
      <PromotionCard>
        <PromotionCard.Header backgroundColor="#FFEFE3">
          2 min
        </PromotionCard.Header>
        <PromotionCard.Icon
          backgroundColor="#FFEFE3"
          icon={<IconEdit color="#FF8D2E" />}
        />
        <PromotionCard.Body>
          <PromotionCard.Title>Création Libre</PromotionCard.Title>
          <PromotionCard.Description>
            Vous n'avez pas peur de la "page blanche" ? Lancez-vous pour créer
            votre cours ou votre document !
          </PromotionCard.Description>
        </PromotionCard.Body>
        <PromotionCard.Footer>
          <Button
            color="tertiary"
            variant="ghost"
            size="sm"
            onClick={() => {}}
            leftIcon={<IconPlus />}
          >
            Nouvelle page
          </Button>
        </PromotionCard.Footer>
      </PromotionCard>
    );
  },
};

export const WithCustomBorder: Story = {
  args: {
    borderColor: '#FF8D2E',
  },
  render: (args: PromotionCardProps) => {
    return (
      <PromotionCard {...args}>
        <PromotionCard.Header backgroundColor="#FFEFE3">
          2 min
        </PromotionCard.Header>
        <PromotionCard.Icon
          backgroundColor="#FFEFE3"
          icon={<IconEdit color="#FF8D2E" />}
        />
        <PromotionCard.Body>
          <PromotionCard.Title>Création Libre</PromotionCard.Title>
          <PromotionCard.Description>
            Vous n'avez pas peur de la "page blanche" ? Lancez-vous pour créer
            votre cours ou votre document !
          </PromotionCard.Description>
        </PromotionCard.Body>
        <PromotionCard.Footer>
          <Button
            color="tertiary"
            variant="ghost"
            size="sm"
            onClick={() => {}}
            leftIcon={<IconPlus />}
          >
            Nouvelle page
          </Button>
        </PromotionCard.Footer>
      </PromotionCard>
    );
  },
};

export const WithCustomBackground: Story = {
  args: {
    backgroundColor: '#f2f2f2',
  },
  render: (args: PromotionCardProps) => {
    return (
      <PromotionCard {...args}>
        <PromotionCard.Header backgroundColor="#FFEFE3">
          2 min
        </PromotionCard.Header>
        <PromotionCard.Icon
          backgroundColor="#FFEFE3"
          icon={<IconEdit color="#FF8D2E" />}
        />
        <PromotionCard.Body>
          <PromotionCard.Title>Création Libre</PromotionCard.Title>
          <PromotionCard.Description>
            Vous n'avez pas peur de la "page blanche" ? Lancez-vous pour créer
            votre cours ou votre document !
          </PromotionCard.Description>
        </PromotionCard.Body>
        <PromotionCard.Footer>
          <Button
            color="tertiary"
            variant="ghost"
            size="sm"
            onClick={() => {}}
            leftIcon={<IconPlus />}
          >
            Nouvelle page
          </Button>
          <Button
            color="tertiary"
            variant="ghost"
            size="sm"
            onClick={() => {}}
            leftIcon={<IconMinus />}
          >
            Autre action
          </Button>
        </PromotionCard.Footer>
      </PromotionCard>
    );
  },
};
