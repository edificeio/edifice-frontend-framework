import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  useEffect,
} from 'react';

import clsx from 'clsx';

export interface PageLayoutOverlayProps extends ComponentPropsWithoutRef<'aside'> {
  children: ReactNode;
  /** Whether the overlay panel is open */
  open: boolean;
  /** Called when the overlay requests to be closed (e.g. clicking the backdrop) */
  onClose?: () => void;
  /** Show a backdrop behind the overlay. Defaults to false. */
  backdrop?: boolean;
}

const PageLayoutOverlay = ({
  children,
  open,
  onClose,
  backdrop = false,
  className,
  ...props
}: PageLayoutOverlayProps) => {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  return (
    <>
      {open && backdrop && (
        <div
          className="pagelayout-overlaybackdrop"
          aria-hidden="true"
          onClick={onClose}
        />
      )}
      <aside
        className={clsx(
          'pagelayout-overlay',
          { 'pagelayout-overlay-open': open },
          className,
        )}
        aria-hidden={!open}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore — inert is not yet in React's HTMLAttributes but is valid HTML
        inert={!open ? '' : undefined}
        {...props}
      >
        {children}
      </aside>
    </>
  );
};

PageLayoutOverlay.displayName = 'PageLayout.Overlay';

export default PageLayoutOverlay;
