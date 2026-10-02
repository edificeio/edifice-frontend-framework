import { useMemo, useState } from 'react';
import { useDate } from '../../../../../hooks';
import { useUserSchools } from '../../SchoolSpace/useUserSchools';
import { CantineMenuType, useCantineMenu } from './useCantineMenu';

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
 * The school picked here stays local to the modal on purpose: it must not
 * change the school shared with the other homepage widgets (see
 * `useUserSchools`), only the menu being read.
 */
export function useCantineModal() {
  const { schools, selectedSchool: defaultSchool } = useUserSchools();

  const { formatDate } = useDate();

  const [schoolId, setSchoolId] = useState<string>();
  const [menuType, setMenuType] = useState<CantineMenuType>('lunch');
  const [date, setDate] = useState(() => formatDate(new Date(), DATE_FORMAT));

  const { minDate, maxDate } = useMemo(() => {
    const today = new Date();
    return {
      minDate: formatDate(addDays(today, -DATE_RANGE_IN_DAYS), DATE_FORMAT),
      maxDate: formatDate(addDays(today, DATE_RANGE_IN_DAYS), DATE_FORMAT),
    };
  }, [formatDate]);

  const selectedSchool =
    schools.find((school) => school.id === schoolId) ?? defaultSchool;

  const menu = useCantineMenu(selectedSchool?.UAI ?? '', date, menuType);

  const shiftDate = (days: number) =>
    setDate((current) =>
      formatDate(addDays(new Date(`${current}T00:00:00`), days), DATE_FORMAT),
    );

  return {
    schools,
    selectedSchool,
    onSchoolChange: setSchoolId,
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
