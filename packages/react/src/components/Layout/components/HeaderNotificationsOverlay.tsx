import { NotificationListContainer } from '../../../modules/homepage/components/Notifications/NotificationListContainer';
import PageLayoutOverlay from '../../PageLayout/components/PageLayoutOverlay';
import { useOverlay } from '../../PageLayout/hook/useOverlay';

const HeaderNotificationsOverlay = () => {
  const { isOverlayOpen, updateOverlayOpen } = useOverlay();
  const handleClose = () => updateOverlayOpen(false);

  return (
    // NotificationList renders its own header with a close button, so
    // PageLayoutOverlay's default close button would be redundant (double X).
    <PageLayoutOverlay onClose={handleClose} closeButton={false}>
      {isOverlayOpen && (
        <NotificationListContainer onCloseNotifications={handleClose} />
      )}
    </PageLayoutOverlay>
  );
};

HeaderNotificationsOverlay.displayName = 'Layout.HeaderNotificationsOverlay';

export default HeaderNotificationsOverlay;
