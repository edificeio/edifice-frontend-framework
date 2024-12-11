import { createContext, useContext } from 'react';

import { UseDropdownProps } from '../../hooks/useDropdown/useDropdown';

type OmittedProps = Omit<UseDropdownProps, 'triggerRef' | 'menuRef'>;
export interface DropdownContextProps extends OmittedProps {
  block?: boolean;
}

export const DropdownContext = createContext<DropdownContextProps | null>(
  null!,
);

export const useDropdownContext = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error(`Cannot be rendered outside the Dropdown Component`);
  }
  return context;
};
