import { Meta, StoryObj } from '@storybook/react';

import { useState } from 'react';
import { Filter } from '../../../../../icons/dist';
import Dropdown from '../Dropdown';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown/Dropdown Checkbox Item',
  component: Dropdown,
  decorators: [(Story) => <div style={{ height: '25em' }}>{Story()}</div>],
  args: {
    badgeContent: 0,
  },
  parameters: {
    docs: {
      description: {
        component:
          'Use `Dropdown.CheckboxItem` when a multi-selection is needed. `Dropdown.Trigger` can receive a `badgeContent` prop to display the total of selected items.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const CheckboxGroup: Story = {
  render: (args) => {
    const [selectedCheckboxes, setSelectedCheckboxes] = useState<
      (string | number)[]
    >([]);

    const handleMultiCheckbox = (value: string | number) => {
      let checked = [...selectedCheckboxes];
      const findIndex = checked.findIndex(
        (item: string | number): boolean => item === value,
      );

      if (!selectedCheckboxes.includes(value)) {
        checked = [...selectedCheckboxes, value];
      } else {
        checked = selectedCheckboxes.filter(
          (_, index: number) => index !== findIndex,
        );
      }

      setSelectedCheckboxes(checked);
    };

    const checkboxOptions = [
      { label: 'Choice 1', value: 1 },
      { label: 'Choice 2', value: 2 },
      { label: 'Choice 3', value: 3 },
    ];

    const count = selectedCheckboxes.length;

    return (
      <Dropdown>
        <Dropdown.Trigger
          label="Dropdown"
          icon={<Filter />}
          badgeContent={count || args.badgeContent}
        />
        <Dropdown.Menu>
          {checkboxOptions.map((option, index) => (
            <Dropdown.CheckboxItem
              key={index}
              value={option.value}
              model={selectedCheckboxes}
              onChange={() => handleMultiCheckbox(option.value)}
            >
              {option.label}
            </Dropdown.CheckboxItem>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  },
};

export const BadgeContent: Story = {
  render: (args) => {
    const [selectedCheckboxes, setSelectedCheckboxes] = useState<
      (string | number)[]
    >([1, 2]);

    const handleMultiCheckbox = (value: string | number) => {
      let checked = [...selectedCheckboxes];
      const findIndex = checked.findIndex(
        (item: string | number): boolean => item === value,
      );

      if (!selectedCheckboxes.includes(value)) {
        checked = [...selectedCheckboxes, value];
      } else {
        checked = selectedCheckboxes.filter(
          (_, index: number) => index !== findIndex,
        );
      }

      setSelectedCheckboxes(checked);
    };

    const checkboxOptions = [
      { label: 'Choice 1', value: 1 },
      { label: 'Choice 2', value: 2 },
      { label: 'Choice 3', value: 3 },
    ];

    const count = selectedCheckboxes.length;

    return (
      <Dropdown>
        <Dropdown.Trigger
          label="Dropdown"
          icon={<Filter />}
          badgeContent={count}
        />
        <Dropdown.Menu>
          {checkboxOptions.map((option, index) => (
            <Dropdown.CheckboxItem
              key={index}
              value={option.value}
              model={selectedCheckboxes}
              onChange={() => handleMultiCheckbox(option.value)}
            >
              {option.label}
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
          'A badge with the number of selected items is displayed. It is an optional prop',
      },
    },
  },
};
