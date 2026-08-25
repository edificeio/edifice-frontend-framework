import illuEmptyNotification from '@edifice.io/bootstrap/dist/images/homepage/illu-empty-notifications.png';
import { NotificationModel } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';
import {
  ButtonBeta,
  Divider,
  EmptyScreen,
  Flex,
  useInfiniteScroll,
} from '../../../..';
import { IconClose } from '../../../icons/components';
import NotificationFilterMenu from './components/NotificationFilterMenu';
import NotificationItem from './NotificationItem';
import NotificationListSkeleton from './NotificationListSkeleton';
import NotificationSkeleton from './NotificationSkeleton';

export type NotificationListProps = {
  /** List of notifications to display */
  notifications?: NotificationModel[];

  /** All notification types available to filter on */
  notificationTypes?: string[];
  /** Notification types currently applied as filter */
  selectedTypes?: string[];
  /** Callback when the user validates a new filter selection */
  onFilterChange?: (types: string[]) => void;

  /** Callback when the notifications list is closed */
  onCloseNotifications?: () => void;

  /** Callback to load the next page of notifications, used for infinite scrolling */
  onLoadNextPage?: () => void;
  /** Indicates if there are more notifications to load, used for infinite scrolling */
  hasNextPage?: boolean;
  /** Loading state for fetching notifications, used to prevent multiple simultaneous fetches */
  isLoading?: boolean;
};

const NotificationList = ({
  notifications,
  notificationTypes,
  selectedTypes,
  onFilterChange,
  onCloseNotifications,
  onLoadNextPage,
  hasNextPage,
  isLoading,
}: NotificationListProps) => {
  const { t } = useTranslation();

  const loadNextRef = useInfiniteScroll({
    callback: () => onLoadNextPage?.(),
  });

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
          className="py-16 ps-24 pe-8"
        >
          <Flex align="center" gap="8" className="notification-list-title">
            <h4 className="text-truncate">
              {t('homepage.notifications-list.title')}
            </h4>
            {notificationTypes && notificationTypes.length > 0 && (
              <NotificationFilterMenu
                notificationTypes={notificationTypes}
                selectedTypes={selectedTypes ?? notificationTypes}
                onFilterChange={(types) => onFilterChange?.(types)}
              />
            )}
          </Flex>
          {onCloseNotifications && (
            <ButtonBeta
              color="tertiary"
              variant="ghost"
              rightIcon={<IconClose />}
              onClick={handleCloseClick}
              aria-label={t('homepage.notifications-list.close')}
              title={t('homepage.notifications-list.close')}
              data-testid="notification-list-close-button"
            ></ButtonBeta>
          )}
        </Flex>
        {notifications?.length === 0 ? (
          <div className="mx-24">
            <EmptyScreen
              size={135}
              imageSrc={illuEmptyNotification}
              imageAlt={t('homepage.notifications-list.empty.description')}
              text={t('homepage.notifications-list.empty.description')}
            />
          </div>
        ) : (
          <>
            <ul>
              {notifications?.map((notification, index) => (
                <li key={'notification-list-' + notification._id + '-' + index}>
                  <NotificationItem notification={notification} />
                  <Divider className="border-grey-300 my-0" />
                </li>
              ))}
            </ul>
            {hasNextPage && <NotificationSkeleton ref={loadNextRef} />}
            {isLoading && <NotificationListSkeleton />}
          </>
        )}
      </Flex>
    </section>
  );
};

NotificationList.displayName = 'NotificationList';

export default NotificationList;
