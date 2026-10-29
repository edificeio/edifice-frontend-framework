import {
  ReactNode,
  Ref,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
} from 'react';

import { DropdownContext } from './DropdownContext';
import { useMatchRegistry } from './useMatchRegistry';

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
    const context = useContext(DropdownContext);
    const { hasMatches, reportMatch, unregisterMatch } = useMatchRegistry();

    const parentReportMatch = context?.reportMatch;
    const parentUnregisterMatch = context?.unregisterMatch;

    const groupReportMatch = useCallback(
      (id: string, isMatch: boolean) => {
        reportMatch(id, isMatch);
        parentReportMatch?.(id, isMatch);
      },
      [reportMatch, parentReportMatch],
    );

    const groupUnregisterMatch = useCallback(
      (id: string) => {
        unregisterMatch(id);
        parentUnregisterMatch?.(id);
      },
      [unregisterMatch, parentUnregisterMatch],
    );

    // Only in the group's registry: the dropdown's "no results" ignores these items.
    const registerUnfilteredItem = useCallback(
      (id: string) => {
        reportMatch(id, true);
        return () => unregisterMatch(id);
      },
      [reportMatch, unregisterMatch],
    );

    const groupContext = useMemo(
      () =>
        context && {
          ...context,
          reportMatch: groupReportMatch,
          unregisterMatch: groupUnregisterMatch,
          registerUnfilteredItem,
        },
      [context, groupReportMatch, groupUnregisterMatch, registerUnfilteredItem],
    );

    return (
      <DropdownContext.Provider value={groupContext}>
        {/* Items stay mounted when filtered out, so the group shows up again when the query changes. */}
        <div ref={forwardRef} role="group" hidden={!hasMatches}>
          <span className="small px-4">
            <strong>{label}</strong>
          </span>
          {children}
        </div>
      </DropdownContext.Provider>
    );
  },
);

DropdownMenuGroup.displayName = 'Dropdown.MenuGroup';

export default DropdownMenuGroup;
