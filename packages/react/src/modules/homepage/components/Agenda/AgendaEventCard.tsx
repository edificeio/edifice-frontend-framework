import { CalendarEvent } from '@edifice.io/client';
import { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex } from '../../../../components';
import { useDate } from '../../../../hooks';
import { IconClock } from '../../../icons/components';

export interface AgendaEventCardProps {
  event: CalendarEvent;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const capitalize = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1);

export const AgendaEventCard = ({ event, onClick }: AgendaEventCardProps) => {
  const { t } = useTranslation();
  const { formatDate, dateIsSame } = useDate();

  const formatTime = (date: string) => formatDate(date, 'HH[h]mm');

  const timeLabel = event.allDay
    ? t('homepage.agenda.allDay')
    : dateIsSame(event.startMoment, event.endMoment, 'day')
      ? `${formatTime(event.startMoment)} - ${formatTime(event.endMoment)}`
      : t('homepage.agenda.multiDayTime', {
          startTime: formatTime(event.startMoment),
          endDay: capitalize(formatDate(event.endMoment, 'ddd D')),
          endTime: formatTime(event.endMoment),
        });

  return (
    <button
      type="button"
      className="agenda-event-card"
      onClick={onClick}
      data-testid="agenda-event-card"
    >
      <Flex align="center" gap="8" className="agenda-event-card-time">
        <IconClock width="20" height="20" />
        <span>{timeLabel}</span>
      </Flex>
      <p className="agenda-event-card-title">{event.title}</p>
    </button>
  );
};

AgendaEventCard.displayName = 'AgendaEventCard';
