import { useState } from 'react';
import Cantine from './Cantine';
import { CantineModalContainer } from './CantineModalContainer';
import { useCantine } from './hooks/useCantine';

export function CantineContainer() {
  const { sections, status } = useCantine();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Cantine
        status={status}
        sections={sections}
        handleFullScreenClick={() => setIsModalOpen(true)}
      />
      {isModalOpen && (
        <CantineModalContainer onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}

CantineContainer.displayName = 'CantineContainer';
