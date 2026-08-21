import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonBeta } from '../../../../..';
import { IconFilter, IconRafterDown } from '../../../../icons/components';
import NotificationFilterModal from './NotificationFilterModal';

export type NotificationFilterMenuProps = {
  /** All notification types available */
  notificationTypes: string[];
  /** Notification types currently applied as filter */
  selectedTypes: string[];
  /** Callback when the user validates a new filter selection */
  onFilterChange: (types: string[]) => void;
};

/**
 * Trigger button opening the notification types filter modal.
 */
const NotificationFilterMenu = ({
  notificationTypes,
  selectedTypes,
  onFilterChange,
}: NotificationFilterMenuProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleApply = (types: string[]) => {
    onFilterChange(types);
    setIsOpen(false);
  };

  return (
    <>
      <ButtonBeta
        type="button"
        color="secondary"
        variant="outline"
        size="md"
        leftIcon={<IconFilter />}
        rightIcon={<IconRafterDown />}
        aria-label={t('homepage.notifications.filter-modal.trigger', {
          defaultValue: 'Filtrer les notifications',
        })}
        title={t('homepage.notifications.filter-modal.trigger', {
          defaultValue: 'Filtrer les notifications',
        })}
        onClick={() => setIsOpen(true)}
        data-testid="notification-filter-button"
      />
      {isOpen && (
        <NotificationFilterModal
          isOpen={isOpen}
          allTypes={notificationTypes}
          appliedTypes={selectedTypes}
          onCancel={() => setIsOpen(false)}
          onApply={handleApply}
        />
      )}
    </>
  );
};

NotificationFilterMenu.displayName = 'NotificationFilterMenu';

export default NotificationFilterMenu;
