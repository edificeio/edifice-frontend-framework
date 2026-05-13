import { School, WIDGET_NAME, WidgetUserPref } from '@edifice.io/client';
import { useEffect, useState } from 'react';
import { useSession } from 'src/hooks/useSession';
import useWidgetPreferences from '../../hooks/useWidgetPreferences';

export function useUserSchools() {
  const { data: session } = useSession();
  const { lookup, saveUserPreferences } = useWidgetPreferences();
  const [userPreferences, setUserPreferences] = useState<WidgetUserPref>();
  const [selectedSchool, setSelectedSchool] = useState<School>();
  const [schools, setSchools] = useState(session?.userDescription?.schools);

  // Select a default school
  useEffect(() => {
    const newSchools = session?.userDescription?.schools;
    setSchools(newSchools);
    setSelectedSchool(newSchools?.[0]);
  }, [session?.userDescription?.schools]);

  // Memoize user's preferences for this widget, depending on the 'lookup' function availability.
  useEffect(() => {
    const userPref = lookup?.(WIDGET_NAME.SCHOOL)?.userPref;
    setUserPreferences(userPref);
  }, [lookup]);

  // Select the user's prefered school
  useEffect(() => {
    if (Array.isArray(schools)) {
      if (schools.length === 1) {
        setSelectedSchool(schools[0]);
      } else if (userPreferences?.schoolId) {
        const index = schools.findIndex(
          (school) => school.id === userPreferences?.schoolId,
        );
        setSelectedSchool(
          index < 0 || index >= schools.length ? schools[0] : schools[index],
        );
      }
    }
  }, [userPreferences, schools]);

  return {
    schools: schools ?? [],
    selectedSchool,
    handleSelectedSchoolChange: (school: School) => {
      setSelectedSchool(school);
      if (userPreferences) {
        // Update user's preferences and save them
        userPreferences.schoolId = school.id;
        saveUserPreferences();
      }
    },
  };
}
