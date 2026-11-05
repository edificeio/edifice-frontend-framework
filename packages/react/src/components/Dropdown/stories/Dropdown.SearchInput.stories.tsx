import { Meta, StoryObj } from '@storybook/react-vite';

import { useState } from 'react';
import {
  IconCode,
  IconEdit,
  IconFilter,
  IconMegaphone,
  IconMessageInfo,
  IconSettings,
  IconUsers,
} from '../../../modules/icons/components';
import Dropdown from '../Dropdown';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown/SearchInput',
  component: Dropdown,
  decorators: [(Story) => <div style={{ height: '400px' }}>{Story()}</div>],
  parameters: {
    docs: {
      description: {
        component:
          '`Dropdown.SearchInput` turns the trigger into a search field: when the menu opens, the search input takes the place of the trigger, gets the focus, and the list is displayed below. Place it at the top of `Dropdown.Menu` and add a `searchValue` prop to each item to enable automatic filtering (case and accent insensitive). Keyboard: `ArrowDown` moves from the search input to the first visible item, `ArrowUp` on the first item goes back to the search input, `Escape` closes the menu.',
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

const categories = [
  { value: 'administration', label: 'Administration', icon: <IconSettings /> },
  { value: 'communication', label: 'Communication', icon: <IconMessageInfo /> },
  { value: 'development', label: 'Développement', icon: <IconCode /> },
  { value: 'design', label: 'Design', icon: <IconEdit /> },
  { value: 'marketing', label: 'Marketing', icon: <IconMegaphone /> },
  { value: 'hr', label: 'RH', icon: <IconUsers /> },
];

export const FixedList: Story = {
  render: () => {
    const [value, setValue] = useState<string>();
    const selected = categories.find((category) => category.value === value);

    return (
      <div style={{ width: '360px' }}>
        <Dropdown block>
          <Dropdown.Trigger
            icon={selected?.icon}
            label={selected?.label ?? 'Sélectionner une catégorie'}
          />
          <Dropdown.Menu>
            <Dropdown.SearchInput
              placeholder="Rechercher une catégorie..."
              noResultsLabel="Aucune catégorie"
            />
            {categories.map((category) => (
              <Dropdown.Item
                key={category.value}
                icon={category.icon}
                searchValue={category.label}
                onClick={() => setValue(category.value)}
              >
                {category.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Selection in a fixed list: the user cannot enter free text, the search only filters the existing options. The trigger shows the selected option once chosen.',
      },
    },
  },
};

const levels = [
  { label: 'Classe préparatoire', value: 'CP' },
  { label: 'Cours élémentaire 1', value: 'CE1' },
  { label: 'Cours élémentaire 2', value: 'CE2' },
  { label: 'Cours moyen 1', value: 'CM1' },
  { label: 'Cours moyen 2', value: 'CM2' },
];

export const RadioItem: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');
    const selected = levels.find((level) => level.value === value);

    return (
      <Dropdown>
        <Dropdown.Trigger label={selected?.label ?? 'Choisir un niveau'} />
        <Dropdown.Menu>
          <Dropdown.SearchInput placeholder="Rechercher un niveau..." />
          {levels.map((level) => (
            <Dropdown.RadioItem
              key={level.value}
              value={level.value}
              model={value}
              onChange={setValue}
              searchValue={level.label}
            >
              {level.label}
            </Dropdown.RadioItem>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Single selection with `Dropdown.RadioItem`.',
      },
    },
  },
};

export const CheckboxItem: Story = {
  render: () => {
    const [values, setValues] = useState<(string | number)[]>([]);

    const toggle = (value: string | number) =>
      setValues((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value],
      );

    return (
      <Dropdown>
        <Dropdown.Trigger
          label="Niveaux"
          icon={<IconFilter />}
          badgeContent={values.length || undefined}
        />
        <Dropdown.Menu>
          <Dropdown.SearchInput placeholder="Rechercher un niveau..." />
          {levels.map((level) => (
            <Dropdown.CheckboxItem
              key={level.value}
              value={level.value}
              model={values}
              onChange={toggle}
              searchValue={level.label}
            >
              {level.label}
            </Dropdown.CheckboxItem>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Multiple selection with `Dropdown.CheckboxItem`: the menu stays open after each selection and the trigger shows the number of selected items.',
      },
    },
  },
};

const groups = [
  {
    label: 'Communication',
    apps: ['Actualités', 'Blog', 'Messagerie'],
  },
  {
    label: 'Collaboration',
    apps: ['Mur collaboratif', 'Wiki', 'Carte mentale'],
  },
  {
    label: 'Pédagogie',
    apps: ['Cahier de textes', 'Exercices et évaluations'],
  },
];

export const MenuGroup: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger label="Applications" />
      <Dropdown.Menu>
        <Dropdown.SearchInput placeholder="Rechercher une application..." />
        {groups.map((group) => (
          <Dropdown.MenuGroup key={group.label} label={group.label}>
            {group.apps.map((app) => (
              <Dropdown.Item key={app} searchValue={app}>
                {app}
              </Dropdown.Item>
            ))}
          </Dropdown.MenuGroup>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Items grouped with `Dropdown.MenuGroup`: a group is hidden when none of its items matches the search.',
      },
    },
  },
};

export const TriggerVariants: Story = {
  render: () => (
    <div className="d-flex gap-16 align-items-start">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Dropdown key={size}>
          <Dropdown.Trigger size={size} label={`Taille ${size}`} />
          <Dropdown.Menu>
            <Dropdown.SearchInput placeholder="Rechercher..." />
            {options.map((label) => (
              <Dropdown.Item key={label} searchValue={label}>
                {label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      ))}
      <Dropdown>
        <Dropdown.Trigger variant="ghost" label="Ghost" />
        <Dropdown.Menu>
          <Dropdown.SearchInput placeholder="Rechercher..." />
          {options.map((label) => (
            <Dropdown.Item key={label} searchValue={label}>
              {label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The search input takes the exact place and size of the trigger, whatever its size or variant.',
      },
    },
  },
};

const cities = [
  'Amiens',
  'Angers',
  'Besançon',
  'Bordeaux',
  'Brest',
  'Caen',
  'Clermont-Ferrand',
  'Dijon',
  'Grenoble',
  'Le Havre',
  'Le Mans',
  'Lille',
  'Limoges',
  'Lyon',
  'Marseille',
  'Metz',
  'Montpellier',
  'Nancy',
  'Nantes',
  'Nice',
  'Nîmes',
  'Orléans',
  'Paris',
  'Perpignan',
  'Reims',
  'Rennes',
  'Rouen',
  'Saint-Étienne',
  'Strasbourg',
  'Toulon',
  'Toulouse',
  'Tours',
];

export const LongList: Story = {
  render: () => {
    const [value, setValue] = useState<string>();

    return (
      <div style={{ width: '320px' }}>
        <Dropdown block>
          <Dropdown.Trigger label={value ?? 'Choisir une ville'} />
          <Dropdown.Menu>
            <Dropdown.SearchInput placeholder="Rechercher une ville..." />
            {cities.map((city) => (
              <Dropdown.Item
                key={city}
                searchValue={city}
                onClick={() => setValue(city)}
              >
                {city}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'With many items, the list scrolls below the search input.',
      },
    },
  },
};
