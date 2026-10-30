import { lazy, Suspense, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  ButtonBeta as Button,
  Loading,
  ModalBeta as Modal,
  SegmentedControl,
  Select,
} from '../../../../components';
import { useDate } from '../../../../hooks';
import { IconRafterLeft, IconRafterRight } from '../../../icons/components';
import { ScreenTimeError } from './ScreenTimeError';
import {
  ScreenTimeDayEntry,
  ScreenTimeHourEntry,
  ScreenTimeKid,
  ScreenTimeStatus,
  ScreenTimeView,
} from './types';
import {
  buildDailyBars,
  buildWeeklyBars,
  getAxisLabelStep,
  getAxisMax,
  getWeekBounds,
  SCREEN_TIME_AXIS,
  SCREEN_TIME_LEARN_MORE_URL,
} from './utils';

const ScreenTimeChart = lazy(() => import('./ScreenTimeChart'));

export interface ScreenTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  kids: ScreenTimeKid[];
  selectedKid?: ScreenTimeKid;
  onKidChange: (kidId: string) => void;
  view: ScreenTimeView;
  onViewChange: (view: ScreenTimeView) => void;
  /** Displayed day ("YYYY-MM-DD"), or any day of the displayed week. */
  date: string;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  /** Weekly view data, once loaded. */
  days?: ScreenTimeDayEntry[];
  /** Daily view data, once loaded. */
  hours?: ScreenTimeHourEntry[];
  status: ScreenTimeStatus;
}

export function ScreenTimeModal({
  isOpen,
  onClose,
  kids,
  selectedKid,
  onKidChange,
  view,
  onViewChange,
  date,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  days,
  hours,
  status,
}: ScreenTimeModalProps) {
  const { t } = useTranslation();
  const { formatDate } = useDate();

  const week = getWeekBounds(date);

  // Memoized because a new array would update the chart on every render.
  const bars = useMemo(
    () =>
      view === 'weekly'
        ? buildWeeklyBars(week.start, days ?? [], formatDate)
        : buildDailyBars(hours ?? []),
    [view, week.start, days, hours, formatDate],
  );
  const axisMax = getAxisMax(
    view,
    bars.map((bar) => bar.value),
  );

  const periodLabel =
    view === 'weekly'
      ? t('homepage.widget.screenTime.modal.week', {
          start: formatDate(week.start, 'D MMMM'),
          end: formatDate(week.end, 'D MMMM'),
        })
      : t('homepage.widget.screenTime.modal.day', {
          date: formatDate(date, 'dddd D MMMM'),
        });

  return (
    <Modal
      id="screen-time-modal"
      size="l"
      isOpen={isOpen}
      onModalClose={onClose}
    >
      <Modal.Header onModalClose={onClose}>
        {t('homepage.widget.screenTime.title')}
      </Modal.Header>

      <Modal.Body className="screen-time-modal">
        <Alert
          type="info"
          isDismissible
          button={
            <Button
              data-testid="screen-time-modal-button-learn-more"
              variant="ghost"
              onClick={() =>
                window.open(
                  SCREEN_TIME_LEARN_MORE_URL,
                  '_blank',
                  'noopener,noreferrer',
                )
              }
            >
              {t('homepage.widget.screenTime.modal.learnMore')}
            </Button>
          }
        >
          {t('homepage.widget.screenTime.modal.info')}
        </Alert>

        <div className="screen-time-modal__toolbar">
          {kids.length > 1 && (
            <div className="screen-time-modal__kid">
              <span className="screen-time-modal__kid-label">
                {t('homepage.widget.screenTime.modal.student')}
              </span>
              <div data-testid="screen-time-modal-input-kid">
                <Select
                  placeholderOption={selectedKid?.displayName ?? ''}
                  options={kids.map((kid) => ({
                    value: kid.id,
                    label: kid.displayName,
                  }))}
                  selectedValue={
                    selectedKid && {
                      value: selectedKid.id,
                      label: selectedKid.displayName,
                    }
                  }
                  onValueChange={(option) =>
                    onKidChange(
                      typeof option === 'string' ? option : option.value,
                    )
                  }
                />
              </div>
            </div>
          )}
          <SegmentedControl
            data-testid="screen-time-modal-input-view"
            options={[
              {
                value: 'weekly',
                label: t('homepage.widget.screenTime.modal.weekly'),
              },
              {
                value: 'daily',
                label: t('homepage.widget.screenTime.modal.daily'),
              },
            ]}
            value={view}
            onChange={(value) => onViewChange(value as ScreenTimeView)}
            className="screen-time-modal__view"
          />
        </div>

        <div className="screen-time-modal__nav">
          <Button
            data-testid="screen-time-modal-button-previous"
            aria-label={t('homepage.widget.screenTime.modal.previous')}
            leftIcon={<IconRafterLeft />}
            variant="ghost"
            disabled={!canGoPrevious}
            onClick={onPrevious}
          />
          <p className="screen-time-modal__period">{periodLabel}</p>
          <Button
            data-testid="screen-time-modal-button-next"
            aria-label={t('homepage.widget.screenTime.modal.next')}
            leftIcon={<IconRafterRight />}
            variant="ghost"
            disabled={!canGoNext}
            onClick={onNext}
          />
        </div>

        {status === 'error' ? (
          <ScreenTimeError className="screen-time-modal__error" />
        ) : (
          <div className="screen-time-modal__chart">
            <Suspense
              fallback={
                <div className="screen-time-modal__chart-placeholder" />
              }
            >
              <ScreenTimeChart
                bars={bars}
                axisMax={axisMax}
                axisStep={SCREEN_TIME_AXIS[view].step}
                labelStep={getAxisLabelStep(view, axisMax)}
                axisTitle={
                  view === 'weekly'
                    ? t('homepage.widget.screenTime.modal.hours')
                    : t('homepage.widget.screenTime.modal.minutes')
                }
                ariaLabel={periodLabel}
              />
            </Suspense>
            {status === 'loading' && (
              <div className="screen-time-modal__chart-overlay">
                <Loading isLoading />
              </div>
            )}
            {status === 'empty' && (
              <div className="screen-time-modal__chart-overlay">
                <span className="screen-time-modal__no-data">
                  {t('homepage.widget.screenTime.modal.noData')}
                </span>
              </div>
            )}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}
