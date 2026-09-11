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

export interface HelpZoneProps {
  /** True once the support widget is loaded and can be opened. */
  isReady: boolean;
  /** True while the support panel is open. */
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

/**
 * Floating help zone: an Edifice badge (link to the platform release notes)
 * next to a help button driving the support widget, agnostic of which
 * provider that is. Portal-mounted into `#portal`, like
 * `Layout/components/Help.tsx`.
 */
const HelpZone = ({ isReady, isOpen, onOpen, onClose }: HelpZoneProps) => {
  const { t } = useTranslation();
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const [isCompact, setIsCompact] = useState(false);

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
    <div className="help-zone">
      <a
        className="help-zone-badge"
        href="https://edifice.io/releases/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('portal.header.navigation.whatsnew')}
      >
        <span
          className={clsx('help-zone-logo', {
            'help-zone-logo--compact': isCompact,
            'help-zone-logo--full': !isCompact,
          })}
        >
          {isCompact ? (
            <IconLogoEdificeSmall width={18} height={18} />
          ) : (
            <IconLogoEdificeFull width={81} height={18} />
          )}
        </span>
      </a>
      <span className="help-zone-divider" />
      <ButtonBeta
        className="help-zone-question"
        aria-label={t(
          isOpen ? 'homepage.help-zone.close' : 'homepage.help-zone.open',
        )}
        color="tertiary"
        variant="ghost"
        onClick={handleClick}
      >
        <IconQuestion width={24} height={24} color="white" />
      </ButtonBeta>
    </div>,
    portalRoot,
  );
};

HelpZone.displayName = 'HelpZone';

export default HelpZone;
