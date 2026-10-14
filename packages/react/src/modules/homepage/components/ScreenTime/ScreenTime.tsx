import tabCorner from '@edifice.io/bootstrap/dist/images/homepage/screen-time-tab-corner.svg';
import clsx from 'clsx';
import { useId, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  ButtonBeta as Button,
  TextSkeleton,
} from '../../../../components';
import { IconFullScreen } from '../../../icons/components';
import { HomeCard } from '../HomeCard';
import { ScreenTimeError } from './ScreenTimeError';
import { ScreenTimeKid, ScreenTimeStatus } from './types';
import { formatDuration, getKidShortLabel } from './utils';

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
  const uid = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeIndex = kids.findIndex((kid) => kid.id === selectedKidId);
  const activeKid = kids[activeIndex];
  // Fallback to the first tab so the tablist stays reachable via Tab even
  // when no kid is currently selected/active (activeIndex === -1).
  const rovingIndex = activeIndex === -1 ? 0 : activeIndex;
  const panelId = `screen-time-tabpanel-${uid}`;

  const handleTabsKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    if (kids.length === 0) return;

    event.preventDefault();
    const delta = event.key === 'ArrowRight' ? 1 : -1;
    const currentIndex = activeIndex === -1 ? 0 : activeIndex;
    const nextIndex = (currentIndex + delta + kids.length) % kids.length;
    onKidChange(kids[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

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
          <div className="screen-time__wrapper">
            {kids.length > 1 && (
              <div
                className="screen-time__tabs"
                role="tablist"
                onKeyDown={handleTabsKeyDown}
              >
                {kids.map((kid, index) => {
                  const active = index === activeIndex;
                  return (
                    <button
                      key={kid.id}
                      ref={(el) => {
                        tabRefs.current[index] = el;
                      }}
                      id={`screen-time-tab-${uid}-${kid.id}`}
                      data-testid={`screen-time-button-tab-${kid.id}`}
                      type="button"
                      className={clsx('screen-time__tab', {
                        'screen-time__tab-active': active,
                      })}
                      role="tab"
                      aria-selected={active}
                      aria-controls={panelId}
                      aria-label={kid.displayName}
                      tabIndex={index === rovingIndex ? 0 : -1}
                      onClick={() => onKidChange(kid.id)}
                    >
                      <Avatar
                        size="xs"
                        variant="circle"
                        src={kid.avatarUrl}
                        alt=""
                        className="screen-time__tab-avatar"
                      />
                      <span className="screen-time__tab-label">
                        {active
                          ? kid.firstName
                          : getKidShortLabel(kid.firstName)}
                      </span>
                      {active && (
                        <img
                          src={tabCorner}
                          alt=""
                          aria-hidden
                          className="screen-time__tab-corner screen-time__tab-corner-right"
                        />
                      )}
                      {active && index > 0 && (
                        <img
                          src={tabCorner}
                          alt=""
                          aria-hidden
                          className="screen-time__tab-corner screen-time__tab-corner-left"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
            <div
              id={kids.length > 1 ? panelId : undefined}
              className={clsx('screen-time__panel', {
                'screen-time__panel-first-tab-active':
                  kids.length > 1 && activeIndex === 0,
              })}
              role={kids.length > 1 ? 'tabpanel' : undefined}
              aria-labelledby={
                kids.length > 1 && activeKid
                  ? `screen-time-tab-${uid}-${activeKid.id}`
                  : undefined
              }
            >
              <div
                className={clsx('screen-time__card', {
                  'screen-time__card-empty': status === 'empty',
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
                        <TextSkeleton
                          size="lg"
                          className="screen-time__day-skeleton"
                        />
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
                        <TextSkeleton
                          size="lg"
                          className="screen-time__day-skeleton"
                        />
                      ) : (
                        <span className="screen-time__day-value">
                          {formatDuration(yesterdayMinutes)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </HomeCard.Content>
    </HomeCard>
  );
}
