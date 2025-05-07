/**
 * Table  Component
 * @see WAI-ARIA https://www.w3.org/WAI/ARIA/apg/patterns/table/
 */

import { CSSProperties, forwardRef, ReactNode, Ref } from 'react';
import { TableTbody } from './TableTbody';
import { TableTd } from './TableTd';
import { TableTh } from './TableTh';
import { TableThead } from './TableThead';
import { TableTr } from './TableTr';
export type TableRef = HTMLTableElement;

export interface TableProps {
  children?: Array<React.ReactElement<HTMLTableSectionElement>> | any;
  maxHeight?: string;
}

const Root = forwardRef(
  (
    { children, maxHeight }: { children: ReactNode; maxHeight?: string },
    ref: Ref<TableRef>,
  ) => {
    const style: CSSProperties = {
      maxHeight,
      overflowY: 'auto',
    };

    return (
      <div className="table-responsive" style={maxHeight ? style : {}}>
        <table
          ref={ref}
          className="table align-middle mb-0"
          style={{ overflow: maxHeight ? 'visible' : 'hidden' }}
        >
          {children}
        </table>
      </div>
    );
  },
);

Root.displayName = 'Table';

const Table = Object.assign(Root, {
  Thead: TableThead,
  Th: TableTh,
  Tbody: TableTbody,
  Tr: TableTr,
  Td: TableTd,
});

export default Table;
