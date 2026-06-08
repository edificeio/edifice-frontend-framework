import { Divider } from '../../../..';
import NotificationSkeleton from './NotificationSkeleton';

const NotificationListSkeleton = () => {
  return (
    <ul>
      <li>
        <NotificationSkeleton />
        <Divider className="border-grey-300 my-0" />
      </li>
      <li>
        <NotificationSkeleton />
        <Divider className="border-grey-300 my-0" />
      </li>
      <li>
        <NotificationSkeleton />
      </li>
    </ul>
  );
};

NotificationListSkeleton.displayName = 'NotificationListSkeleton';

export default NotificationListSkeleton;
