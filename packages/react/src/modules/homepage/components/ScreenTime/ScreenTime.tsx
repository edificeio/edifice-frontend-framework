import clsx from 'clsx';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ButtonBeta as Button,
  Skeleton,
  VisuallyHidden,
} from '../../../../components';
import { IconFullScreen } from '../../../icons/components';
import { HomeCard } from '../HomeCard';
import { TabsKids } from '../TabsKids';
import { ScreenTimeError } from './ScreenTimeError';
import { ScreenTimeKid, ScreenTimeStatus } from './types';
import { formatDuration } from './utils';

export interface ScreenTimeProps {
  status: ScreenTimeStatus;
  kids: ScreenTimeKid[];
  selectedKidId?: string;
  onKidChange: (kidId: string) => void;
  todayMinutes: number;
  yesterdayMinutes: number;
  onFullScreenClick: () => void;
  isLoading?: boolean;
}

export function ScreenTime({
  status,
  kids,
  selectedKidId,
  onKidChange,
  todayMinutes,
  yesterdayMinutes,
  onFullScreenClick,
  isLoading = false,
}: ScreenTimeProps) {
  const { t } = useTranslation();

  // Memoized because TabsKids measures its tabs again on every new array.
  const tabs = useMemo(
    () =>
      kids.map((kid) => ({
        id: kid.id,
        label: kid.firstName,
        avatar: kid.avatarUrl,
      })),
    [kids],
  );

  if (isLoading) {
    return (
      <HomeCard
        variant="primary"
        className="screen-time screen-time--skeleton"
        role="status"
        aria-busy="true"
      >
        <VisuallyHidden>{t('homepage.widget.loading')}</VisuallyHidden>
        <div className="screen-time__header-skeleton">
          <Skeleton className="screen-time__title-skeleton" />
          <Skeleton
            variant="circle"
            tone="strong"
            className="screen-time__button-skeleton"
          />
        </div>
        <Skeleton variant="block" className="screen-time__content-skeleton" />
      </HomeCard>
    );
  }

  const card =
    status === 'loading' ? (
      <div role="status" aria-busy="true" data-testid="screen-time-loading">
        <VisuallyHidden>{t('homepage.widget.loading')}</VisuallyHidden>
        <Skeleton variant="block" className="screen-time__loading-skeleton" />
      </div>
    ) : (
      <div
        className={clsx('screen-time__card', {
          'screen-time__card--empty': status === 'empty',
        })}
      >
        {status === 'empty' ? (
          <p className="screen-time__empty">
            {t('homepage.widget.screenTime.empty')}
          </p>
        ) : (
          <>
            <div className="screen-time__day">
              <span className="screen-time__day-label">
                {t('homepage.widget.screenTime.today')}
              </span>
              <span className="screen-time__day-value">
                {formatDuration(todayMinutes)}
              </span>
            </div>
            <div className="screen-time__day">
              <span className="screen-time__day-label">
                {t('homepage.widget.screenTime.yesterday')}
              </span>
              <span className="screen-time__day-value">
                {formatDuration(yesterdayMinutes)}
              </span>
            </div>
          </>
        )}
      </div>
    );

  // The kids are unknown while the session loads: show the card alone.
  const content =
    kids.length > 0 ? (
      <TabsKids
        items={tabs}
        activeId={selectedKidId ?? ''}
        onChange={onKidChange}
        showTabBar={kids.length > 1}
        ariaLabel={t('homepage.widget.screenTime.kids')}
      >
        {card}
      </TabsKids>
    ) : (
      card
    );

  return (
    <HomeCard variant="primary" className="screen-time">
      <div className="screen-time__header">
        <h3 className="screen-time__title">
          {t('homepage.widget.screenTime.title')}
        </h3>
        {status !== 'error' && (
          <Button
            data-testid="screen-time-button-fullscreen"
            aria-label={t('homepage.widget.screenTime.open')}
            leftIcon={<IconFullScreen />}
            variant="ghost"
            color="tertiary"
            onClick={onFullScreenClick}
          />
        )}
      </div>

      <HomeCard.Content className="screen-time__content">
        {status === 'error' ? (
          <ScreenTimeError className="screen-time__error" />
        ) : (
          content
        )}
      </HomeCard.Content>
    </HomeCard>
  );
}
