import React from 'react';
import { Avatar, Flex, TextSkeleton } from '../../../..';

const NotificationSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((_props, ref) => {
  return (
    <Flex direction="column" className="notification" gap="8" ref={ref}>
      <Flex direction="row" gap="8">
        <div className="notification-picture">
          <Avatar
            alt="Notification Picture"
            variant="circle"
            className="notification-avatar"
          />
        </div>
        <Flex direction="column" gap="8" className="notification-message">
          <TextSkeleton />
          <TextSkeleton />
          <div className="placeholder col-4" style={{ height: '2rem' }}></div>
          <TextSkeleton className="col-2" />
        </Flex>
      </Flex>
    </Flex>
  );
});

NotificationSkeleton.displayName = 'NotificationSkeleton';

export default NotificationSkeleton;
