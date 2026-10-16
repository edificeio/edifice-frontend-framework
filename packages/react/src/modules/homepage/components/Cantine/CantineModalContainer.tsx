import CantineModal from './CantineModal';
import { useCantineModal } from './hooks/useCantineModal';

export interface CantineModalContainerProps {
  onClose: () => void;
}

export function CantineModalContainer({ onClose }: CantineModalContainerProps) {
  const cantineModal = useCantineModal();

  return <CantineModal isOpen onClose={onClose} {...cantineModal} />;
}

CantineModalContainer.displayName = 'CantineModalContainer';
