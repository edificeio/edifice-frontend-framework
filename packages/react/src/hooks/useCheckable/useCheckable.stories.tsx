import { Meta, StoryObj } from '@storybook/react';
import { Checkbox, Table } from '../..';
import { useCheckable } from './useCheckable';

const meta: Meta<typeof useCheckable> = {
  title: 'Hooks/useCheckable',
};

export default meta;
type Story = StoryObj<typeof useCheckable>;

interface Data {
  id: string;
  title: string;
}

const data: Data[] = [
  {
    id: 'ab60dbdb-f3f0-4c99-a239-64c8a2f50c77',
    title: 'Title 1',
  },
  {
    id: 'a0d86fe6-909e-4c4a-8ceb-c15daee525a9',
    title: 'Title 2',
  },
];

export const Example: Story = {
  render: (args) => {
    const {
      selectedItems,
      allItemsSelected,
      isIndeterminate,
      handleOnSelectAllItems,
      handleOnSelectItem,
    } = useCheckable<Data>(data);

    return (
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <Checkbox
                data-testid="th-checkbox"
                className="m-auto"
                checked={allItemsSelected}
                indeterminate={isIndeterminate}
                onChange={() => handleOnSelectAllItems(allItemsSelected)}
              />
            </Table.Th>
            <Table.Th>Item</Table.Th>
            <Table.Th>Author</Table.Th>
            <Table.Th>Date</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>
              <Checkbox
                checked={selectedItems.includes(
                  'ab60dbdb-f3f0-4c99-a239-64c8a2f50c77',
                )}
                onChange={() => {
                  handleOnSelectItem('ab60dbdb-f3f0-4c99-a239-64c8a2f50c77');
                }}
              />
            </Table.Td>
            <Table.Td>Title</Table.Td>
            <Table.Td>John Doe</Table.Td>
            <Table.Td>Today</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>
              <Checkbox
                checked={selectedItems.includes(
                  'a0d86fe6-909e-4c4a-8ceb-c15daee525a9',
                )}
                onChange={() => {
                  handleOnSelectItem('a0d86fe6-909e-4c4a-8ceb-c15daee525a9');
                }}
              />
            </Table.Td>
            <Table.Td>Title 2</Table.Td>
            <Table.Td>Jane Doe</Table.Td>
            <Table.Td>Today</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    );
  },
};
