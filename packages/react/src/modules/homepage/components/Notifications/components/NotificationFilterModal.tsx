import clsx from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppIcon, ButtonBeta, Checkbox, Flex, Modal } from '../../../../..';
import { IconCheck } from '../../../../icons/components';
import { getAppCodeAndI18nKey } from './notificationAdapter';

export type NotificationFilterModalProps = {
  isOpen: boolean;
  /** All notification types available */
  allTypes: string[];
  /** Notification types currently applied as filter */
  appliedTypes: string[];
  onCancel: () => void;
  onApply: (types: string[]) => void;
};

/**
 * Modal letting the user choose which notification types to display in the
 * homepage notifications list.
 */
const NotificationFilterModal = ({
  isOpen,
  allTypes,
  appliedTypes,
  onCancel,
  onApply,
}: NotificationFilterModalProps) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string[]>(appliedTypes);

  const toggleType = (type: string) => {
    setSelected((current) =>
      current.includes(type)
        ? current.filter((value) => value !== type)
        : [...current, type],
    );
  };

  const toggleAll = () => {
    setSelected(selected.length === allTypes.length ? [] : allTypes);
  };

  return (
    <Modal
      id="notification-filter-modal"
      size="lg"
      scrollable
      isOpen={isOpen}
      onModalClose={onCancel}
    >
      <Modal.Header onModalClose={onCancel}>
        {t('homepage.notifications.filter-modal.title', {
          defaultValue: 'Filtrer les notifications',
        })}
      </Modal.Header>
      <Modal.Subtitle>
        {t('homepage.notifications.filter-modal.subtitle', {
          defaultValue:
            'Sélectionnez seulement les notifications importantes pour vous',
        })}
      </Modal.Subtitle>
      <Modal.Body>
        <Flex align="center" gap="8" className="mb-16">
          <div className="notification-filter-select-all">
            <Checkbox
              label={t('homepage.notifications.filter-modal.select-all', {
                defaultValue: 'Tout sélectionner',
              })}
              checked={selected.length === allTypes.length}
              indeterminate={
                selected.length > 0 && selected.length < allTypes.length
              }
              onChange={toggleAll}
            />
          </div>
          <span className="notification-filter-count">
            {t('homepage.notifications.filter-modal.count', {
              selected: selected.length,
              total: allTypes.length,
              defaultValue: '[[selected]] / [[total]] sélectionnées',
            })}
          </span>
        </Flex>
        <Flex wrap="wrap" gap="8" className="notification-filter-options">
          {allTypes.map((type) => {
            const [appCode, appI18nKey] = getAppCodeAndI18nKey(type);
            const checked = selected.includes(type);
            return (
              <label
                key={type}
                className={clsx('notification-filter-chip', {
                  'is-checked': checked,
                })}
              >
                <AppIcon app={appCode} size="24" iconFit="contain" />
                <span>{t(appI18nKey, { defaultValue: appCode })}</span>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={checked}
                  onChange={() => toggleType(type)}
                />
              </label>
            );
          })}
        </Flex>
      </Modal.Body>
      <Modal.Footer>
        <ButtonBeta
          color="tertiary"
          onClick={onCancel}
          type="button"
          variant="ghost"
        >
          {t('cancel')}
        </ButtonBeta>
        <ButtonBeta
          color="default"
          onClick={() => onApply(selected)}
          type="button"
          variant="filled"
          rightIcon={<IconCheck />}
        >
          {t('homepage.notifications.filter-modal.confirm', {
            defaultValue: 'Enregistrer',
          })}
        </ButtonBeta>
      </Modal.Footer>
    </Modal>
  );
};

NotificationFilterModal.displayName = 'NotificationFilterModal';

export default NotificationFilterModal;
