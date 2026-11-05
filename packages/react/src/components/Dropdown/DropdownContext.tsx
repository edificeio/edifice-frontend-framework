import { createContext, useContext } from 'react';

import { UseDropdownProps } from '../../hooks/useDropdown/useDropdown';

type OmittedProps = Omit<UseDropdownProps, 'triggerRef' | 'menuRef'>;
export interface DropdownContextProps extends OmittedProps {
  block?: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  hasSearchInput: boolean;
  setHasSearchInput: (hasSearchInput: boolean) => void;
  rootElement: HTMLDivElement | null;
  hasMatches: boolean;
  reportMatch: (id: string, isMatch: boolean) => void;
  unregisterMatch: (id: string) => void;
  /**
   * Provided by MenuGroup: an item without searchValue keeps its group visible,
   * without counting as a search result. Returns the unregister function.
   */
  registerUnfilteredItem?: (id: string) => () => void;
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
