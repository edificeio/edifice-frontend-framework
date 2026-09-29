import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import clsx from 'clsx';

import { Heading, IconButton, TextSkeleton } from '../../../../components';
import { IconClose, IconLock } from '../../../icons/components';
import { WidgetToggle } from './WidgetToggle';

export interface WidgetPersonalizationItem {
  id: string;
  label: string;
  icon: ReactNode;
  checked: boolean;
  /** When true, the widget is pinned by an admin: no toggle, lock icon instead. */
  locked?: boolean;
}

export interface WidgetsPersonalizationPanelProps {
  items: WidgetPersonalizationItem[];
  isLoading?: boolean;
  onToggle: (id: string) => void;
  onClose: () => void;
  title?: string;
  description?: string;
}

const SKELETON_ROWS = 5;

export function WidgetsPersonalizationPanel({
  items,
  isLoading = false,
  onToggle,
  onClose,
  title,
  description,
}: WidgetsPersonalizationPanelProps) {
  const { t } = useTranslation();

  return (
    <div className="widgets-personalization-panel">
      <div className="widgets-personalization-panel__header">
        <Heading
          level="h2"
          headingStyle="h5"
          className="widgets-personalization-panel__title"
        >
          {title ?? t('homepage.widgetsPersonalization.title')}
        </Heading>
        <IconButton
          icon={<IconClose />}
          variant="ghost"
          color="tertiary"
          aria-label={t('close')}
          onClick={onClose}
          data-testid="widgetspersonalization-button-close"
        />
      </div>

      <p className="widgets-personalization-panel__description">
        {description ?? t('homepage.widgetsPersonalization.description')}
      </p>

      {isLoading ? (
        <ul className="widgets-personalization-panel__list" aria-hidden="true">
          {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
            <li
              key={index}
              className="widgets-personalization-panel__item widgets-personalization-panel__item--skeleton"
            >
              <TextSkeleton className="widgets-personalization-panel__item-icon-skeleton" />
              <TextSkeleton className="widgets-personalization-panel__item-label-skeleton" />
            </li>
          ))}
        </ul>
      ) : items.length === 0 ? (
        <div className="widgets-personalization-panel__empty">
          <p className="widgets-personalization-panel__empty-text">
            {t('homepage.widgetsPersonalization.empty')}
          </p>
        </div>
      ) : (
        <ul className="widgets-personalization-panel__list">
          {items.map((item) => (
            <li
              key={item.id}
              className={clsx('widgets-personalization-panel__item', {
                'widgets-personalization-panel__item--checked':
                  item.checked && !item.locked,
                'widgets-personalization-panel__item--locked': item.locked,
              })}
              data-testid={`widgetspersonalization-item-${item.id}`}
            >
              <span
                className="widgets-personalization-panel__item-icon"
                aria-hidden="true"
              >
                {item.icon}
              </span>
              <span className="widgets-personalization-panel__item-label">
                {item.label}
              </span>
              {item.locked ? (
                <span
                  className="widgets-personalization-panel__item-lock"
                  role="img"
                  aria-label={t('homepage.widgetsPersonalization.locked')}
                  data-testid={`widgetspersonalization-lock-${item.id}`}
                >
                  <IconLock />
                </span>
              ) : (
                <WidgetToggle
                  checked={item.checked}
                  onChange={() => onToggle(item.id)}
                  aria-label={t('homepage.widgetsPersonalization.toggle', {
                    label: item.label,
                  })}
                  data-testid={`widgetspersonalization-toggle-${item.id}`}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

WidgetsPersonalizationPanel.displayName = 'WidgetsPersonalizationPanel';
