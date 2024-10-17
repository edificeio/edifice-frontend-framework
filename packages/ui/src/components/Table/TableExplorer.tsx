/**
 * TableExplorer  Component
 *
 * @see Docs     https://edifice-frontend-framework.vercel.app/?path=/docs/components-core-table--base
 * @see Source   https://github.com/opendigitaleducation/edifice-frontend-framework/blob/main/packages/core/src/Table/Table.tsx
 * @see WAI-ARIA https://www.w3.org/WAI/ARIA/apg/patterns/table/
 */

import { forwardRef, Ref } from 'react';

export type TableExplorerRef = HTMLTableElement;

export interface TableExplorerProps {
  children?: Array<React.ReactElement<HTMLTableSectionElement>>;
}

const TableExplorer = forwardRef(
  ({ children }: TableExplorerProps, ref: Ref<TableExplorerRef>) => {
    return (
      <>
        <table ref={ref} className="table-explorer">
          {children}
        </table>
      </>
    );
  },
);

TableExplorer.displayName = 'TableExplorer';

export default TableExplorer;
