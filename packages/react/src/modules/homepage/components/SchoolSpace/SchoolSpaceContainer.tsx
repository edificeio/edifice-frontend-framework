import SchoolSpace from './SchoolSpace';
import { useUserSchools } from './useUserSchools';

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
