import { Meta, StoryObj } from '@storybook/react';

import { useState } from 'react';
import Dropdown from '../Dropdown';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown/SearchInput',
  component: Dropdown,
  decorators: [(Story) => <div style={{ height: '400px' }}>{Story()}</div>],
  parameters: {
    docs: {
      description: {
        component:
          '`Dropdown.SearchInput` adds a search field inside the menu. Place it at the top of `Dropdown.Menu` and add a `searchValue` prop to each `Dropdown.Item` to enable automatic filtering.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

const options = [
  'Tableau de bord',
  'Paramètres',
  'Profil utilisateur',
  'Aide et support',
  'Notifications',
  'Déconnexion',
];

export const Base: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Filtrage de `Dropdown.Item` via `searchValue`.',
      },
    },
  },
  render: (args) => (
    <Dropdown {...args}>
      <Dropdown.Trigger label="Choisir une option" />
      <Dropdown.Menu>
        <Dropdown.SearchInput placeholder="Rechercher..." />
        {options.map((label) => (
          <Dropdown.Item key={label} searchValue={label}>
            {label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  ),
};

const checkboxOptions = [
  { label: 'Tableau de bord', value: 1 },
  { label: 'Paramètres', value: 2 },
  { label: 'Profil utilisateur', value: 3 },
  { label: 'Aide et support', value: 4 },
  { label: 'Notifications', value: 5 },
];

export const WithCheckboxItems: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Filtrage de `Dropdown.CheckboxItem` via `searchValue`. Chaque item passe sa valeur textuelle à `searchValue` pour être filtré dynamiquement.',
      },
    },
  },
  render: (args) => {
    const [selected, setSelected] = useState<(string | number)[]>([]);

    const toggle = (value: string | number) => {
      setSelected((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value],
      );
    };

    return (
      <Dropdown {...args}>
        <Dropdown.Trigger
          label="Choisir des options"
          badgeContent={selected.length || undefined}
        />
        <Dropdown.Menu>
          <Dropdown.SearchInput placeholder="Rechercher..." />
          {checkboxOptions.map((option) => (
            <Dropdown.CheckboxItem
              key={option.value}
              value={option.value}
              model={selected}
              onChange={toggle}
              searchValue={option.label}
            >
              {option.label}
            </Dropdown.CheckboxItem>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  },
};

const radioOptions = [
  { label: 'Classe préparatoire', value: 'CP' },
  { label: 'Cours élémentaire 1', value: 'CE1' },
  { label: 'Cours élémentaire 2', value: 'CE2' },
  { label: 'Cours moyen 1', value: 'CM1' },
  { label: 'Cours moyen 2', value: 'CM2' },
];

export const WithRadioItems: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Filtrage de `Dropdown.RadioItem` via `searchValue`. Un seul item peut être sélectionné ; la recherche masque les items non correspondants.',
      },
    },
  },
  render: (args) => {
    const [value, setValue] = useState<string>('');

    return (
      <Dropdown {...args}>
        <Dropdown.Trigger label="Choisir une classe" />
        <Dropdown.Menu>
          <Dropdown.SearchInput placeholder="Rechercher..." />
          {radioOptions.map((option) => (
            <Dropdown.RadioItem
              key={option.value}
              value={option.value}
              model={value}
              onChange={setValue}
              searchValue={option.label}
            >
              {option.label}
            </Dropdown.RadioItem>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  },
};
