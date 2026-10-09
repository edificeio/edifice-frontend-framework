import { CalendarEvent } from '@edifice.io/client';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import illuEmptyAgenda from '@edifice.io/bootstrap/dist/images/homepage/illu-empty-agenda.svg';
import { Flex } from '../../../../components';
import { useDate } from '../../../../hooks';
import { IconExternalLink } from '../../../icons/components';
import HomeCard from '../HomeCard/HomeCard';
import { AgendaEventCard } from './AgendaEventCard';

export interface AgendaProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onOpenAgendaClick?: () => void;
}

interface AgendaDayGroup {
  key: string;
  /** First event's start date in this group, used to group same-day events together. */
  date: string;
  /** "Jeu." */
  weekday: string;
  /** "10" */
  day: string;
  /** "sept.", omitted when the group falls in the current month. */
  month?: string;
  events: CalendarEvent[];
}

const capitalize = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1);

export const Agenda = ({
  events,
  onEventClick,
  onOpenAgendaClick = () => window.open('/calendar', '_self'),
}: AgendaProps) => {
  const { t } = useTranslation();
  const { formatDate, dateIsSame } = useDate();

  const dayGroups = useMemo<AgendaDayGroup[]>(() => {
    const now = new Date().toISOString();
    return events.reduce<AgendaDayGroup[]>((groups, event) => {
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && dateIsSame(lastGroup.date, event.startMoment, 'day')) {
        lastGroup.events.push(event);
        return groups;
      }

      groups.push({
        key: event.id,
        date: event.startMoment,
        weekday: capitalize(formatDate(event.startMoment, 'ddd')),
        day: formatDate(event.startMoment, 'D'),
        month: dateIsSame(event.startMoment, now, 'month')
          ? undefined
          : formatDate(event.startMoment, 'MMM'),
        events: [event],
      });
      return groups;
    }, []);
  }, [events, dateIsSame, formatDate]);

  return (
    <HomeCard variant="primary">
      <HomeCard.Header
        title={t('homepage.agenda.title')}
        actionLeftIcon={<IconExternalLink width="20" height="20" />}
        onActionClick={onOpenAgendaClick}
        actionProps={{
          'aria-label': t('homepage.agenda.openAgenda'),
          'data-testid': 'agenda-button-open',
        }}
      />
      <HomeCard.Content>
        {dayGroups.length === 0 ? (
          <Flex
            direction="column"
            align="center"
            gap="8"
            className="agenda-empty"
          >
            <img src={illuEmptyAgenda} alt="" width={64} height={64} />
            <span className="agenda-empty-text">
              {t('homepage.agenda.empty')}
            </span>
          </Flex>
        ) : (
          <Flex direction="column" gap="8" className="agenda-content">
            {dayGroups.map((group) => (
              <Flex
                key={group.key}
                gap="4"
                className="agenda-day-group"
                data-testid="agenda-day-group"
              >
                <Flex
                  direction="column"
                  align="center"
                  className="agenda-day-group-date"
                >
                  <span>{group.weekday}</span>
                  <span className="agenda-day-group-date-number">
                    {group.day}
                  </span>
                  {group.month && <span>{group.month}</span>}
                </Flex>
                <Flex
                  direction="column"
                  gap="8"
                  className="agenda-day-group-events"
                >
                  {group.events.map((event) => (
                    <AgendaEventCard
                      key={event.id}
                      event={event}
                      onClick={() => onEventClick?.(event)}
                    />
                  ))}
                </Flex>
              </Flex>
            ))}
          </Flex>
        )}
      </HomeCard.Content>
    </HomeCard>
  );
};

Agenda.displayName = 'Agenda';
