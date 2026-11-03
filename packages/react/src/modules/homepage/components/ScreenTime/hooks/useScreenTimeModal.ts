import { useState } from 'react';
import {
  useDailyScreenTime,
  useWeeklyScreenTime,
} from '../services/queries/screenTime';
import {
  ScreenTimeDayEntry,
  ScreenTimeHourEntry,
  ScreenTimeKid,
  ScreenTimeStatus,
  ScreenTimeView,
} from '../types';
import {
  getNextPeriodDate,
  getPreviousPeriodDate,
  getScreenTimeStatus,
  getToday,
  getWeekBounds,
} from '../utils';
import { useScreenTimeKids } from './useScreenTimeKids';

export interface UseScreenTimeModalReturn {
  isOpen: boolean;
  /** Opens the modal on today's week, for the given kid. */
  open: (kidId?: string) => void;
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

/**
 * Custom hook that provides the state of the full-screen modal: which kid,
 * view and period are displayed, and their screen time.
 *
 * The kid picked here stays local to the modal on purpose: it must not
 * change the widget's own selected kid.
 */
export const useScreenTimeModal = (): UseScreenTimeModalReturn => {
  const kids = useScreenTimeKids();
  const [isOpen, setIsOpen] = useState(false);
  const [kidId, setKidId] = useState<string>();
  const [view, setView] = useState<ScreenTimeView>('weekly');
  const [date, setDate] = useState(getToday);

  const selectedKid = kids.find((kid) => kid.id === kidId) ?? kids[0];
  const week = getWeekBounds(date);

  const weeklyQuery = useWeeklyScreenTime(
    selectedKid?.id,
    week.start,
    week.end,
    { enabled: isOpen && view === 'weekly' },
  );
  const dailyQuery = useDailyScreenTime(selectedKid?.id, date, {
    enabled: isOpen && view === 'daily',
  });

  const open = (initialKidId?: string) => {
    setKidId(initialKidId);
    setView('weekly');
    setDate(getToday());
    setIsOpen(true);
  };

  const today = getToday();
  const previousDate = getPreviousPeriodDate(view, date, today);
  const nextDate = getNextPeriodDate(view, date, today);

  return {
    isOpen,
    open,
    onClose: () => setIsOpen(false),
    kids,
    selectedKid,
    onKidChange: setKidId,
    view,
    onViewChange: setView,
    date,
    canGoPrevious: previousDate !== undefined,
    canGoNext: nextDate !== undefined,
    onPrevious: () => previousDate && setDate(previousDate),
    onNext: () => nextDate && setDate(nextDate),
    days: weeklyQuery.data,
    hours: dailyQuery.data,
    status: getScreenTimeStatus([view === 'weekly' ? weeklyQuery : dailyQuery]),
  };
};
