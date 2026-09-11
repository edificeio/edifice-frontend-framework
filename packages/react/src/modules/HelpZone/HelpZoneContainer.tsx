import { useZendeskGuide } from '../../hooks';

import HelpZone from './HelpZone';

function getZendeskThemeColor() {
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--primitive-blue-400')
    .trim();
}
export function HelpZoneContainer() {
  const headerColor = getZendeskThemeColor();
  const { isReady, isOpen, open, close } = useZendeskGuide(headerColor);

  return (
    <HelpZone isReady={isReady} isOpen={isOpen} onOpen={open} onClose={close} />
  );
}

HelpZoneContainer.displayName = 'HelpZoneContainer';
