import { Meta, StoryObj } from '@storybook/react';

import { useState } from 'react';
import { IconFilter } from '../../../modules/icons/components';
import Dropdown from '../Dropdown';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown/Dropdown Radio Item',
  component: Dropdown,
  decorators: [(Story) => <div style={{ height: '25em' }}>{Story()}</div>],
  args: {
    label: 'Dropdown',
    icon: <IconFilter />,
  },
  parameters: {
    docs: {
      description: {
        component:
          "The `Dropdown.RadioItem` component enables single-selection functionality within dropdowns. It's ideal for scenarios where users need to choose exactly one option from a list, such as selecting a filter value or changing a setting. Each radio item maintains its own checked state and triggers a change event when selected.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const WithSearch: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Ajout de `Dropdown.SearchInput` avec `searchValue` sur chaque item pour filtrer dynamiquement la liste de sélection unique.',
      },
    },
  },
  render: (args) => {
    const [value, setValue] = useState<string>('');

    const radioOptions = [
      { label: 'Classe préparatoire', value: 'CP' },
      { label: 'Cours élémentaire 1', value: 'CE1' },
      { label: 'Cours élémentaire 2', value: 'CE2' },
      { label: 'Cours moyen 1', value: 'CM1' },
      { label: 'Cours moyen 2', value: 'CM2' },
    ];

    return (
      <Dropdown>
        <Dropdown.Trigger label={args.label} icon={args.icon} />
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

export const RadioGroup: Story = {
  render: (args) => {
    const [value, setValue] = useState<string>('');

    const handleOnChangeRadio = (value: string) => {
      setValue(value);
    };

    const radioOptions = [
      {
        label: 'Classe préparatoire',
        value: 'CP',
      },
      {
        label: 'Cours élémentaire 1',
        value: 'CM1',
      },
      {
        label: 'Cours élémentaire 2',
        value: 'CM2',
      },
    ];

    return (
      <Dropdown>
        <Dropdown.Trigger label={args.label} icon={args.icon} />
        <Dropdown.Menu>
          {radioOptions.map((option, index) => (
            <Dropdown.RadioItem
              key={index}
              value={option.value}
              model={value}
              onChange={() => handleOnChangeRadio(option.value)}
            >
              {option.label}
            </Dropdown.RadioItem>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  },
};
