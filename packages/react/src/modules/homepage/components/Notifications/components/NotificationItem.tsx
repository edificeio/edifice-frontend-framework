import { ReactNode } from 'react';
import { Flex, useDate } from '../../../../..';

export type NotificationItemProps = {
  picture: ReactNode;
  message: string;
  date: Date;
  uri?: string;
  children?: ReactNode;
};

const NotificationItem = ({
  picture,
  message,
  date,
  uri,
  children,
}: NotificationItemProps) => {
  const { formatTimeAgo, formatDate } = useDate();

  return (
    <Flex direction="column" className="notification" gap="8">
      <Flex direction="row" gap="8">
        <div className="notification-picture">{picture}</div>
        <a href={uri} data-testid="notification-item">
          <Flex direction="column" gap="8">
            <div
              className="notification-message"
              dangerouslySetInnerHTML={{ __html: message }}
            />
            {children}
            <p className="notification-date" title={formatDate(date, 'LLL')}>
              {formatTimeAgo(date)}
            </p>
          </Flex>
        </a>
      </Flex>
    </Flex>
  );
};

NotificationItem.displayName = 'NotificationItem';

export default NotificationItem;
