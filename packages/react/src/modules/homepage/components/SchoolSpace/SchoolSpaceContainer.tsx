import SchoolSpace from './SchoolSpace';
import { useUserSchools } from '../../hooks/useUserSchools';

export function SchoolSpaceContainer() {
  const { handleSelectedSchoolChange, ...otherProps } = useUserSchools();

  return (
    <SchoolSpace
      onSelectedSchoolChange={handleSelectedSchoolChange}
      {...otherProps}
    />
  );
}

SchoolSpaceContainer.displayName = 'SchoolSpaceContainer';
