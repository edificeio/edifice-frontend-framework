import { NotificationModel } from '@edifice.io/client';
import { Flex } from '../../../..';
import Notification from './Notification';

export type NotificationListProps = {
  /** List of notifications to display */
  notifications: NotificationModel[];
};

const NotificationList = ({ notifications }: NotificationListProps) => {
  return (
    <section role="region" className="notification-list">
      <Flex direction="column" role="list">
        {notifications.map((notification, index) => (
          <div key={index} role="listitem">
            <Notification notification={notification} />
          </div>
        ))}
      </Flex>
    </section>
  );
};

NotificationList.displayName = 'NotificationList';

export default NotificationList;
