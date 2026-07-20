import { createRef } from 'react';

import { render, screen } from '~/setup';
import Table from './components/Table';

function BasicTable(props: { maxHeight?: string } = {}) {
  return (
    <Table maxHeight={props.maxHeight}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Value</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>
          <Table.Td data-testid="cell-name">Row 1</Table.Td>
          <Table.Td>42</Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
}

describe('Table', () => {
  it('renders the table semantics with headers and cells', () => {
    render(<BasicTable />);

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(2);
    expect(
      screen.getByRole('columnheader', { name: 'Name' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Row 1' })).toBeInTheDocument();
    expect(screen.getByTestId('cell-name')).toHaveTextContent('Row 1');
  });

  it('hides table overflow and skips wrapper max-height style when maxHeight is not set', () => {
    render(<BasicTable />);

    const table = screen.getByRole('table');
    expect(table).toHaveStyle({ overflow: 'hidden' });
    expect(table.parentElement).not.toHaveStyle({ maxHeight: '300px' });
  });

  it('applies maxHeight to the wrapper and switches table overflow to visible', () => {
    render(<BasicTable maxHeight="300px" />);

    const table = screen.getByRole('table');
    expect(table).toHaveStyle({ overflow: 'visible' });
    expect(table.parentElement).toHaveStyle({
      maxHeight: '300px',
      overflowY: 'auto',
    });
  });

  it('forwards a ref to the underlying table element', () => {
    const ref = createRef<HTMLTableElement>();
    render(
      <Table ref={ref}>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>content</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>,
    );

    expect(ref.current?.tagName).toBe('TABLE');
  });
});
