import { useZendeskGuide } from '../../../hooks';

import HelpZone from './HelpZone';
// Edifice blue — `support.info.700` in the theme configs (e.g.
// `packages/bootstrap/src/themes/configs/_edifice2d.scss`) resolves to
// `$info-700`/`$blue-700` the same way across every theme, so it stays the
// stable Edifice brand blue regardless of which theme is active. Read from
// the CSS custom property (rather than duplicating the hex here) so it
// can't silently drift from the design tokens.
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
