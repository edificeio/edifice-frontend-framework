import { useState } from 'react';
import { useUserSchools } from '../../hooks/useUserSchools';
import Cantine from './Cantine';
import { CantineModalContainer } from './CantineModalContainer';
import { useCantine } from './hooks/useCantine';

export function CantineContainer() {
  const { schools, selectedSchool } = useUserSchools();
  const { sections, status } = useCantine(selectedSchool);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Cantine
        status={status}
        sections={sections}
        handleFullScreenClick={() => setIsModalOpen(true)}
      />
      {isModalOpen && (
        <CantineModalContainer
          schools={schools}
          defaultSchool={selectedSchool}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

CantineContainer.displayName = 'CantineContainer';
