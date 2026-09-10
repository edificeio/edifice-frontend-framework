import { useEffect, useState } from 'react';

import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

import { Button } from '../Button';

export interface HelpZoneProps {
  /** True once the support widget is loaded and can be opened. */
  isReady: boolean;
  /** True while the support panel is open. */
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

/**
 * Floating help button, agnostic of the support widget it drives.
 * Portal-mounted into `#portal`, like `Layout/components/Help.tsx`.
 */
const HelpZone = ({ isReady, isOpen, onOpen, onClose }: HelpZoneProps) => {
  const { t } = useTranslation();
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Hides the underlying support widget's native launcher while this
    // custom button is mounted (see `_help-zone.scss`), without touching
    // pages that never render HelpZone.
    document.body.classList.add('help-zone-active');

    // Resolved in an effect (after commit) rather than during render, since
    // `#portal` may not exist in the DOM yet on the very first render.
    setPortalRoot(document.getElementById('portal'));

    return () => {
      document.body.classList.remove('help-zone-active');
    };
  }, []);

  if (!isReady || !portalRoot) {
    return null;
  }

  const handleClick = () => (isOpen ? onClose() : onOpen());

  return createPortal(
    <Button
      className="help-zone"
      aria-label={t(
        isOpen ? 'homepage.help-zone.close' : 'homepage.help-zone.open',
      )}
      color="tertiary"
      variant="ghost"
      onClick={handleClick}
    >
      Edifice
    </Button>,
    portalRoot,
  );
};

HelpZone.displayName = 'HelpZone';

export default HelpZone;
