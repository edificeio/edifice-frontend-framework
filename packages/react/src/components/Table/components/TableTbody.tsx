type Props = React.HTMLAttributes<HTMLTableSectionElement>;

export const TableTbody = (props: Props) => {
  const { children, ...restProps } = props;

  return <tbody {...restProps}>{children}</tbody>;
};

TableTbody.displayName = 'Table.Tbody';
