import { createRef } from 'react';

import { render, screen } from '~/setup';
import Table from './components/Table';

interface Row {
  id: string;
  name: string;
}

const makeData = (count: number): Row[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `row-${index}`,
    name: `Item ${index}`,
  }));

const header = (
  <Table.Thead>
    <Table.Tr>
      <Table.Th>Name</Table.Th>
    </Table.Tr>
  </Table.Thead>
);

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

  it('renders compound children unchanged (legacy API)', () => {
    const { container } = render(
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {makeData(3).map((row) => (
            <Table.Tr key={row.id}>
              <Table.Td>{row.name}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>,
    );

    expect(container.querySelectorAll('tbody tr')).toHaveLength(3);
    expect(container.querySelector('.table--virtualized')).toBeNull();
  });

  it('renders every row (no virtualization) below the threshold', () => {
    const data = makeData(5);
    const { container } = render(
      <Table<Row>
        items={data}
        getRowKey={(item) => item.id}
        header={header}
        renderRow={(item) => <Table.Td>{item.name}</Table.Td>}
      />,
    );

    expect(container.querySelectorAll('tbody tr')).toHaveLength(5);
    expect(container.querySelector('.table--virtualized')).toBeNull();
  });

  it('does not virtualize when maxHeight is missing, even above the threshold', () => {
    const data = makeData(300);
    const { container } = render(
      <Table<Row>
        items={data}
        virtualizeThreshold={100}
        getRowKey={(item) => item.id}
        header={header}
        renderRow={(item) => <Table.Td>{item.name}</Table.Td>}
      />,
    );

    expect(container.querySelector('.table--virtualized')).toBeNull();
    expect(container.querySelectorAll('tbody tr')).toHaveLength(300);
  });

  it('virtualizes above the threshold: a window of rows + sized spacer', () => {
    const data = makeData(1000);
    const { container } = render(
      <Table<Row>
        items={data}
        maxHeight="400px"
        virtualizeThreshold={100}
        estimateRowHeight={44}
        getRowKey={(item) => item.id}
        header={header}
        renderRow={(item) => <Table.Td>{item.name}</Table.Td>}
      />,
    );

    expect(container.querySelector('.table--virtualized')).not.toBeNull();

    // Windowing: far fewer rows are mounted than the 1000 items.
    const dataRows = container.querySelectorAll('tbody tr[data-index]');
    expect(dataRows.length).toBeLessThan(1000);

    // A spacer reserves the full scroll height (≈ 1000 × estimate), proving the
    // virtualizer sized itself to the whole list while mounting only a window.
    const spacer = container.querySelector<HTMLElement>(
      'tbody tr[data-virtual-spacer]',
    );
    expect(spacer).not.toBeNull();
    expect(parseFloat(spacer!.style.height)).toBeGreaterThan(1000);
  });
});
