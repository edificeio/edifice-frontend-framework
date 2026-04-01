import { School, WIDGET_NAME, WidgetUserPref } from '@edifice.io/client';
import { useEffect, useState } from 'react';
import { useEdificeClient } from 'src/providers';
import useWidgetPreferences from '../../hooks/useWidgetPreferences';

export function useUserSchools() {
  const { userDescription } = useEdificeClient();
  const { lookup, saveUserPreferences } = useWidgetPreferences();
  const [userPreferences, setUserPreferences] = useState<WidgetUserPref>();
  const [selectedSchool, setSelectedSchool] = useState<School>();

  const schools = userDescription?.schools;

  // Select a default school
  useEffect(() => {
    setSelectedSchool(schools?.[0]);
  }, []);

  // Memoize user's preferences for this widget, depending on the 'lookup' function availability.
  useEffect(() => {
    const userPref = lookup?.(WIDGET_NAME.SCHOOL)?.userPref;
    setUserPreferences(userPref);
  }, [lookup]);

  // Select the user's prefered school
  useEffect(() => {
    if (userPreferences?.schoolId && Array.isArray(schools)) {
      const index = schools.findIndex(
        (school) => school.id === userPreferences?.schoolId,
      );
      setSelectedSchool(
        index < 0 || index >= schools.length ? schools[0] : schools[index],
      );
    } else {
      setSelectedSchool(undefined);
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
