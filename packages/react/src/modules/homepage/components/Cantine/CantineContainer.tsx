import { WIDGET_NAME } from '@edifice.io/client';
import { useState } from 'react';
import { useUserSchools } from '../../hooks/useUserSchools';
import Cantine from './Cantine';
import { CantineModalContainer } from './CantineModalContainer';
import { useCantine } from './hooks/useCantine';

export function CantineContainer() {
  const { schools, selectedSchool, handleSelectedSchoolChange } =
    useUserSchools(WIDGET_NAME.CANTINE);
  const { sections, status } = useCantine(selectedSchool);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSchoolChange = (schoolId: string) => {
    if (schoolId === selectedSchool?.id) return;
    const school = schools.find((school) => school.id === schoolId);
    if (school) handleSelectedSchoolChange(school);
  };

  return (
    <>
      <Cantine
        status={status}
        sections={sections}
        handleFullScreenClick={() => setIsModalOpen(true)}
        schools={schools}
        selectedSchool={selectedSchool}
        onSelectedSchoolChange={handleSchoolChange}
      />
      {isModalOpen && (
        <CantineModalContainer
          schools={schools}
          selectedSchool={selectedSchool}
          onSelectedSchoolChange={handleSchoolChange}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

CantineContainer.displayName = 'CantineContainer';
