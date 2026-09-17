import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useUserSchools } from '../../SchoolSpace/useUserSchools';
import { CantineMenuType, useCantineMenu } from './useCantineMenu';

/** How far the user may browse around today, in days. */
const DATE_RANGE_IN_DAYS = 40;

const DATE_FORMAT = 'YYYY-MM-DD';

/**
 * Browsing state of the full-screen canteen modal: day, school and service.
 *
 * The school picked here stays local to the modal on purpose: it must not
 * change the school shared with the other homepage widgets (see
 * `useUserSchools`), only the menu being read.
 */
export function useCantineModal() {
  const { schools, selectedSchool: defaultSchool } = useUserSchools();

  const [schoolId, setSchoolId] = useState<string>();
  const [menuType, setMenuType] = useState<CantineMenuType>('lunch');
  const [date, setDate] = useState(() => dayjs().format(DATE_FORMAT));

  const { minDate, maxDate } = useMemo(
    () => ({
      minDate: dayjs().subtract(DATE_RANGE_IN_DAYS, 'day').format(DATE_FORMAT),
      maxDate: dayjs().add(DATE_RANGE_IN_DAYS, 'day').format(DATE_FORMAT),
    }),
    [],
  );

  const selectedSchool =
    schools.find((school) => school.id === schoolId) ?? defaultSchool;

  const menu = useCantineMenu(selectedSchool?.UAI ?? '', date, menuType);

  const shiftDate = (days: number) =>
    setDate((current) => dayjs(current).add(days, 'day').format(DATE_FORMAT));

  return {
    schools,
    selectedSchool,
    onSchoolChange: setSchoolId,
    hasDinner: menu.dinnerAvailable,
    menuType: menu.menuType,
    onMenuTypeChange: setMenuType,
    date,
    canGoPrevious: dayjs(date).isAfter(minDate),
    canGoNext: dayjs(date).isBefore(maxDate),
    onPreviousDay: () => shiftDate(-1),
    onNextDay: () => shiftDate(1),
    sections: menu.sections,
    status: menu.status,
  };
}
