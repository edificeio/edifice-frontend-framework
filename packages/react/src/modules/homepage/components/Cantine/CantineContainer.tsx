import Cantine from './Cantine';
import { useCantine } from './useCantine';

export function CantineContainer() {
  const { sections, status } = useCantine();

  const handleFullScreenClick = (): void => {
    // The full-screen modal is not part of this iteration; the button is
    // kept visible (per design) but currently inert.
  };

  return (
    <Cantine
      status={status}
      sections={sections}
      handleFullScreenClick={handleFullScreenClick}
    />
  );
}

CantineContainer.displayName = 'CantineContainer';
