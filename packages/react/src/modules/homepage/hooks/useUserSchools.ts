import { School, WIDGET_NAME, WidgetName } from '@edifice.io/client';
import { useEffect, useState } from 'react';
import { useSession } from 'src/hooks/useSession';
import useWidget from './useWidget';

export function useUserSchools(widgetName: WidgetName = WIDGET_NAME.SCHOOL) {
  const { data: session } = useSession();
  const { preference, savePreference } = useWidget(widgetName);
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
        savePreference({ ...preference, schoolId: school.id });
      }
    },
  };
}
