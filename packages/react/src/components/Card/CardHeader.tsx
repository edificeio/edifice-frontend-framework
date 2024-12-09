import { useTranslation } from 'react-i18next';
import { IconOptions } from '../../modules/icons/components';
import { IconButton } from '../Button';
import { useCardContext } from './CardContext';

const CardHeader = () => {
  const { isSelectable, isClickable, onClick, onSelect } = useCardContext();
  const { t } = useTranslation();

  const isActive = isSelectable || isClickable;
  return isActive ? (
    <div className="card-header">
      {isSelectable ? (
        <IconButton
          aria-label={t('card.open.menu')}
          className="z-3 bg-white"
          color="secondary"
          icon={<IconOptions />}
          onClick={onSelect}
          variant="ghost"
        />
      ) : null}
      {isClickable ? (
        <button
          type="button"
          onClick={onClick}
          className="position-absolute bottom-0 end-0 top-0 start-0 opacity-0 z-1 w-100"
          aria-label={t('card.open.resource')}
        />
      ) : null}
    </div>
  ) : null;
};

CardHeader.displayName = 'Card.Header';

export default CardHeader;
