import type { School } from '@edifice.io/client';
import { useCantineMenu } from './useCantineMenu';
import { useDate } from '../../../../../hooks';

/**
 * Today's lunch menu for the given school (see `useUserSchools`).
 *
 * Only lunch is exposed: the widget design has no lunch/dinner toggle, unlike
 * the modal and the legacy AngularJS widget.
 */
export function useCantine(school?: School) {
  const { formatDate } = useDate();

  const { sections, status } = useCantineMenu(
    school?.UAI ?? '',
    formatDate(new Date(), 'YYYY-MM-DD'),
  );

  return { sections, status };
}
