import type { School } from '@edifice.io/client';
import CantineModal from './CantineModal';
import { useCantineModal } from './hooks/useCantineModal';

export interface CantineModalContainerProps {
  schools: School[];
  selectedSchool?: School;
  onSelectedSchoolChange: (schoolId: string) => void;
  onClose: () => void;
}

export function CantineModalContainer({
  schools,
  selectedSchool,
  onSelectedSchoolChange,
  onClose,
}: CantineModalContainerProps) {
  const cantineModal = useCantineModal(
    schools,
    selectedSchool,
    onSelectedSchoolChange,
  );

  return <CantineModal isOpen onClose={onClose} {...cantineModal} />;
}

CantineModalContainer.displayName = 'CantineModalContainer';
