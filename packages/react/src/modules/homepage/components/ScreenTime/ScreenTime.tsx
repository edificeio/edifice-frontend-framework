import clsx from 'clsx';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonBeta as Button, TextSkeleton } from '../../../../components';
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
}

export function ScreenTime({
  status,
  kids,
  selectedKidId,
  onKidChange,
  todayMinutes,
  yesterdayMinutes,
  onFullScreenClick,
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

  const card = (
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
            {status === 'loading' ? (
              <TextSkeleton size="lg" className="screen-time__day-skeleton" />
            ) : (
              <span className="screen-time__day-value">
                {formatDuration(todayMinutes)}
              </span>
            )}
          </div>
          <div className="screen-time__day">
            <span className="screen-time__day-label">
              {t('homepage.widget.screenTime.yesterday')}
            </span>
            {status === 'loading' ? (
              <TextSkeleton size="lg" className="screen-time__day-skeleton" />
            ) : (
              <span className="screen-time__day-value">
                {formatDuration(yesterdayMinutes)}
              </span>
            )}
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
