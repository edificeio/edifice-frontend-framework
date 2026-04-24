import SchoolSpace from './SchoolSpace';
import { useUserSchools } from './useUserSchools';

export function SchoolSpaceContainer() {
  const props = useUserSchools();

  return <SchoolSpace {...props} />;
}

SchoolSpaceContainer.displayName = 'SchoolSpaceContainer';
