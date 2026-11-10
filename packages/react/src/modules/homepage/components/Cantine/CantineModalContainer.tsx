import type { School } from '@edifice.io/client';
import CantineModal from './CantineModal';
import { useCantineModal } from './hooks/useCantineModal';

export interface CantineModalContainerProps {
  schools: School[];
  defaultSchool?: School;
  onClose: () => void;
}

export function CantineModalContainer({
  schools,
  defaultSchool,
  onClose,
}: CantineModalContainerProps) {
  const cantineModal = useCantineModal(schools, defaultSchool);

  return <CantineModal isOpen onClose={onClose} {...cantineModal} />;
}

CantineModalContainer.displayName = 'CantineModalContainer';
