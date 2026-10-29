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

    // Track the matches of this group's items, and keep reporting them to the Dropdown.
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

    const groupContext = useMemo(
      () =>
        context && {
          ...context,
          reportMatch: groupReportMatch,
          unregisterMatch: groupUnregisterMatch,
        },
      [context, groupReportMatch, groupUnregisterMatch],
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
