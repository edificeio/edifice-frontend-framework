import { ChangeEvent, MouseEvent, useState } from 'react';

import { Meta, StoryObj } from '@storybook/react';
import { IconBookmark, IconClose } from '../../modules/icons/components';
import { IconButton } from '../Button';
import Combobox, { ComboboxProps, OptionListItemType } from './Combobox';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Combobox> = {
  title: 'Components/Combobox',
  component: Combobox,
  decorators: [(Story) => <div style={{ height: '400px' }}>{Story()}</div>],
  args: {
    searchMinLength: 1,
    placeholder: 'Enter letters to start the search',
    options: [
      {
        value: 'First Item',
        label: 'First Item',
        icon: <IconBookmark />,
      },
      {
        value: 'Second Item',
        label: 'Second Item',
      },
      {
        value: 'Third Item',
        label: 'Third Item',
      },
      {
        value: 'Fourth Item',
        label: 'Fourth Item',
      },
      {
        value: 'Fifth Item',
        label: 'Fifth Item',
      },
      {
        value: 'Sixth Item',
        label: 'Sixth Item',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        component:
          'The Combobox component is a searchable dropdown that allows users to filter through a list of options as they type. It supports icons for options, minimum search length requirements, loading states, and handles both single and multiple selections. The component provides callbacks for search input changes and selection changes, making it flexible for various use cases. It also includes built-in support for no-results states and loading indicators.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Combobox>;

export const Base: Story = {
  render: (args: ComboboxProps) => {
    const [options, setOptions] = useState<OptionListItemType[]>([]);

    const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      const options = args.options.filter((option) =>
        (option.value as string)
          .toLowerCase()
          .includes(event.target.value.toLowerCase()),
      );
      setOptions(options);
    };

    const handleSearchResultsChange = async (model: (string | number)[]) => {
      const item = args.options.find((option) => option.value === model[0]);
      if (item) {
        alert('Click on ' + item);
      }
    };

    return (
      <Combobox
        {...args}
        options={options}
        noResult={options.length === 0}
        onSearchInputChange={handleSearchInputChange}
        onSearchResultsChange={handleSearchResultsChange}
      />
    );
  },
};

export const ComboboxLoading: Story = {
  render: (args: ComboboxProps) => {
    return (
      <Combobox
        {...args}
        isLoading
        onSearchResultsChange={() => {}}
        onSearchInputChange={() => {}}
      />
    );
  },
};

export const ComboboxNoResult: Story = {
  render: (args: ComboboxProps) => {
    return (
      <Combobox
        {...args}
        noResult
        onSearchResultsChange={() => {}}
        onSearchInputChange={() => {}}
      />
    );
  },
};

export const ComboboxRenderNoResult: Story = {
  render: (args: ComboboxProps) => {
    return (
      <Combobox
        {...args}
        noResult
        renderNoResult={
          <div className="p-4">
            Désolé nous avons trouvé aucun résultat pour votre recherche
          </div>
        }
        onSearchResultsChange={() => {}}
        onSearchInputChange={() => {}}
      />
    );
  },
};

export const ComboboxWithoutSeparator: Story = {
  render: (args: ComboboxProps) => {
    const originalOptions = args.options.map((option) => ({
      ...option,
      withSeparator: false,
    }));
    const [options, setOptions] = useState<OptionListItemType[]>([]);

    const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      const options = originalOptions.filter((option) =>
        (option.value as string)
          .toLowerCase()
          .includes(event.target.value.toLowerCase()),
      );
      setOptions(options);
    };

    const handleSearchResultsChange = async (model: (string | number)[]) => {
      const item = originalOptions.find((option) => option.value === model[0]);
      if (item) {
        alert('Click on ' + item);
      }
    };

    return (
      <Combobox
        {...args}
        options={options}
        noResult={options.length === 0}
        onSearchInputChange={handleSearchInputChange}
        onSearchResultsChange={handleSearchResultsChange}
      />
    );
  },
};

export const ComboboxRenderInputGroup: Story = {
  render: (args: ComboboxProps) => {
    return (
      <Combobox
        {...args}
        renderInputGroup={<span className="pe-8">Destinataires</span>}
        onSearchResultsChange={() => {}}
        onSearchInputChange={() => {}}
      />
    );
  },
};

export const ComboboxRenderSelectedItems: Story = {
  render: (args: ComboboxProps) => {
    const originalOptions = args.options;
    const [options, setOptions] = useState<OptionListItemType[]>([]);
    const [selectedItems, setSelectedItems] = useState<OptionListItemType[]>(
      [],
    );

    const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      const options = args.options.filter((option) =>
        (option.value as string)
          .toLowerCase()
          .includes(event.target.value.toLowerCase()),
      );
      setOptions(options);
    };

    const handleSearchResultsChange = async (model: (string | number)[]) => {
      const item = originalOptions.find((option) => option.value === model[0]);
      setOptions(
        options.filter(
          (option: OptionListItemType) => option.value !== model[0],
        ),
      );
      if (item) {
        alert('Click on ' + item);
      }
    };

    const handleRemoveItem = (item: OptionListItemType) => {
      setSelectedItems((prev) =>
        prev.filter((prevItem) => prevItem.value !== item.value),
      );
      args.options = [...args.options, item];
    };
    return (
      <Combobox
        {...args}
        onSearchInputChange={handleSearchInputChange}
        onSearchResultsChange={handleSearchResultsChange}
        variant="ghost"
        noResult={options.length === 0}
        renderSelectedItems={selectedItems.map((item) => {
          return (
            <div
              className="d-flex align-items-center text-nowrap me-8"
              key={item.value}
            >
              {item.label}
              <IconButton
                variant="ghost"
                icon={<IconClose />}
                onClick={() => handleRemoveItem(item)}
              />
            </div>
          );
        })}
      />
    );
  },
};

export const ComboboxRenderListItem: Story = {
  render: (args: ComboboxProps) => {
    const originalOptions = args.options;
    const [options, setOptions] = useState<OptionListItemType[]>([]);

    const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      const options = args.options.filter((option) =>
        (option.value as string)
          .toLowerCase()
          .includes(event.target.value.toLowerCase()),
      );
      setOptions(options);
    };

    const handleSearchResultsChange = async (model: (string | number)[]) => {
      const item = originalOptions.find((option) => option.value === model[0]);
      setOptions(
        options.filter(
          (option: OptionListItemType) => option.value !== model[0],
        ),
      );
      if (item) {
        alert('Click on ' + item);
      }
    };

    return (
      <Combobox
        {...args}
        options={options}
        onSearchInputChange={handleSearchInputChange}
        onSearchResultsChange={handleSearchResultsChange}
        variant="ghost"
        noResult={options.length === 0}
        renderListItem={(item) => {
          return (
            <div className="d-flex flex-column ms-4">
              <strong>{item.label}</strong>
              <span className="small text-gray-700">{item.label}</span>
            </div>
          );
        }}
      />
    );
  },
};

