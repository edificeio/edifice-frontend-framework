import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  useEffect,
} from 'react';

import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { ButtonBeta } from '../../../components';
import { IconClose } from '../../../modules/icons/components';
import { useOverlayStore } from '../store/overlayStore';

export interface PageLayoutOverlayProps extends ComponentPropsWithoutRef<'aside'> {
  children: ReactNode;
  /** Called when the overlay requests to be closed (e.g. clicking the backdrop) */
  onClose?: () => void;
  /** Show a close button inside the overlay. Defaults to true. */
  closeButton?: boolean;
  /** Show a backdrop behind the overlay. Defaults to false. */
  backdrop?: boolean;
}

const PageLayoutOverlay = ({
  children,
  onClose,
  closeButton = true,
  backdrop = false,
  className,
  ...props
}: PageLayoutOverlayProps) => {
  const { t } = useTranslation();
  const isOverlayOpened = useOverlayStore.use.overlayOpen();
  const updateOverlayOpen = useOverlayStore.use.updateOverlayOpen();

  const handleClose = () => {
    updateOverlayOpen(false);
    onClose?.();
  };

  useEffect(() => {
    if (!isOverlayOpened) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOverlayOpened, onClose]);

  return (
    <>
      {isOverlayOpened && backdrop && (
        <div
          className="pagelayout-overlaybackdrop"
          aria-hidden="true"
          onClick={handleClose}
        />
      )}
      <aside
        className={clsx(
          'pagelayout-overlay',
          { 'pagelayout-overlay-open': isOverlayOpened },
          className,
        )}
        aria-hidden={!isOverlayOpened}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore — inert is not yet in React's HTMLAttributes but is valid HTML
        inert={!isOverlayOpened ? '' : undefined}
        {...props}
      >
        {closeButton && isOverlayOpened && (
          <ButtonBeta
            aria-label={t('close')}
            color="tertiary"
            leftIcon={<IconClose />}
            type="button"
            variant="ghost"
            title={t('close')}
            onClick={handleClose}
            className="pagelayout-overlay-close-button"
            data-testid="pagelayout-overlay-close-button"
          />
        )}
        {children}
      </aside>
    </>
  );
};

PageLayoutOverlay.displayName = 'PageLayout.Overlay';

export default PageLayoutOverlay;
