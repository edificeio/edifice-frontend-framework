import clsx from 'clsx';
import { KeyboardEvent, MouseEventHandler } from 'react';
import { Badge } from '../../../../components/Badge/index';
import { Image } from '../../../../components/Image/index';

export interface CommunityItemProps {
  title: string;
  communityImage: string;
  onActionClick: MouseEventHandler<HTMLDivElement>;
  nbNotifications?: number;
}

const CommunityItem = ({
  title,
  communityImage,
  nbNotifications,
  onActionClick,
}: CommunityItemProps) => {
  const hasNotifications = (nbNotifications ?? 0) > 0;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onActionClick(
        event as unknown as Parameters<MouseEventHandler<HTMLDivElement>>[0],
      );
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onActionClick}
      onKeyDown={handleKeyDown}
      className={clsx('communities-item', {
        'communities-item-has-notifications': hasNotifications,
      })}
      style={{ width: '25%' }}
    >
      {hasNotifications && (
        <Badge
          className="communities-item-badge"
          variant={{
            level: 'danger',
            type: 'notification',
          }}
        >
          {nbNotifications}
        </Badge>
      )}
      <Image
        className="communities-item-image"
        src={communityImage}
        alt={title}
      />

      <p className="communities-item-title text-truncate text-truncate-2">
        {title}
      </p>
    </div>
  );
};

CommunityItem.displayName = 'CommunityItem';

export default CommunityItem;
