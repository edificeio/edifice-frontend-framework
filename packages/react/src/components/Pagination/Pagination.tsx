import { Pagination as AntdPagination } from 'antd';

export interface PaginationProps {
  /** Current page (1-based) */
  current: number;
  /** Total number of items */
  total: number;
  /** Number of items per page */
  pageSize: number;
  /** Called when the page changes */
  onChange: (page: number) => void;
  /** Optional class for styling purpose */
  className?: string;
}

/**
 * Pagination component for navigating through pages of results.
 * Wraps antd Pagination with a simplified, stable API.
 */
export function Pagination({
  current,
  total,
  pageSize,
  onChange,
  className,
}: PaginationProps) {
  return (
    <AntdPagination
      align="center"
      showSizeChanger={false}
      current={current}
      total={total}
      pageSize={pageSize}
      onChange={onChange}
      className={className}
    />
  );
}
