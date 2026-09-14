export const TableTd = (
  props: React.TdHTMLAttributes<HTMLTableCellElement>,
) => {
  const { children, ...restProps } = props;
  return <td {...restProps}>{children}</td>;
};

TableTd.displayName = 'Table.Td';
