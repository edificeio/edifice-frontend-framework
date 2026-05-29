import { ReactNode } from 'react';
import { Flex, useDate } from '../../../../..';

export type NotificationItemProps = {
  picture: ReactNode;
  message: string;
  date: Date;
  uri?: string;
  children?: ReactNode;
};

/**
 * Base layout for a single notification row.
 *
 * Renders a picture slot (avatar or app icon), a clickable message linking to
 * `uri`, a relative timestamp (e.g. "2 hours ago"), and an optional `children`
 * area for extra content below the message.
 *
 * This is a presentational component — it does not know whether the
 * notification comes from a user or a system event. Use `UserNotification` or
 * `SystemNotification` instead of consuming this directly.
 */
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
