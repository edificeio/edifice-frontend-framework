import { Icon } from '..';
import { IconButton } from '../Button';
import { useCardContext } from './CardContext';

const CardHeader = () => {
  const { isSelectable, isClickable, onClick, onSelect } = useCardContext();
  const isActive = isSelectable || isClickable;
  return isActive ? (
    <div className="card-header">
      {isSelectable ? (
        <IconButton
          aria-label="Open Action Bar"
          className="z-3 bg-white"
          color="secondary"
          icon={<Icon name="options" />}
          onClick={onSelect}
          variant="ghost"
        />
      ) : null}
      {isClickable ? (
        <button
          onClick={onClick}
          className="position-absolute bottom-0 end-0 top-0 start-0 opacity-0 z-1 w-100"
          aria-label="Open resource"
        />
      ) : null}
    </div>
  ) : null;
};

CardHeader.displayName = 'Card.Header';

export default CardHeader;