export const TableThead = (
  props: React.HTMLAttributes<HTMLTableSectionElement>,
) => {
  const { children, ...restProps } = props;
  return <thead {...restProps}>{children}</thead>;
};

export const TableTh = (props: React.HTMLAttributes<HTMLTableCellElement>) => {
  const { children, ...restProps } = props;

  return <th {...restProps}>{children}</th>;
};

export const TableTr = (props: React.HTMLAttributes<HTMLTableRowElement>) => {
  const { children, ...restProps } = props;
  return <tr {...restProps}>{children}</tr>;
};

export const TableTbody = (
  props: React.HTMLAttributes<HTMLTableSectionElement>,
) => {
  const { children, ...restProps } = props;

  return <tbody {...restProps}>{children}</tbody>;
};

export const TableTd = (props: React.HTMLAttributes<HTMLTableCellElement>) => {
  const { children, ...restProps } = props;
  return <td {...restProps}>{children}</td>;
};

TableThead.displayName = 'Table.Thead';
TableTh.displayName = 'Table.Th';
TableTbody.displayName = 'Table.Tbody';
TableTr.displayName = 'Table.Tr';
TableTd.displayName = 'Table.Td';
