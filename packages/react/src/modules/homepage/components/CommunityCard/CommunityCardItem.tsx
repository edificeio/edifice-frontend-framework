import clsx from 'clsx';
import { MouseEventHandler } from 'react';
import { Badge } from '../../../../components/Badge/index';
import { Image } from '../../../../components/Image/index';

export interface CommunityCardItemProps {
  title: string;
  communityImage: string;
  onActionClick: MouseEventHandler<HTMLDivElement>;
  nbNotifications?: number;
}

const CommunityCardItem = ({
  title,
  communityImage,
  nbNotifications,
  onActionClick,
}: CommunityCardItemProps) => {
  const hasNotifications = (nbNotifications ?? 0) > 0;

  return (
    <div
      role="button"
      onClick={onActionClick}
      className={clsx('community-card-item', {
        'community-card-item-has-notifications': hasNotifications,
      })}
      style={{ width: '25%' }}
    >
      {hasNotifications && (
        <Badge
          className="community-card-item-badge"
          variant={{
            level: 'danger',
            type: 'notification',
          }}
        >
          {nbNotifications}
        </Badge>
      )}
      <Image
        className="community-card-item-image"
        src={communityImage}
        alt={title}
      />

      <p className="community-card-item-title text-truncate text-truncate-2">
        {title}
      </p>
    </div>
  );
};

CommunityCardItem.displayName = 'CommunityCardItem';

export default CommunityCardItem;
