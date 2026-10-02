import { useUserSchools } from '../../SchoolSpace/useUserSchools';
import { useCantineMenu } from './useCantineMenu';
import { useDate } from '../../../../../hooks';

/**
 * Today's lunch menu for the school currently selected by the user (see
 * `useUserSchools`).
 *
 * Only lunch is exposed: the widget design has no lunch/dinner toggle, unlike
 * the modal and the legacy AngularJS widget.
 */
export function useCantine() {
  const { selectedSchool } = useUserSchools();
  const { formatDate } = useDate();

  const { sections, status } = useCantineMenu(
    selectedSchool?.UAI ?? '',
    formatDate(new Date(), 'YYYY-MM-DD'),
  );

  return { sections, status };
}
