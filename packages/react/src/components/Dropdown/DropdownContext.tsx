import { createContext, useContext } from 'react';

import { UseDropdownProps } from '../../hooks/useDropdown/useDropdown';

type OmittedProps = Omit<UseDropdownProps, 'triggerRef' | 'menuRef'>;
export interface DropdownContextProps extends OmittedProps {
  block?: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  /** True while a `Dropdown.SearchInput` is displayed in place of the trigger. */
  hasSearchInput: boolean;
  setHasSearchInput: (hasSearchInput: boolean) => void;
  /** Dropdown root element, where the search input is displayed over the trigger. */
  rootElement: HTMLDivElement | null;
  hasMatches: boolean;
  reportMatch: (id: string, isMatch: boolean) => void;
  unregisterMatch: (id: string) => void;
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
