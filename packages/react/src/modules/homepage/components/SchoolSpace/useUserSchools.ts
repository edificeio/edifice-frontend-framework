import { School, WIDGET_NAME } from '@edifice.io/client';
import { useEffect, useState } from 'react';
import { useSession } from 'src/hooks/useSession';
import useWidget from '../../hooks/useWidget';

export function useUserSchools() {
  const { data: session } = useSession();
  const { preference, savePreference } = useWidget(WIDGET_NAME.SCHOOL);
  const [selectedSchool, setSelectedSchool] = useState<School>();
  const [schools, setSchools] = useState(session?.userDescription?.schools);

  // Select a default school
  useEffect(() => {
    const newSchools = session?.userDescription?.schools;
    setSchools(newSchools);
    setSelectedSchool(newSchools?.[0]);
  }, [session?.userDescription?.schools]);

  // Select the user's prefered school
  useEffect(() => {
    if (Array.isArray(schools)) {
      if (schools.length === 1) {
        setSelectedSchool(schools[0]);
      } else if (preference?.schoolId) {
        const index = schools.findIndex(
          (school) => school.id === preference?.schoolId,
        );
        setSelectedSchool(
          index < 0 || index >= schools.length ? schools[0] : schools[index],
        );
      }
    }
  }, [preference, schools]);

  return {
    schools: schools ?? [],
    selectedSchool,
    handleSelectedSchoolChange: (school: School) => {
      setSelectedSchool(school);
      if (preference) {
        // Update user's preferences and save them
        preference.schoolId = school.id;
        savePreference(preference);
      }
    },
  };
}
