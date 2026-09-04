import { WIDGET_NAME } from '@edifice.io/client';
import { useUserSchools } from '../../hooks/useUserSchools';
import Universalis from './Universalis';

export function UniversalisContainer() {
  const { handleSelectedSchoolChange, ...otherProps } = useUserSchools(
    WIDGET_NAME.UNIVERSALIS,
  );

  const handleActionClick = (): void => {
    window.open(
      'http://www.universalis-edu.com',
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <Universalis
      handleActionClick={handleActionClick}
      onSelectedSchoolChange={handleSelectedSchoolChange}
      {...otherProps}
    />
  );
}
