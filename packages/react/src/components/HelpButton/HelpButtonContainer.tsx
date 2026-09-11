import { useZendeskGuide } from '../../hooks';
import HelpButton from './HelpButton';

export function HelpButtonContainer() {
  const { isReady, isOpen, open, close } = useZendeskGuide();

  return (
    <HelpButton
      isReady={isReady}
      isOpen={isOpen}
      onOpen={open}
      onClose={close}
    />
  );
}

HelpButtonContainer.displayName = 'HelpButtonContainer';
