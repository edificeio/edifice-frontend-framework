import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AppIcon,
  ButtonBeta as Button,
  Checkbox,
  Flex,
  ModalBeta as Modal,
} from '../../../../..';
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
  const { t, i18n } = useTranslation();
  const [selected, setSelected] = useState<string[]>(appliedTypes);

  const refSelectAllCheckbox = useRef<HTMLInputElement>(null);

  const allTypesSorted = useMemo(
    () =>
      allTypes
        .map((type) => {
          const [appCode, appI18nKey] = getAppCodeAndI18nKey(type);
          const label = t(appI18nKey, { defaultValue: appCode });
          return { type, appCode, appI18nKey, label };
        })
        .sort((a, b) =>
          a.label.localeCompare(b.label, i18n.language, {
            sensitivity: 'base',
          }),
        ),
    [allTypes, t, i18n.language],
  );

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

  useEffect(() => {
    if (refSelectAllCheckbox.current) {
      refSelectAllCheckbox.current!.indeterminate =
        selected.length > 0 && selected.length < allTypes.length;
    }
  }, [selected.length, allTypes.length]);

  return (
    <Modal
      id="notification-filter-modal"
      size={'l'}
      isOpen={isOpen}
      onModalClose={onCancel}
    >
      <Modal.Header
        subtitle={t('homepage.notifications.filter-modal.subtitle')}
        onModalClose={onCancel}
      >
        {t('homepage.notifications.filter-modal.title')}
      </Modal.Header>
      <Modal.Body>
        <Flex align="center" gap="8" className="mb-24">
          <label className="notification-filter-select-all notification-filter-chip">
            <span>{t('homepage.notifications.filter-modal.select-all')}</span>
            <input
              type="checkbox"
              ref={refSelectAllCheckbox}
              checked={selected.length === allTypes.length}
              className="notification-filter-checkbox"
              onChange={toggleAll}
            />
          </label>
          <span className="notification-filter-count">
            {t('homepage.notifications.filter-modal.count', {
              selected: selected.length,
              total: allTypes.length,
            })}
          </span>
        </Flex>
        <Flex wrap="wrap" gap="16" className="notification-filter-options">
          {allTypesSorted.map(({ type, label, appCode }) => {
            const checked = selected.includes(type);
            return (
              <label
                key={type}
                className={clsx('notification-filter-chip', {
                  'is-checked': checked,
                })}
              >
                <AppIcon app={appCode} size="24" iconFit="contain" />
                <span>{label}</span>
                <Checkbox checked={checked} onChange={() => toggleType(type)} />
              </label>
            );
          })}
        </Flex>
      </Modal.Body>
      <Modal.Footer>
        <Button
          color="tertiary"
          onClick={onCancel}
          type="button"
          variant="ghost"
        >
          {t('cancel')}
        </Button>
        <Button
          color="default"
          onClick={() => onApply(selected)}
          type="button"
          variant="filled"
          rightIcon={<IconCheck />}
        >
          {t('homepage.notifications.filter-modal.confirm')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

NotificationFilterModal.displayName = 'NotificationFilterModal';

export default NotificationFilterModal;
