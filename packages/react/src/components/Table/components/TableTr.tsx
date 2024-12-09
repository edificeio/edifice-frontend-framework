export const TableTr = (props: React.HTMLAttributes<HTMLTableRowElement>) => {
  const { children, ...restProps } = props;
  return <tr {...restProps}>{children}</tr>;
};

TableTr.displayName = 'Table.Tr';
