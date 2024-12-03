/**
 * Table  Component
 * @see WAI-ARIA https://www.w3.org/WAI/ARIA/apg/patterns/table/
 */

import { forwardRef, ReactNode, Ref } from "react";
import { TableTbody } from "./TableTbody";
import { TableTd } from "./TableTd";
import { TableTh } from "./TableTh";
import { TableThead } from "./TableThead";
import { TableTr } from "./TableTr";
export type TableRef = HTMLTableElement;

export interface TableProps {
  children?: Array<React.ReactElement<HTMLTableSectionElement>> | any;
}

const Root = forwardRef(
  ({ children }: { children: ReactNode }, ref: Ref<TableRef>) => {
    return (
      <div className="table-responsive">
        <table ref={ref} className="table align-middle mb-0">
          {children}
        </table>
      </div>
    );
  },
);

Root.displayName = "Table";

const Table = Object.assign(Root, {
  Thead: TableThead,
  Th: TableTh,
  Tbody: TableTbody,
  Tr: TableTr,
  Td: TableTd,
});

export default Table;
