import { Meta, StoryObj } from '@storybook/react';

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
