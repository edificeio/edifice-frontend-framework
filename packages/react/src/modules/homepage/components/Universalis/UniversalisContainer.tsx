import { WIDGET_NAME } from '@edifice.io/client';
import { useUserSchools } from '../../hooks/useUserSchools';
import Universalis from './Universalis';

const UNIVERSALIS_SEARCH_URL =
  'https://www.universalis-edu.com/nomade/precherche/';
const UNIVERSALIS_ENGINE_PARAM = 'www';

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

  const handleSearch = (query: string): void => {
    const uai = otherProps.selectedSchool?.UAI;
    if (!uai) return;
    const params = new URLSearchParams({
      r: UNIVERSALIS_ENGINE_PARAM,
      uai,
      q: query,
    });
    window.open(
      `${UNIVERSALIS_SEARCH_URL}?${params.toString()}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <Universalis
      handleActionClick={handleActionClick}
      onSearch={handleSearch}
      onSelectedSchoolChange={handleSelectedSchoolChange}
      {...otherProps}
    />
  );
}
