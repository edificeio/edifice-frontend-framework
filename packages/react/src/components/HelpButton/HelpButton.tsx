import { useEffect, useState } from 'react';

import clsx from 'clsx';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

import { IconQuestion } from '../../modules/icons/components';
import {
  IconLogoEdificeFull,
  IconLogoEdificeSmall,
} from '../../modules/icons/components/logo';
import { ButtonBeta } from '../ButtonBeta';

export interface HelpButtonProps {
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
const HelpButton = ({ isReady, isOpen, onOpen, onClose }: HelpButtonProps) => {
  const { t } = useTranslation();
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    // Hides the underlying support widget's native launcher while this
    // custom button is mounted (see `_help-button.scss`), without touching
    // pages that never render HelpButton.
    document.body.classList.add('help-button-active');

    // Resolved in an effect (after commit) rather than during render, since
    // `#portal` may not exist in the DOM yet on the very first render.
    setPortalRoot(document.getElementById('portal'));

    return () => {
      document.body.classList.remove('help-button-active');
    };
  }, []);

  useEffect(() => {
    // Once compact, stay compact: no listener left to re-run, no reverting
    // back to the full logo on scroll-up.
    if (isCompact) {
      return;
    }

    const goCompact = () => setIsCompact(true);

    // `scroll` doesn't bubble, so a listener on `window`/`document` in the
    // (default) bubble phase only ever sees the page's own scroll — never a
    // scroll happening inside a nested `overflow: auto` container, which is
    // the *actual* scrollable region in many app layouts (e.g. PageLayout's
    // main area) rather than the document itself. The capture phase, unlike
    // bubbling, still traverses down through `document` on its way to any
    // descendant target regardless of that target's own bubbling behavior —
    // listening there catches a scroll anywhere on the page.
    document.addEventListener('scroll', goCompact, {
      capture: true,
      passive: true,
    });
    document.addEventListener('click', goCompact);

    return () => {
      document.removeEventListener('scroll', goCompact, { capture: true });
      document.removeEventListener('click', goCompact);
    };
  }, [isCompact]);

  if (!isReady || !portalRoot) {
    return null;
  }

  const handleClick = () => (isOpen ? onClose() : onOpen());

  return createPortal(
    <ButtonBeta
      className="help-button"
      aria-label={t(
        isOpen ? 'homepage.help-button.close' : 'homepage.help-button.open',
      )}
      color="tertiary"
      variant="ghost"
      onClick={handleClick}
    >
      <span
        className={clsx('help-button-logo', {
          'help-button-logo--compact': isCompact,
          'help-button-logo--full': !isCompact,
        })}
      >
        {isCompact ? (
          <IconLogoEdificeSmall width={18} height={18} />
        ) : (
          <IconLogoEdificeFull width={81} height={18} />
        )}
      </span>
      <span className="help-button-divider" />
      <IconQuestion width={24} height={24} color="white" />
    </ButtonBeta>,
    portalRoot,
  );
};

HelpButton.displayName = 'HelpButton';

export default HelpButton;
