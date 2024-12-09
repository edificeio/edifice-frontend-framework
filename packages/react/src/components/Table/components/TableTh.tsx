export const TableTh = (props: React.HTMLAttributes<HTMLTableCellElement>) => {
  const { children, ...restProps } = props;

  return <th {...restProps}>{children}</th>;
};

TableTh.displayName = 'Table.Th';
