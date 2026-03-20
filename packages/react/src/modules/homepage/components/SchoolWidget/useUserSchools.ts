import { School } from '@edifice.io/client';
import { useEffect, useState } from 'react';
import { useEdificeClient } from 'src/providers';

export function useUserSchools() {
  const { userDescription } = useEdificeClient();
  const [selectedSchool, setSelectedSchool] = useState<School>();

  const schools = userDescription?.schools;

  useEffect(() => {
    setSelectedSchool(schools?.[0]);
  }, []);

  return {
    schools: schools ?? [],
    selectedSchool,
    handleSelectedSchoolChange: (school: School) => {
      setSelectedSchool(school);
    },
  };
}