export const ComboboxDefaultOptions: Story = {
  render: (args: ComboboxProps) => {
    const originalOptions = args.options.map((option) => ({
      ...option,
      withSeparator: false,
    }));
    const [options, setOptions] = useState<OptionListItemType[]>([
      { ...args.options[0], withSeparator: false },
    ]);

    const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      const options = originalOptions.filter((option) =>
        (option.value as string)
          .toLowerCase()
          .includes(event.target.value.toLowerCase()),
      );
      setOptions(options);
    };
    const handleSearchResultsChange = async (model: (string | number)[]) => {
      const item = args.options.find((option) => option.value === model[0]);
      setOptions(
        options.filter(
          (option: OptionListItemType) => option.value !== model[0],
        ),
      );
    };

    return (
      <Combobox
        {...args}
        options={options}
        noResult={options.length === 0}
        onSearchInputChange={handleSearchInputChange}
        onSearchResultsChange={handleSearchResultsChange}
        hasDefault={true}
      />
    );
  },
};

export const ComboboxFull: Story = {
  render: (args: ComboboxProps) => {
    const originalOptions = args.options.map((option) => ({
      ...option,
      withSeparator: false,
    }));
    const [options, setOptions] = useState<OptionListItemType[]>([
      { ...args.options[0], withSeparator: false },
    ]);
    const [selectedItems, setSelectedItems] = useState<OptionListItemType[]>(
      [],
    );

    const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      const options = originalOptions.filter((option) =>
        (option.value as string)
          .toLowerCase()
          .includes(event.target.value.toLowerCase()),
      );
      setOptions(options);
    };
    const handleSearchResultsChange = async (model: (string | number)[]) => {
      const item = args.options.find((option) => option.value === model[0]);
      setOptions(
        options.filter(
          (option: OptionListItemType) => option.value !== model[0],
        ),
      );
      if (item) {
        setSelectedItems((prev) => [...prev, item]);
      }
    };

    const handleRemoveItem = (item: OptionListItemType, event: MouseEvent) => {
      setSelectedItems((prev) =>
        prev.filter((prevItem) => prevItem.value !== item.value),
      );
      setOptions([...options, { ...item, withSeparator: false }]);
      event.preventDefault();
      event.stopPropagation();
    };

    return (
      <Combobox
        {...args}
        options={options}
        noResult={options.length === 0}
        onSearchInputChange={handleSearchInputChange}
        onSearchResultsChange={handleSearchResultsChange}
        variant="ghost"
        renderInputGroup={<span>Destinataires </span>}
        renderSelectedItems={selectedItems.map((item) => {
          return (
            <div
              className="d-flex align-items-center text-nowrap ms-8"
              key={item.value}
            >
              {item.label}
              <IconButton
                variant="ghost"
                icon={<IconClose />}
                onClick={(event) => handleRemoveItem(item, event)}
              />
            </div>
          );
        })}
        renderListItem={(item) => {
          return (
            <div className="d-flex flex-column ms-4">
              <strong>{item.label}</strong>
              <span className="small text-gray-700">{item.label}</span>
            </div>
          );
        }}
        renderNoResult={
          <div className="p-4">
            Désolé nous avons trouvé aucun résultat pour votre recherche
          </div>
        }
        hasDefault={true}
      />
    );
  },
};
