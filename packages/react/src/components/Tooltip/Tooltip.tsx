import { ComponentPropsWithRef, ReactNode, useState } from 'react';

import clsx from 'clsx';
import { usePopper } from 'react-popper';

export type Placement =
  | 'auto'
  | 'auto-start'
  | 'auto-end'
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'left'
  | 'left-start'
  | 'left-end';

export interface TooltipProps extends ComponentPropsWithRef<'div'> {
  /**
   * Text to display inside tooltip
   */
  message: string | undefined;
  /**
   * Element to be wrapped as Tooltip trigger
   */
  children: React.ReactNode;
  /**
   * Tooltip position
   */
  placement?: Placement;
  /**
   * Tooltip left icon
   */
  icon?: ReactNode;
}

const Tooltip = ({
  children,
  message,
  icon = null,
  placement = 'auto',
  ...restProps
}: TooltipProps) => {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null,
  );
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement,
    modifiers: [
      {
        name: 'arrow',
        options: {
          element: arrowElement,
        },
      },
    ],
  });

  const [visible, setVisible] = useState<boolean>(false);

  return (
    <>
      <div
        className="d-inline-block position-relative"
        ref={setReferenceElement}
        onMouseEnter={() => {
          setVisible(true);
        }}
        onMouseLeave={() => {
          setVisible(false);
        }}
        {...restProps}
      >
        {children}
      </div>
      {visible && message && (
        <div
          className={clsx('tooltip d-block show mb-12 z-2', `bs-tooltip-auto`)}
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          <div className="tooltip-inner shadow-hover d-flex gap-8 align-items-center">
            {icon && icon}
            <div>{message}</div>
          </div>
          <div
            className="tooltip-arrow"
            ref={setArrowElement}
            style={styles.arrow}
          ></div>
        </div>
      )}
    </>
  );
};

export default Tooltip;
