import PromotionCardBody from './PromotionCardBody';
import PromotionCardDescription from './PromotionCardDescription';
import PromotionCardFooter from './PromotionCardFooter';
import PromotionCardHeader from './PromotionCardHeader';
import PromotionCardIcon from './PromotionCardIcon';
import PromotionCardTitle from './PromotionCardTitle';
import clsx from 'clsx';

export interface PromotionCardProps {
  children: React.ReactNode;
  borderColor?: string;
  backgroundColor?: string;
  className?: string;
}

/**
 * Promotion Card component to display promotional features in a card format.
 *
 * The component PromotionCard is a Compound Component composed of:
 * - PromotionCardHeader: information on the top right corner
 * - PromotionCardIcon: Icon on the left side (background color and Icon)
 * - PromotionCardBody:
 *   - PromotionCardTitle: Card Title
 *   - PromotionCardDescription: Card Description
 *   - PromotionCardAction: Card Action (mainly a button with a onClick action)
 *
 * @example
 * <PromotionCard>
 *   <PromotionCard.Header backgroundColor="#faea9c">
 *     header content
 *   </PromotionCard.Header>
 *   <PromotionCard.Icon
 *     backgroundColor="#FFEFE3"
 *     icon={<IconEdit color="#FF8D2E" />}
 *   />
 *   <PromotionCard.Body>
 *     <PromotionCard.Title>Création Libre</PromotionCard.Title>
 *     <PromotionCard.Description>
 *       Vous n'avez pas peur de la "page blanche" ? Lancez-vous pour créer
 *       votre cours ou votre document !
 *     </PromotionCard.Description>
 *     <PromotionCard.Actions>
 *       <Button
 *         color="tertiary"
 *         variant="ghost"
 *         size="sm"
 *         onClick={() => {}}
 *         leftIcon={<IconPlus />}
 *       >
 *         Nouvelle page
 *       </Button>
 *     </PromotionCard.Actions>
 *   </PromotionCard.Body>
 * </PromotionCard>
 */
export const Root = ({
  children,
  borderColor,
  backgroundColor,
  className,
}: PromotionCardProps) => {
  const classNames = clsx('promotion-card', className);

  return (
    <div className={classNames} style={{ borderColor, backgroundColor }}>
      {children}
    </div>
  );
};

const PromotionCard = Object.assign(Root, {
  Header: PromotionCardHeader,
  Body: PromotionCardBody,
  Icon: PromotionCardIcon,
  Title: PromotionCardTitle,
  Description: PromotionCardDescription,
  Footer: PromotionCardFooter,
});

export default PromotionCard;
