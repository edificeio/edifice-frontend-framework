import { ReactNode, Ref, forwardRef } from 'react';

export interface DropdownMenuGroupProps {
  /**
   * Label
   */
  label: string;
  /**
   * Children Node
   */
  children: ReactNode;
}

const DropdownMenuGroup = forwardRef(
  (
    { label, children }: DropdownMenuGroupProps,
    forwardRef: Ref<HTMLDivElement>,
  ) => {
    return (
      <div ref={forwardRef} role="group">
        <span className="small px-4">
          <strong>{label}</strong>
        </span>
        {children}
      </div>
    );
  },
);

DropdownMenuGroup.displayName = 'Dropdown.MenuGroup';

export default DropdownMenuGroup;
