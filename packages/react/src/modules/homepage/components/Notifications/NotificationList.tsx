import { NotificationModel } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';
import { IconClose } from 'src/modules/icons/components';
import { ButtonBeta, EmptyScreen, Flex } from '../../../..';

import illuEmptyNotification from '@edifice.io/bootstrap/dist/images/emptyscreen/illu-notifications.png';
import Notification from './Notification';

export type NotificationListProps = {
  /** List of notifications to display */
  notifications: NotificationModel[];

  /** Callback when the notifications list is closed */
  onCloseNotifications?: () => void;
};

const NotificationList = ({
  notifications,
  onCloseNotifications,
}: NotificationListProps) => {
  const { t } = useTranslation();

  const handleCloseClick = () => {
    if (onCloseNotifications) {
      onCloseNotifications();
    }
  };

  return (
    <section role="region" className="notification-list">
      <Flex direction="column">
        <Flex
          justify="between"
          align="center"
          wrap="nowrap"
          className="notification-list-header py-16 ps-24 pe-8"
        >
          <h4 className="notification-list-title text-truncate">
            {t('homepage.widget.notifications-list.title')}
          </h4>
          {onCloseNotifications && (
            <ButtonBeta
              color="tertiary"
              variant="ghost"
              className="notification-list-close"
              rightIcon={<IconClose />}
              onClick={handleCloseClick}
              aria-label={t('homepage.widget.notifications-list.close')}
              title={t('homepage.widget.notifications-list.close')}
              data-testid="notification-list-close-button"
            ></ButtonBeta>
          )}
        </Flex>
        {notifications.length === 0 ? (
          <div className="mx-24">
            <EmptyScreen
              size={120}
              imageSrc={illuEmptyNotification}
              imageAlt={t(
                'homepage.widget.notifications-list.empty.description',
              )}
              text={t('homepage.widget.notifications-list.empty.description')}
            />
          </div>
        ) : (
          <Flex direction="column" role="list">
            {notifications.map((notification, index) => (
              <div key={index} role="listitem">
                <Notification notification={notification} />
              </div>
            ))}
          </Flex>
        )}
      </Flex>
    </section>
  );
};

NotificationList.displayName = 'NotificationList';

export default NotificationList;
