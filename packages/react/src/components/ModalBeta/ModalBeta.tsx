/**
 * ModalBeta Component
 *
 * Next-generation modal following the new design system ("↪︎ Modals"),
 * the same way `ButtonBeta` follows the new button design system.
 *
 * This intentionally duplicates a small amount of behaviour from `Modal`
 * (focus trap, escape-to-close, click-outside, backdrop) rather than
 * extending it: `Modal` is meant to be fully replaced by `ModalBeta` in a
 * later, dedicated migration, at which point `Modal` will be deleted.
 *
 * @see WAI-ARIA https://www.w3.org/WAI/ARIA/apg/patterns/dialogmodal/
 */
import { forwardRef, Ref, useCallback, useEffect } from 'react';

import { animated, useTransition } from '@react-spring/web';
import clsx from 'clsx';

import { useClickOutside, useKeyPress, useTrapFocus } from '../../hooks';
import ModalBetaBody from './ModalBetaBody';
import { ModalBetaContext, ModalBetaContextProps } from './ModalBetaContext';
import ModalBetaFooter from './ModalBetaFooter';
import ModalBetaHeader from './ModalBetaHeader';

export type ModalBetaElement = HTMLDivElement;

export type ModalBetaSize = 's' | 'm' | 'l' | 'xl';

export interface ModalBetaProps {
  /**
   * Modal id (useful when multiple modal on the same page)
   */
  id: string;

  /**
   * Modal testid
   */
  ['data-testid']?: string;

  /**
   * Is Modal Open
   */
  isOpen: boolean;

  /**
   * Function to call when closing modal
   */
  onModalClose: () => void;

  /**
   * Size of the modal (width, padding and corner radius)
   */
  size?: ModalBetaSize;

  /**
   * ID of the HTML element to receive focus when modal is active.
   */
  focusId?: string;

  /**
   * Children
   */
  children: React.ReactNode;
}

/**
 * ModalBeta Component
 */
const Root = forwardRef(
  (
    {
      id,
      isOpen,
      onModalClose,
      size = 'm',
      focusId,
      children,
      ...otherDivProps
    }: ModalBetaProps,
    ref: Ref<ModalBetaElement>,
  ) => {
    const ariaLabelId = `aria_label_${id}`;
    const ariaDescriptionId = `aria_desc_${id}`;

    // Disabled while closed: a ModalBeta instance stays mounted during its
    // react-spring leave transition after `isOpen` turns false (e.g. a
    // consumer keeps it rendered and just flips `isOpen` to switch to a
    // different modal, as UsefulLinksModal/LinkForm do). Without this guard,
    // its click-outside listener stays active during that transition and
    // treats any click inside the newly-opened modal as "outside itself",
    // closing both.
    const modalRef = useClickOutside(
      onModalClose,
      undefined,
      undefined,
      isOpen,
    );
    const trapRef = useTrapFocus(isOpen);
    // Stable across re-renders (unlike an inline arrow function): an inline
    // callback ref is recreated every render, which makes React detach then
    // reattach it on each one, including while the modal's own content
    // re-renders (e.g. typing into a form field triggers validation state
    // updates).
    const setDialogRef = useCallback(
      (node: HTMLDivElement | null) => {
        modalRef.current = node;
        trapRef.current = node;
      },
      [modalRef, trapRef],
    );

    useKeyPress(onModalClose, ['Escape']);

    useEffect(() => {
      if (isOpen) {
        // a11y: prevent body scrolling while the modal is active
        document.body.style.overflow = 'hidden';
        // a11y: set focus to focusId element
        // (if focusId is not set, focus goes to the close button, cf. ModalBetaHeader)
        if (focusId) {
          const elem = document.getElementById(focusId);
          elem?.focus();
        }
      }

      return () => {
        document.body.style.overflow = '';
      };
    }, [focusId, isOpen]);

    const modalClasses = clsx('modal-beta', `modal-beta--${size}`);

    const modalContextValue: ModalBetaContextProps = {
      ariaLabelId,
      ariaDescriptionId,
      focusId,
    };

    const transition = useTransition(isOpen, {
      from: { y: -20, opacity: 0 },
      enter: { y: 0, opacity: 1 },
      leave: { y: 20, opacity: 0 },
    });

    return (
      <ModalBetaContext.Provider value={modalContextValue}>
        {transition((style, isOpen) => (
          <>
            {isOpen && (
              <animated.div
                id={id}
                ref={ref}
                role="dialog"
                aria-modal="true"
                aria-labelledby={ariaLabelId}
                aria-describedby={ariaDescriptionId}
                className={modalClasses}
                style={style}
                tabIndex={-1}
                {...otherDivProps}
              >
                <div
                  id={`${id}_ref`}
                  ref={setDialogRef}
                  className="modal-beta-dialog"
                >
                  <div className="modal-beta-content">{children}</div>
                </div>
              </animated.div>
            )}
            {isOpen && <div className="modal-beta-backdrop"></div>}
          </>
        ))}
      </ModalBetaContext.Provider>
    );
  },
);

const ModalBeta = Object.assign(Root, {
  Header: ModalBetaHeader,
  Body: ModalBetaBody,
  Footer: ModalBetaFooter,
});

Root.displayName = 'ModalBeta';

export default ModalBeta;
