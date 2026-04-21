import { ReactNode } from 'react';

interface DropdownItemHiddenProps {
  children: ReactNode;
  /**
   * When true, collapses height to 0 while keeping the item in the flow.
   * Use this when the container width must stay stable during search filtering.
   * Defaults to false (display: none).
   */
  collapse?: boolean;
}

const DropdownItemHidden = ({
  children,
  collapse,
}: DropdownItemHiddenProps) => (
  <div
    aria-hidden="true"
    style={
      collapse
        ? {
            height: 0,
            overflow: 'hidden',
            margin: 0,
            pointerEvents: 'none',
            width: '100%',
            maxWidth: 'max-content',
          }
        : { display: 'none', width: '100%', maxWidth: 'max-content' }
    }
  >
    {children}
  </div>
);

export default DropdownItemHidden;
