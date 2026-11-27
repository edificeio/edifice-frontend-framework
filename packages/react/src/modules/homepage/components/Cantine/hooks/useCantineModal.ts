import type { School } from '@edifice.io/client';
import { useMemo, useState } from 'react';
import { useDate } from '../../../../../hooks';
import { useCantineMenu } from './useCantineMenu';
import { CantineMenuType } from '../types';

/** How far the user may browse around today, in days. */
const DATE_RANGE_IN_DAYS = 40;

const DATE_FORMAT = 'YYYY-MM-DD';

const addDays = (date: Date, days: number) => {
  const shifted = new Date(date);
  shifted.setDate(shifted.getDate() + days);
  return shifted;
};

/**
 * Browsing state of the full-screen canteen modal: day, school and service.
 *
 * The school is owned by the widget card (see `CantineContainer`): picking one
 * here switches the card too and saves it as the user's preference.
 */
export function useCantineModal(
  schools: School[],
  selectedSchool: School | undefined,
  onSelectedSchoolChange: (schoolId: string) => void,
) {
  const { formatDate } = useDate();

  const [menuType, setMenuType] = useState<CantineMenuType>('lunch');
  const [date, setDate] = useState(() => formatDate(new Date(), DATE_FORMAT));

  const { minDate, maxDate } = useMemo(() => {
    const today = new Date();
    return {
      minDate: formatDate(addDays(today, -DATE_RANGE_IN_DAYS), DATE_FORMAT),
      maxDate: formatDate(addDays(today, DATE_RANGE_IN_DAYS), DATE_FORMAT),
    };
  }, [formatDate]);

  const menu = useCantineMenu(selectedSchool?.UAI ?? '', date, menuType);

  const shiftDate = (days: number) =>
    setDate((current) =>
      formatDate(addDays(new Date(`${current}T00:00:00`), days), DATE_FORMAT),
    );

  return {
    schools,
    selectedSchool,
    onSchoolChange: onSelectedSchoolChange,
    hasDinner: menu.dinnerAvailable,
    menuType: menu.menuType,
    onMenuTypeChange: setMenuType,
    date,
    canGoPrevious: date > minDate,
    canGoNext: date < maxDate,
    onPreviousDay: () => shiftDate(-1),
    onNextDay: () => shiftDate(1),
    sections: menu.sections,
    status: menu.status,
  };
}
