import { render } from '~/setup';

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

describe('Table', () => {
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
