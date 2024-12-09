export const TableThead = (
  props: React.HTMLAttributes<HTMLTableSectionElement>,
) => {
  const { children, ...restProps } = props;
  return <thead {...restProps}>{children}</thead>;
};

TableThead.displayName = 'Table.Thead';
