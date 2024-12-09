export const TableTd = (props: React.HTMLAttributes<HTMLTableCellElement>) => {
  const { children, ...restProps } = props;
  return <td {...restProps}>{children}</td>;
};

TableTd.displayName = 'Table.Td';
