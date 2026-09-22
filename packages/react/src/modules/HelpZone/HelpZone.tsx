import { useEffect, useRef, useState } from 'react';

import clsx from 'clsx';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { ButtonBeta, Tooltip } from '../../components';
import { IconQuestion } from '../icons/components';
import {
  IconLogoEdificeFull,
  IconLogoEdificeSmall,
} from '../icons/components/logo';

export interface HelpZoneProps {
  /** True once the support widget is loaded and can be opened. */
  isReady: boolean;
  /** True while the support panel is open. */
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const HelpZone = ({ isReady, isOpen, onOpen, onClose }: HelpZoneProps) => {
  const { t } = useTranslation();
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const [isCompact, setIsCompact] = useState(false);
  const questionButtonRef = useRef<HTMLButtonElement>(null);

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
    if (isCompact) {
      return;
    }

    const goCompact = () => setIsCompact(true);

    // The "?" button's own click shouldn't trigger this — it already has
    // its own effect (opening the panel, which fades the whole zone out),
    // snapping to compact at the same time would just be visual noise.
    const handleClick = (event: MouseEvent) => {
      if (
        questionButtonRef.current &&
        event.target instanceof Node &&
        questionButtonRef.current.contains(event.target)
      ) {
        return;
      }

      goCompact();
    };

    document.addEventListener('scroll', goCompact, {
      capture: true,
      passive: true,
    });
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('scroll', goCompact, { capture: true });
      document.removeEventListener('click', handleClick);
    };
  }, [isCompact]);

  if (!isReady || !portalRoot) {
    return null;
  }

  const handleOpenHelpZone = () => (isOpen ? onClose() : onOpen());

  return createPortal(
    <div
      className={clsx('help-zone', { 'help-zone--open': isOpen })}
      aria-hidden={isOpen}
    >
      <a
        className="help-zone-badge"
        href="https://edifice.io/releases/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('help-zone.edifice-releases-notes')}
      >
        <Tooltip
          message={t('help-zone.edifice-releases-notes')}
          placement="top"
          className="help-zone-tooltip"
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
        </Tooltip>
      </a>
      <span className="help-zone-divider" />
      <ButtonBeta
        ref={questionButtonRef}
        className="help-zone-question"
        aria-label={t('help-zone.support.open')}
        color="tertiary"
        variant="ghost"
        onClick={handleOpenHelpZone}
      >
        <Tooltip message={t('help-zone.support.open')} placement="top">
          <IconQuestion width={24} height={24} color="white" />
        </Tooltip>
      </ButtonBeta>
    </div>,
    portalRoot,
  );
};

HelpZone.displayName = 'HelpZone';

export default HelpZone;
