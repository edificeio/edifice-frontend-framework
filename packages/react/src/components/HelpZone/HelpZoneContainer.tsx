import { useZendeskGuide } from '../../hooks';
import HelpZone from './HelpZone';

export function HelpZoneContainer() {
  const { isReady, isOpen, open, close } = useZendeskGuide();

  return (
    <HelpZone isReady={isReady} isOpen={isOpen} onOpen={open} onClose={close} />
  );
}

HelpZoneContainer.displayName = 'HelpZoneContainer';
