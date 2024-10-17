import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checklist, Globe, Lock, Users } from '../../../../icons/dist';
import { Checkbox } from '../Checkbox';
import Table from './Table';

interface IRow {
  id: string;
  name: string;
  createdAt: number;
  creatorId: string;
  creatorName: string;
  modifiedAt: number;
  modifierId: string;
  modifierName: string;
  thumbnail: string;
  trashed: boolean;
  shared: boolean;
  numberOfShares: number;
  public: boolean;
  currentRole: string;
}

const data: IRow[] = [
  {
    id: '1',
    name: 'The form user',
    createdAt: 1677163550,
    creatorId: '1',
    creatorName: 'Guillaume Tell',
    modifiedAt: 1677163550,
    modifierId: '1',
    modifierName: 'Guillaume Tell',
    thumbnail:
      'https://media.istockphoto.com/id/1322277517/fr/photo/herbe-sauvage-dans-les-montagnes-au-coucher-du-soleil.jpg?s=612x612&w=0&k=20&c=tQ19uZQLlIFy8J6QWMyOL6lPt3pdSHBSDFHoXr1K_g0=',
    trashed: false,
    shared: true,
    numberOfShares: 49,
    public: true,
    currentRole: 'Gestionnaire',
  },
  {
    id: '2',
    name: 'Le blog des éco-délégués',
    createdAt: 1677163550,
    creatorId: '1',
    creatorName: 'Guillaume Tell',
    modifiedAt: 1677163550,
    modifierId: '1',
    modifierName: 'Guillaume Tell',
    thumbnail:
      'https://media.istockphoto.com/id/1322277517/fr/photo/herbe-sauvage-dans-les-montagnes-au-coucher-du-soleil.jpg?s=612x612&w=0&k=20&c=tQ19uZQLlIFy8J6QWMyOL6lPt3pdSHBSDFHoXr1K_g0=',
    trashed: false,
    shared: true,
    numberOfShares: 26,
    public: false,
    currentRole: 'Gestionnaire',
  },
  {
    id: '3',
    name: 'Le roman de renard',
    createdAt: 1677163550,
    creatorId: '1',
    creatorName: 'Guillaume Tell',
    modifiedAt: 1677163550,
    modifierId: '1',
    modifierName: 'Guillaume Tell',
    thumbnail:
      'https://media.istockphoto.com/id/1322277517/fr/photo/herbe-sauvage-dans-les-montagnes-au-coucher-du-soleil.jpg?s=612x612&w=0&k=20&c=tQ19uZQLlIFy8J6QWMyOL6lPt3pdSHBSDFHoXr1K_g0=',
    trashed: false,
    shared: true,
    numberOfShares: 12,
    public: true,
    currentRole: 'Gestionnaire',
  },
  {
    id: '4',
    name: 'La conjugaison pour les Nuls',
    createdAt: 1677163550,
    creatorId: '1',
    creatorName: 'Guillaume Tell',
    modifiedAt: 1677163550,
    modifierId: '1',
    modifierName: 'Guillaume Tell',
    thumbnail:
      'https://media.istockphoto.com/id/1322277517/fr/photo/herbe-sauvage-dans-les-montagnes-au-coucher-du-soleil.jpg?s=612x612&w=0&k=20&c=tQ19uZQLlIFy8J6QWMyOL6lPt3pdSHBSDFHoXr1K_g0=',
    trashed: false,
    shared: false,
    numberOfShares: 0,
    public: false,
    currentRole: 'Gestionnaire',
  },
  {
    id: '5',
    name: 'Qui était Jules César?',
    createdAt: 1677163550,
    creatorId: '1',
    creatorName: 'Guillaume Tell',
    modifiedAt: 1677163550,
    modifierId: '1',
    modifierName: 'Guillaume Tell',
    thumbnail:
      'https://media.istockphoto.com/id/1322277517/fr/photo/herbe-sauvage-dans-les-montagnes-au-coucher-du-soleil.jpg?s=612x612&w=0&k=20&c=tQ19uZQLlIFy8J6QWMyOL6lPt3pdSHBSDFHoXr1K_g0=',
    trashed: false,
    shared: true,
    numberOfShares: 29,
    public: false,
    currentRole: 'Gestionnaire',
  },
];

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    docs: {
      description: {
        component:
          'Table is a Compound Components, so you can create your own Table component with `Table.Tbody`, `Table.Tr`, `Table.Td`, `Table.Thead` and `Table.Th` subcomponents',
      },
    },
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Base: Story = {
  render: (args) => {
    return (
      <Table>
        <Table.Thead>
          <Table.Tr>
            {['Nom de la ressource', 'Création', 'Rôle'].map((theadItem) => (
              <Table.Th key={theadItem}>{theadItem}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((item) => (
            <Table.Tr>
              <Table.Td>
                <div className="d-flex gap-8 align-items-center">
                  <Checklist width={20} height={20} /> <div>{item.name}</div>
                </div>
              </Table.Td>
              <Table.Td>
                {new Date(item.createdAt * 1000).toLocaleDateString()}
              </Table.Td>
              <Table.Td className="fst-italic text-gray-700">
                {item.currentRole}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    );
  },
};

export const TableWithRowSelection: Story = {
  render: (args) => {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const onSelectItem = (itemId: string) => {
      setSelectedItems((currentSelection: string[]) => {
        const newSelection = [...currentSelection];
        if (!newSelection.includes(itemId)) {
          newSelection.push(itemId);
        } else {
          newSelection.splice(newSelection.indexOf(itemId), 1);
        }
        return newSelection;
      });
    };

    const onSelectAllItems = (deselect: boolean) => {
      setSelectedItems(() => {
        return deselect ? [] : data.map((item) => item.id);
      });
    };

    const isAllSelected = selectedItems?.length === data.length;
    const isIndeterminate =
      selectedItems?.length > 0 && selectedItems?.length < data.length;

    return (
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <Checkbox
                className="m-auto"
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                onChange={() => onSelectAllItems(isAllSelected)}
              />
            </Table.Th>
            {[
              'Nom de la ressource',
              'Création',
              'Auteur',
              'Partage',
              'Dernière modif',
              'Rôle',
            ].map((theadItem) => (
              <Table.Th key={theadItem}>{theadItem}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((item) => (
            <Table.Tr>
              <Table.Td>
                <Checkbox
                  checked={selectedItems.includes(item.id)}
                  onChange={() => {
                    onSelectItem(item.id);
                  }}
                />
              </Table.Td>
              <Table.Td>
                <div className="d-flex gap-8 align-items-center">
                  <Checklist width={20} height={20} /> <div>{item.name}</div>
                </div>
              </Table.Td>
              <Table.Td>
                {new Date(item.createdAt * 1000).toLocaleDateString()}
              </Table.Td>
              <Table.Td className="text-blue">{item.creatorName}</Table.Td>
              <Table.Td>
                <div className="d-flex align-items-center gap-4">
                  {item.public && <Globe width="16" height="16" />}
                  {item.shared && (
                    <>
                      <Users width="16" height="16" /> {item.numberOfShares}
                    </>
                  )}
                  {!item.public && !item.shared && (
                    <Lock width="16" height="16" />
                  )}
                </div>
              </Table.Td>
              <Table.Td className="fst-italic text-gray-700">
                Il y a 2 heures
              </Table.Td>
              <Table.Td className="fst-italic text-gray-700">
                {item.currentRole}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    );
  },
};
