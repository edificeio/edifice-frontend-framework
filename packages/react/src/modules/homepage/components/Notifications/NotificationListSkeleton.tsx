import { Divider } from '../../../..';
import NotificationSkeleton from './NotificationSkeleton';

// Enough placeholders to cover most screen heights; the overflow is clipped.
const SKELETON_COUNT = 8;

const NotificationListSkeleton = () => {
  return (
    <ul className="notification-list-skeleton" aria-hidden="true">
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <li key={index}>
          <NotificationSkeleton />
          {index < SKELETON_COUNT - 1 && (
            <Divider className="border-grey-300 my-0" />
          )}
        </li>
      ))}
    </ul>
  );
};

NotificationListSkeleton.displayName = 'NotificationListSkeleton';

export default NotificationListSkeleton;
